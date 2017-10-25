import 'react-treeview/react-treeview.css'
import 'react-tabs/style/react-tabs.css'

import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import GoX from 'react-icons/go/x'
import styles from './code-view.css'
import LineNumbers from './line-numbers'
import sharedStyles from '../../shared.css'
import 'highlight.js/styles/tomorrow-night.css'

export default class CodeView extends React.Component {
  render() {
    return (
      <div>
        <Tabs selectedIndex={this.props.fileTabIndex} onSelect={this.props.setFileTabIndex}>
          <TabList className={"react-tabs__tab-list " + sharedStyles.tabList}>
            {this.props.contentFiles.map(f => <Tab key={f.name}
                                                   className={"react-tabs__tab " + styles.tab}>
              <span className={sharedStyles[f.status]}>{f.name}</span>
              <GoX onClick={this.props.closeFileTab.bind(this, f)}
                   className={styles.closeIcon}/>
            </Tab>)}
          </TabList>

          {this.props.contentFiles.map(f => <TabPanel key={f.name}>
            <div className={styles.code}>
              <LineNumbers numLines={f.numLines}/>
              <div dangerouslySetInnerHTML={{ __html: f.content }}/>
            </div>
          </TabPanel>)}
        </Tabs>
      </div>
    );
  }
}