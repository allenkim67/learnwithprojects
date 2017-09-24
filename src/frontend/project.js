import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _find from 'lodash/find'
import SyntaxHighlighter from 'react-syntax-highlighter'
import tomorrow from 'react-syntax-highlighter/dist/styles/tomorrow-night'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import Markdown from 'react-markdown'

import styles from './project.css'

export default class Project extends React.Component {
  constructor(props) {
    super(props);
    // initialize state from server-side seeded data
    this.state = DATA;
  }

  render() {
    return (
      <div>
        <div className={styles.sideBar}>
          <h2>Commits</h2>
          <ul>
            {this.state.commits.map(c => <li key={c.sha}>
              <a className={c.sha === this.state.commit ? styles.activeCommit : ''}
                 href={`/${this.state.project}/${c.sha}`}>
                {c.message}
              </a>
            </li>)}
          </ul>

          <h2>Project</h2>
          <ul>
            {this.state.treeFiles.map(this.createTreeView.bind(this))}
          </ul>
        </div>

        <div className={styles.fileViewer}>
          <h2>Files</h2>
          {this.state.contentFiles.map(f => <div key={f.name}>
            <h3 className={styles[f.status]}>{f.name}</h3>
            <SyntaxHighlighter language='python' style={tomorrow}>
              {f.content}
            </SyntaxHighlighter>
          </div>)}
        </div>

        <div className={styles.teachingNotesViewer}>
          <h2>Notes</h2>
          <Markdown source={this.state.teachingNotes}/>
        </div>
      </div>
    );
  }

  async fetchFile(f) {
    if (_find(this.state.contentFiles, cf => cf.name == f.name)) {

    } else {
      const url = `/${this.state.project}/${this.state.commit}/${f.name}`;
      const resp = await axios.get(url);
      this.setState({contentFiles: [...this.state.contentFiles, resp.data]})
    }
  }

  createTreeView(file) {
    if (file.type === 'file') {
      return <div key={file.name} className={styles[file.status]}>
        {file.name}
      </div>
    } else {
      return <TreeView key={file.name}
                       className={styles[file.status]}
                       nodeLabel={file.name}>
        {file.children.map(this.createTreeView)}
      </TreeView>
    }
  }
}