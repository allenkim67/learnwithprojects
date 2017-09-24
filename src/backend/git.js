const path = require('path');
const _ = require('lodash');
const nodegit = require('nodegit');

function getRepo(project) {
  const projectPath = path.resolve(__dirname, '../../repos', project);
  return nodegit.Repository.open(projectPath);
}

async function getCommits(project) {
  const repo = await getRepo(project);
  const walker = repo.createRevWalk();
  walker.pushHead();
  return await walker.getCommitsUntil(c => true);
}

async function getDiff(commit) {
  const diffs = await commit.getDiff();
  const patches = await diffs[0].patches();
  //const hunks = await Promise.all(patches.map(patch => patch.hunks()));
  //const lines = await Promise.all(hunks.map(hunk => hunk[0].lines()));
  return patches.map(p => ({
    filePath: p.newFile().path(),
    newFile: p.status() == 1
  }))
}

async function getFiles(commit) {
  const tree = await commit.getTree();
  const diffs = await getDiff(commit);
  return getTreeFiles(tree, diffs);
}

async function getTreeFiles(tree, diffs) {
  const contentFiles = [];
  const entries = _.sortBy(tree.entries(), e => -e.isDirectory());
  const treeFiles = await _mapEntries(
    entries,
    parent => ({name: parent.name(), type: 'directory'}),
    async leaf => {
      if (_.includes(['.gitignore', '_teaching_notes.md'], leaf.name())) return null;

      const edited = _.find(diffs, d => d.filePath === leaf.path());
      const newFile = edited && edited.newFile;
      const status = newFile ? 'newFile' : edited ? 'editedFile' : 'uneditedFile';

      const file = {name: leaf.name(), type: 'file', status};

      if (edited) {
        contentFiles.push({...file, content: (await leaf.getBlob()).toString()});
      }

      return file;
    }
  );
  return {contentFiles, treeFiles}
}

async function _mapEntries(entries, handleParent, handleLeaf) {
  const mappedEntries = entries.map(async e => {
    if (e.isDirectory()) {
      return {
        ...handleParent(e),
        children: await _mapEntries(
          (await e.getTree()).entries(),
          handleParent,
          handleLeaf
        )
      }
    } else {
      return await handleLeaf(e);
    }
  });

  return _.compact(await Promise.all(mappedEntries));
}

async function getFileById(project, commitId, filePath) {
  const repo = await getRepo(project);
  const commit = await repo.getCommit(commitId);
  const tree = await commit.getTree();
  const entry = tree.entryByName(filePath);
  return {
    path: entry.path(),
    id: entry.id().toString(),
    content: (await entry.getBlob()).toString()
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

module.exports = {getCommits, getFiles, getDiff, getFileById, getTeachingNotes};