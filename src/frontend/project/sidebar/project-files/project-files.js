import React from 'react'
import TreeView from 'react-treeview'
import GoFileCode from 'react-icons/go/file-code'
import GoFileDirectory from 'react-icons/go/file-directory'
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
          <div key={file.name} onClick={this.props.selectFile.bind(this, file)}>
            <GoFileCode className={styles.icon}/>
            <span className={"tree-view_item " + fileStyles[file.status]}>
              {file.name}
            </span>
          </div>
        )
      } else {
        const dirLabel = <span>
          <GoFileDirectory className={styles.icon}/>
          {file.name}
        </span>;

        return <TreeView key={file.name} nodeLabel={dirLabel}>
          {file.children.map(createTreeViewIter)}
        </TreeView>
      }
    };

    const projectLabel = <span>
      <GoFileDirectory className={styles.icon}/>
      {this.props.project}
    </span>;

    return <TreeView nodeLabel={projectLabel}>
      {treeFiles.map(createTreeViewIter)}
    </TreeView>;
  }
}