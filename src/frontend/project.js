import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import SyntaxHighlighter from 'react-syntax-highlighter'
import tomorrow from 'react-syntax-highlighter/dist/styles/tomorrow-night'
import TreeView from 'react-treeview'
import 'react-treeview/react-treeview.css'
import Markdown from 'react-markdown'
import SplitPane from 'react-split-pane'
import '!style-loader!css-loader!./split-pane.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import './global-treeview.css'

import styles from './project.css'

export default class Project extends React.Component {
  constructor(props) {
    super(props);
    // initialize state from server-side seeded data
    this.state = Object.assign({}, DATA, {fileTabIndex: 0});
  }

  render() {
    return (
      <SplitPane split="vertical" minSize={200} defaultSize={250}>
        <div className={styles.sideBar}>
          <Tabs>
            <TabList className={"react-tabs__tab-list " + styles.tabList}>
              <Tab>Commits</Tab>
              <Tab>Project</Tab>
            </TabList>

            <TabPanel>
              <ul className={styles.commitList}>
                {this.state.commits.map(c => <li key={c.sha} className={styles.commit}>
                  <a className={c.sha === this.state.commit ? styles.activeCommitTitle : styles.commitTitle}
                     href={`/${this.state.project}/${c.sha}`}>
                    {c.message}
                  </a>
                </li>)}
              </ul>
            </TabPanel>

            <TabPanel>
              <ul className={styles.treeview}>
                {this.createTreeView()}
              </ul>
            </TabPanel>
          </Tabs>
        </div>

        <SplitPane split="vertical" minSize={500} defaultSize="50%">
          <div className={styles.fileViewer}>
            <Tabs selectedIndex={this.state.fileTabIndex} onSelect={i => this.setState({fileTabIndex: i})}>
              <TabList className={"react-tabs__tab-list " + styles.tabList}>
                {this.state.contentFiles.map(f => <Tab key={f.name}>
                  <span className={styles[f.status]}>{f.name}</span>
                </Tab>)}
              </TabList>

              {this.state.contentFiles.map(f => <TabPanel key={f.name}>
                <SyntaxHighlighter language='python'
                                   style={tomorrow}
                                   className={styles.code}
                                   showLineNumbers={true}>
                  {f.content}
                </SyntaxHighlighter>
              </TabPanel>)}
            </Tabs>
          </div>

          <div className={styles.teachingNotesViewer}>
            <h2>Notes</h2>
            <Markdown source={this.state.teachingNotes}/>
          </div>
        </SplitPane>
      </SplitPane>
    );
  }

  async selectFile(file) {
    const idx = _findIndex(this.state.contentFiles, f => f.name === file.name);

    if (idx > -1) {
      this.setState({fileTabIndex: idx});
    } else {
      const url = `/${this.state.project}/${this.state.commit}/${file.name}`;
      const newFile = (await axios.get(url)).data;
      this.setState({
        contentFiles: [...this.state.contentFiles, newFile],
        fileTabIndex: this.state.contentFiles.length
      });
    }
  }

  createTreeView() {
    const createTreeViewIter = file => {
      if (file.type === 'file') {
        return (
          <div key={file.name}
               className={"tree-view_item " + styles[file.status]}
               onClick={this.selectFile.bind(this, file)}>
            {file.name}
          </div>
        )
      } else {
        return <TreeView key={file.name} nodeLabel={file.name}>
          {file.children.map(createTreeViewIter)}
        </TreeView>
      }
    };

    return <TreeView nodeLabel={this.state.project}>
      {this.state.treeFiles.map(createTreeViewIter)}
    </TreeView>;
  }
}