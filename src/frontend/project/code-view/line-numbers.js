import React from 'react'
import styles from './line-numbers.css'
import _range from 'lodash/range'

export default class LineNumber extends React.Component {
  render() {
    return (
      <pre><code>
      <div className={styles.container}>
        {_range(1, this.props.numLines + 1).map(n => <div key={n}>{n}</div>)}
      </div>
        </code></pre>
    );
  }
}