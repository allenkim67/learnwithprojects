import 'react-treeview/react-treeview.css'
import 'react-tabs/style/react-tabs.css'

import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Popover from 'react-popover'
import GoX from 'react-icons/go/x'
import styles from './code-view.css'
import sharedStyles from '../../shared.css'

import SyntaxHighlighter, { registerLanguage } from "@allenkim67/react-syntax-highlighter/dist/light"
import js from '@allenkim67/react-syntax-highlighter/dist/languages/javascript';
import python from '@allenkim67/react-syntax-highlighter/dist/languages/python';
import tomorrow from '@allenkim67/react-syntax-highlighter/dist/styles/tomorrow-night'

registerLanguage('javascript', js);
registerLanguage('python', python);

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
            <SyntaxHighlighter language={this.props.lang}
                               style={tomorrow}
                               className={styles.code}
                               customStyle={{paddingLeft: 0}}
                               showLineNumbers={true}
                               lineNumberStyle={this.lineStyle.bind(this, f)}
                               LineNumberWrapper={LineNumberWrapper(f)}>
              {f.content}
            </SyntaxHighlighter>
          </TabPanel>)}
        </Tabs>
      </div>
    );
  }

  lineStyle(file, lineNumber) {
    const shared = {
      paddingLeft: '7px',
      paddingRight: '5px',
      width: '22px',
      display: 'block',
      textAlign: 'right'
    };
    const stylesMap = {
      'add': {...shared, background: '#0c980d'},
      'change': {...shared, cursor: 'pointer', background: '#10849a'},
      'remove': {...shared, cursor: 'pointer', background: 'grey'}
    };
    const diff = file.diff && diffMatcher(file.diff, lineNumber);
    return diff ? stylesMap[diff.type] : shared;
  }
}

function LineNumberWrapper(file) {
  return class extends React.Component {
    state = {
      isOpen: false
    };

    file = file;

    toggle(toState=null) {
      this.setState({isOpen: toState === null ? !this.state.isOpen : toState});
    }

    render() {
      return (
        <div onClick={this.clickHandler.bind(this)}>
          <Popover
            isOpen={this.state.isOpen}
            body={this.diffDisplay()}
            preferPlace="right"
            onOuterAction={() => this.toggle(false)}
            children={this.props.children}/>
        </div>
      )
    }

    clickHandler() {
      const diff = this.file.diff && diffMatcher(this.file.diff, this.props.lineNumber);
      if (diff && diff.type !== 'add') {
        this.toggle(true);
      }
    }

    diffDisplay() {
      const diff = this.file.diff && diffMatcher(this.file.diff, this.props.lineNumber);
      const style = {
        fontSize: 'smaller',
        border: 'thin solid grey'
      };
      return diff ? (
        <SyntaxHighlighter language={this.props.lang}
                           style={tomorrow}
                           customStyle={style}>
          {diff.oldContent}
        </SyntaxHighlighter>
      ) : '';
    }
  }
}

function diffMatcher(diffs, lineNumber) {
  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i];
    if (lineNumber >= diff.start && lineNumber <= diff.end) {
      return diff;
    }
  }
  return null;
}