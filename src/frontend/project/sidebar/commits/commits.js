import React from 'react'
import styles from './commits.css'
import sharedStyles from '../sidebar.css'

export default class Commits extends React.Component {
  render() {
    return (
      <ul className={sharedStyles.container}>
        {this.props.commits.map(c => <li key={c.sha} className={styles.commit}>
          <a className={c === this.props.currentCommit ? styles.activeCommitTitle : styles.commitTitle}
             href={`/${this.props.project}/${c.sha}`}>
            {c.message}
          </a>
        </li>)}
      </ul>
    )
  }
}