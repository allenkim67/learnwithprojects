const _ = require('lodash');

function bfs(tree, fn) {
  let queue = [tree];

  while (queue.length) {
    const node = queue.pop();
    if (fn(node)) { return node } else {
      if (node.children) {
        queue = node.children.concat(queue);
      }
    }
  }

  return null;
}

function map(node, fn) {
  return node.children ?
    {...fn(node), children: node.children.map(child => map(child, fn))} :
    fn(node);
}

function prune(node, fn) {
  return node.children ?
    {...node, children: node.children.filter(child => prune(child, fn))} :
    fn(node) ? null : node;
}

function leafOnly(node) {
  if (node.children) {
    return _.flatten(node.children.map(leafOnly));
  } else {
    return node;
  }
}

module.exports = {bfs, map, prune, leafOnly};