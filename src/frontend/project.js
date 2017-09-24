import React from 'react'
import ReactDOM from 'react-dom'

export default class Project extends React.Component {
  render() {
    return (
      <div>
        <h2>Commits</h2>
        <ul>
          {this.props.commits.map(c => <li key={c.sha}>
            <a href={`${this.props.project}/${c.sha}`}>{c.message}</a>
          </li>)}
        </ul>

        <h2>Project</h2>
        <ul>
          {this.props.treeFiles.map(f => <li key={f.name}>
            {f.name}
          </li>)}
        </ul>

        <h2>Files</h2>
        {this.props.contentFiles.map(f => <div key={f.path}>
          <h3>{f.path}</h3>
          <pre>
            <code>{f.content}</code>
          </pre>
        </div>)}
      </div>
    );
  }
}