import React from 'react'
import styles from './banner.css'

export default class Banner extends React.Component {
  render() {
    return (
      <div className={styles.banner}>
        <span>
          { this.props.prevCommit ?
            <a href={`/${this.props.project}/${this.props.prevCommit.sha}`}>&lt;&lt; previous</a> :
            null }
        </span>
        <span>
          {this.props.currentCommitMessage}
        </span>
        <span>
          { this.props.nextCommit ?
            <a href={`/${this.props.project}/${this.props.nextCommit.sha}`}>next &gt;&gt;</a> :
            null }
        </span>
      </div>
    );
  }
}