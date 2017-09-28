import React from 'react'
import TreeView from 'react-treeview'
import styles from './project-files.css'
import fileStyles from '../../../shared.css'
import sidebarStyles from '../sidebar.css'

export default class ProjectFiles extends React.Component {
  render() {
    return (
      <div className={sidebarStyles.container}>
        <ul className={styles.treeview}>
          {this.createTreeView(this.props.treeFiles)}
        </ul>
      </div>
    );
  }

  createTreeView(treeFiles) {
    const createTreeViewIter = file => {
      if (file.type === 'file') {
        return (
          <div key={file.name}
               className={"tree-view_item " + fileStyles[file.status]}
               onClick={this.props.selectFile.bind(this, file)}>
            {file.name}
          </div>
        )
      } else {
        return <TreeView key={file.name} nodeLabel={file.name}>
          {file.children.map(createTreeViewIter)}
        </TreeView>
      }
    };

    return <TreeView nodeLabel={this.props.project}>
      {treeFiles.map(createTreeViewIter)}
    </TreeView>;
  }
}