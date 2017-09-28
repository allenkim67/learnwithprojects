import React from 'react'
import styles from './banner.css'

export default class Banner extends React.Component {
  render() {
    return (
      <div>
        <span>
          { this.prevCommitSha ?
            <a href={`/${this.props.project}/${this.props.prevCommit.sha}`}>&lt;&lt; previous</a> :
            null }
        </span>
        <span>
          {this.currentCommitMessage}
        </span>
        <span>
          { this.nextCommitSha ?
            <a href={`/${this.state.project}/${this.props.nextCommit.sha}`}>next &gt;&gt;</a> :
            null }
        </span>
      </div>
    );
  }
}