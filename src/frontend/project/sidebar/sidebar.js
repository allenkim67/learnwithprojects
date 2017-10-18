import 'react-tabs/style/react-tabs.css'

import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Commits from './commits/commits'
import ProjectFiles from './project-files/project-files'
import styles from '../../shared.css'

export default class Sidebar extends React.Component {
  render() {
    return (
      <div>
        <Tabs>
          <TabList className={"react-tabs__tab-list " + styles.tabList}>
            <Tab>Project</Tab>
            <Tab>Commits</Tab>
          </TabList>

          <TabPanel>
            <ProjectFiles treeFiles={this.props.treeFiles}
                          selectFile={this.props.selectFile}
                          project={this.props.project}
                          lang={this.props.lang}/>
          </TabPanel>

          <TabPanel>
            <Commits commits={this.props.commits}
                     project={this.props.project}
                     lang={this.props.lang}
                     currentCommit={this.props.currentCommit}/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}