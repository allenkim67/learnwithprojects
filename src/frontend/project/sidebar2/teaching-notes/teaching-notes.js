import React from 'react'
import Markdown from 'react-markdown'
import styles from './teaching-notes.css'

export default class TeachingNotes extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Markdown source={this.props.teachingNotes}/>
        </div>
      </div>
    );
  }
}