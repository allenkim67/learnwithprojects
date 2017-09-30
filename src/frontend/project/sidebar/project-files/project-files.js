import React from 'react'
import TreeView from 'react-treeview'
import GoFileCode from 'react-icons/go/file-code'
import GoFileDirectory from 'react-icons/go/file-directory'
import styles from './project-files.css'
import fileStyles from '../../../shared.css'
import sidebarStyles from '../sidebar.css'

export default class ProjectFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dirCollapsed: {}
    };
  }

  render() {
    return (
      <div className={sidebarStyles.container}>
        <ul className={styles.treeview}>
          {this.createTreeView(this.props.treeFiles)}
        </ul>
      </div>
    );
  }

  createTreeView(entry) {
    if (entry.type === 'directory') {
      const dirLabel = (
        <span className={styles.treeviewItem}
              onClick={this.toggleCollapse.bind(this, entry.name)}>
          <GoFileDirectory className={styles.icon}/>
          {entry.name}
        </span>
      );
      return (
        <TreeView key={entry.name}
                  nodeLabel={dirLabel}
                  collapsed={this.state.dirCollapsed[entry.name]}
                  onClick={this.toggleCollapse.bind(this, entry.name)}>
          {entry.children.map(this.createTreeView.bind(this))}
        </TreeView>
      );
    } else {
      return (
        <div key={entry.name}
             onClick={this.props.selectFile.bind(this, entry)}
             className={styles.treeviewItem}>
          <GoFileCode className={styles.icon}/>
          <span className={"tree-view_item " + fileStyles[entry.status]}>
            {entry.name}
          </span>
        </div>
      );
    }
  }

  toggleCollapse(name) {
    const newDirCollapsed = {
      ...this.state.dirCollapsed,
      [name]: !this.state.dirCollapsed[name]
    };
    this.setState({dirCollapsed: newDirCollapsed});
  }
}