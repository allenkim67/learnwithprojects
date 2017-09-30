import React from 'react'
import { Link } from 'react-router-dom'
import styles from './banner.css'

export default class Banner extends React.Component {
  render() {
    return (
      <div className={styles.banner}>
        <span>
          { this.props.prevCommit ?
            <Link to={`/${this.props.project}/${this.props.prevCommit.sha}`}>&lt;&lt; previous</Link> :
            null }
        </span>
        <span>
          {this.props.currentCommitMessage}
        </span>
        <span>
          { this.props.nextCommit ?
            <Link to={`/${this.props.project}/${this.props.nextCommit.sha}`}>next &gt;&gt;</Link> :
            null }
        </span>
      </div>
    );
  }
}