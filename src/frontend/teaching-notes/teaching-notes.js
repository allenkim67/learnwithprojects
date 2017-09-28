import React from 'react'
import Markdown from 'react-markdown'

export default class TeachingNotes extends React.Component {
  render() {
    return (
      <div>
        <h2>Notes</h2>
        <Markdown source={this.props.teachingNotes}/>
      </div>
    );
  }
}