import 'react-treeview/react-treeview.css'
import 'react-tabs/style/react-tabs.css'

import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import SyntaxHighlighter from '@allenkim67/react-syntax-highlighter'
import tomorrow from '@allenkim67/react-syntax-highlighter/dist/styles/tomorrow-night'
import styles from './fileview.css'
import sharedStyles from '../../shared.css'

export default class FileView extends React.Component {
  render() {
    return (
      <div>
        <Tabs selectedIndex={this.props.fileTabIndex} onSelect={this.props.setFileTabIndex}>
          <TabList className={"react-tabs__tab-list " + sharedStyles.tabList}>
            {this.props.contentFiles.map(f => <Tab key={f.name}>
              <span className={sharedStyles[f.status]}>{f.name}</span>
            </Tab>)}
          </TabList>

          {this.props.contentFiles.map(f => <TabPanel key={f.name}>
            <SyntaxHighlighter language='python'
                               style={tomorrow}
                               className={styles.code}
                               showLineNumbers={true}
                               lineNumberContainerStyle={this.lineStyle(f)}
                               LineNumberWrapper={LineNumberWrapper(f)}>
              {f.content}
            </SyntaxHighlighter>
          </TabPanel>)}
        </Tabs>
      </div>
    );
  }

  lineStyle(f) {

  }
}

function LineNumberWrapper(file) {
  return class extends React.Component {
    state = {
      isOpen: false
    };

    render() {
      return (
        <div onClick={this.clickHandler.bind(this, this.props.lineNumber)}>
          {this.props.children}
        </div>
      )
    }

    clickHandler(lineNumber) {
      console.log(lineNumber);
      console.log(file);
    }
  }
}