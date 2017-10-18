import React from 'react'
import { Link } from 'react-router-dom'
import styles from './commits.css'
import sharedStyles from '../sidebar.css'

export default class Commits extends React.Component {
  render() {
    return (
      <ul className={sharedStyles.container}>
        {this.props.commits.map(c => <li key={c.sha} className={styles.commit}>
          <Link className={c.sha === this.props.currentCommit ? styles.activeCommitTitle : styles.commitTitle}
                to={`/${this.props.project}/${this.props.lang}/${c.sha}`}>
            {c.message}
          </Link>
        </li>)}
      </ul>
    );
  }
}