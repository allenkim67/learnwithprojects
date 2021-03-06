const path = require('path');
const _ = require('lodash');
const nodegit = require('nodegit');
const treeUtil = require('../shared/tree-util');
const hljs = require('highlight.js');

const FILE_EXCLUDES = ['.gitignore', '_teaching_notes.md', 'node_modules', 'package-lock.json'];

async function getCommits(project, lang) {
  const repo = await _getRepo(project, lang);
  const walker = repo.createRevWalk();
  walker.pushHead();
  return await walker.getCommitsUntil(c => true);
}

async function getFiles(project, lang, commit, force=[]) {
  let tree = await _entryTree(await commit.getTree(), {excludes: FILE_EXCLUDES});
  const diffs = await _getDiff(commit, lang);
  const treeFiles = treeUtil.map(tree, node => _formatEntry(node, diffs, project));

  return {
    treeFiles,
    contentFiles: await _getContentFiles(tree, diffs, lang, force)
  };
}

function _getContentFiles(tree, diffs, lang, force=[]) {
  return Promise.all(treeUtil.leafOnly(tree)
    .filter(node => _.includes(force, node.entry.path()) ||
                    _.includes(['newFile', 'editedFile'], _getStatus(node, diffs)))
    .map(async node => {
      const content = (await node.entry.getBlob()).toString();
      return {
        ..._formatEntry(node, diffs),
        content: _highlight(lang, content),
        numLines: (content.match(/\r?\n/g) || '').length + 1,
        diff: diffs[node.entry.path()] ? diffs[node.entry.path()].diffs : null
      };
    })
  );
}

function _highlight(lang, value) {
  return '<pre class="hljs"><code>' + hljs.highlight(lang, value).value + '</code></pre>'
}

function _formatEntry(node, diffs, project) {
  const newNode = node.entry instanceof nodegit.Tree ?
    {name: project, path: ''} :
    {name: node.entry.name(), path: node.entry.path()};

  return node.children ?
    {...newNode, type: 'directory'} :
    {...newNode, type: 'file', status: _getStatus(node, diffs)};
}

function _getStatus(node, diffs) {
  const edited = diffs[node.entry.path()];
  const newFile = edited && edited.newFile;
  return newFile ? 'newFile' : edited ? 'editedFile' : 'uneditedFile';
}

async function getFileByPath(project, lang, commitId, path) {
  const repo = await _getRepo(project, lang);
  const commit = await repo.getCommit(commitId);
  const diffs = await _getDiff(commit, lang);
  const tree = await _entryTree(await commit.getTree());
  const node = await treeUtil.bfs(tree, node => {
    return !node.children && node.entry.path() === path;
  });

  const content = (await node.entry.getBlob()).toString();

  return {
    ..._formatEntry(node, diffs, project),
    content: _highlight(lang, content),
    numLines: (content.match(/\r?\n/g) || '').length + 1
  }
}

async function getTeachingNotes(commit) {
  const tree = await commit.getTree();
  try {
    const entry = tree.entryByName('_teaching_notes.md');
    return (await entry.getBlob()).toString();
  } catch (e) {
    return '';
  }
}

function _getRepo(project, lang) {
  const projectPath = path.resolve(__dirname, '../../repos', project, lang);
  return nodegit.Repository.open(projectPath);
}

async function _getDiff(commit, lang) {
  const diffs = await commit.getDiff();
  const patches = await diffs[0].patches();

  return patches.reduce(async (acc, p) => {
    return {
      ...(await acc),
      [p.newFile().path()]: {
        newFile: p.status() == 1,
        diffs: await patchDiffs(p)
      }
    };
  }, {});

  async function patchDiffs(p) {
    const hunks = await p.hunks();
    const lines = _.flatten(
      await Promise.all(
        hunks.map(h => h.lines())
      )
    );
    return groupLines(lines);
  }

  function groupLines(lines) {
    const groups = lines
      .reduce((acc, line, i) => {
        const addedOrRemoved = _.includes([line.newLineno(), line.oldLineno()], -1);
        const emptyArray = _.last(acc) && _.last(acc).length === 0;
        if (!i || !emptyArray && !addedOrRemoved) acc.push([]);
        if (addedOrRemoved) _.last(acc).push(line);
        return acc;
      }, [])
      .filter(arr => arr.length !== 0);

    return groups.map(g => {
      const type = _.every(g, line => line.newLineno() === -1) ?
        'remove' :
        _.every(g, line => line.oldLineno() === -1) ?
          'add':
          'change';

      const [removedLines, addedLines] = _.partition(g, l => l.newLineno() === -1);

      const [start, end] = addedLines.length ?
        [addedLines[0].newLineno(), _.last(addedLines).newLineno()] :
        [removedLines[0].oldLineno(), removedLines[0].oldLineno()];

      const oldContent = removedLines.reduce((content, line) => content + line.content(), '');

      return {
        start,
        end,
        type,
        oldContent: _highlight(lang, oldContent)
      };
    });
  }
}

async function _entryTree(entry, opts={}) {
  if (entry.name && _.includes(opts.excludes, entry.name())) return null;

  if (entry instanceof nodegit.Tree || entry.isTree()) {
    const tree = entry instanceof nodegit.Tree ? entry : await entry.getTree();
    return {
      entry,
      children: _.compact(await Promise.all(tree.entries().map(e => _entryTree(e, opts))))
    }
  } else {
    return {entry};
  }
}

module.exports = {getCommits, getFiles, getFileByPath, getTeachingNotes};