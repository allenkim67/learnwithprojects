const router = require('express').Router();
const _ = require('lodash');
const git = require('./git');

// GET ALL DATA FOR A COMMIT
router.post('/:project/:lang/:commit?', async (req, res) => {
  const commits = _.reverse(await git.getCommits(req.params.project, req.params.lang));
  const commit = _.find(commits, c => c.sha() == req.params.commit) || commits[0];
  const {treeFiles, contentFiles} = await git.getFiles(req.params.project, commit, req.body.force);

  res.json({
    lang: req.params.lang,
    project: req.params.project,
    commit: commit.sha(),
    commits: commits.map(c => ({message: c.message(), sha: c.sha()})),
    treeFiles: treeFiles,
    contentFiles,
    teachingNotes: await git.getTeachingNotes(commit)
  });
});

// GET SINGLE FILE FOR A COMMIT
router.get('/:project/:lang/:commit/:path(*)', async (req, res) => {
  const {project, lang, commit, path} = req.params;
  const file = await git.getFileByPath(project, lang, commit, path);
  res.json(file);
});

module.exports = router;