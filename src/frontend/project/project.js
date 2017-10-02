import React from 'react'
import axios from 'axios'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _sortBy from 'lodash/sortBy'
import _includes from 'lodash/includes'
import SplitPane from 'react-split-pane'
import styles from './project.css'

import Sidebar from './sidebar/sidebar'
import FileView from './fileview/fileview'
import TeachingNotes from './teaching-notes/teaching-notes'
import Banner from './banner/banner'

export default class Project extends React.Component {
  state = {
    fileTabIndex: 0,
    treeFiles: {},
    commits: [],
    commit: '',
    contentFiles: [],
    teachingNotes: ''
  };

  async fetchData(project, commit) {
    const url = `/api/${project}/${commit || ''}`;
    const data = (await axios.get(url)).data;

    this.setState({
      ...data,
      ...this.newContentFiles(data)
    });
  }

  newContentFiles(newData) {
    const selected = this.state.contentFiles[this.state.fileTabIndex];
    const contentFiles = _sortBy(newData.contentFiles, 'name');
    const fileTabIndex = selected ? _findIndex(contentFiles, f => f.path === selected.path) : 0;
    return {
      contentFiles,
      fileTabIndex: fileTabIndex > -1 ? fileTabIndex : 0
    };
  }

  componentWillMount() {
    this.fetchData(this.props.match.params.project, this.props.match.params.commit);
  }

  componentWillReceiveProps(newProps) {
    this.fetchData(newProps.match.params.project, newProps.match.params.commit);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <SplitPane split="vertical" minSize={200} defaultSize={250}>
            <Sidebar commits={this.state.commits}
                     currentCommit={this.state.commit}
                     treeFiles={this.state.treeFiles}
                     selectFile={this.selectFile.bind(this)}
                     project={this.state.project}/>
            <SplitPane split="vertical" minSize={500} defaultSize="60%">
              <FileView contentFiles={this.state.contentFiles}
                        fileTabIndex={this.state.fileTabIndex}
                        setFileTabIndex={i => this.setState({fileTabIndex: i})}/>
              <TeachingNotes teachingNotes={this.state.teachingNotes}/>
            </SplitPane>
          </SplitPane>
        </div>
        <div className={styles.footer}>
          <Banner currentCommitMessage={this.currentCommit() ? this.currentCommit().message : ''}
                  prevCommit={this.prevCommit()}
                  nextCommit={this.nextCommit()}
                  project={this.state.project}/>
        </div>
      </div>
    );
  }

  async selectFile(file) {
    const idx = _findIndex(this.state.contentFiles, f => f.path === file.path);

    if (idx > -1) {
      this.setState({fileTabIndex: idx});
    } else {
      const url = `/api/${this.state.project}/${this.state.commit}/${file.path}`;
      const newFile = (await axios.get(url)).data;
      this.setState({
        contentFiles: [...this.state.contentFiles, newFile],
        fileTabIndex: this.state.contentFiles.length
      });
    }
  }

  currentCommit() {
    return _find(this.state.commits, c => c.sha === this.state.commit);
  }

  prevCommit() {
    const i = _findIndex(this.state.commits, c => c === this.currentCommit());
    return i > 0 ? this.state.commits[i -1] : null;
  }

  nextCommit() {
    const i = _findIndex(this.state.commits, c => c === this.currentCommit());
    return i < this.state.commits.length - 1 ? this.state.commits[i + 1] : null;
  }
}