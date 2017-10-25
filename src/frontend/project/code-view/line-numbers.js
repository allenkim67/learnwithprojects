import React from 'react'
import styles from './line-numbers.css'
import _range from 'lodash/range'
import _last from 'lodash/last'
import ReactTooltip from 'react-tooltip'

export default class LineNumbers extends React.Component {
  render() {
    return (
      <pre><code className={styles.container}>
        {this.groupLines().map((group, i) =>
          <LineNumberGroup key={i} group={group} file={this.props.file}/>
        )}
      </code></pre>
    );
  }

  groupLines() {
    if (!this.props.file.diff) {
      return [{start: 1, end: this.props.file.numLines}];
    }

    const groups = this.props.file.diff.reduce((acc, diff) => {
      _last(acc).end = diff.start - 1;
      acc.push(diff);
      acc.push({start: diff.end + 1});
      return acc;
    }, [{start: 1}]);

    if (_last(groups).start > this.props.file.numLines) {
      groups.pop();
    } else {
      _last(groups).end = this.props.file.numLines;
    }
    return groups;
  }
}

class LineNumberGroup extends React.Component {
  state = {isOpen: false};

  toggle(toState=null) {
    this.setState({isOpen: toState === null ? !this.state.isOpen : toState});
  }

  render() {
    const diff = this.props.group;

    return diff.type && diff.type !== 'add' ? (
      <div>
        <a data-tip={diff.oldContent} data-event='click focus'>{this.lineNo()}</a>
        <ReactTooltip place="right" globalEventOff='click' />
      </div>
    ) : this.lineNo();
  }

  lineNo() {
    const group = this.props.group;
    return <div className={group.type ? styles[group.type] : styles.line}>
      {_range(group.start, group.end + 1).map(n => <div key={n}>{n}</div>)}
    </div>;
  }
}