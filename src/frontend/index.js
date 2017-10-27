import 'regenerator-runtime/runtime'
import 'normalize.css'
import './global.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Project from './project/project'
import Analytics from './analytics'

const dev = location.hostname === '127.0.0.1' || location.hostname === 'localhost';

const app = <BrowserRouter>
  <div>
    {dev ? null : <Route path="/" component={Analytics}/>}
    <Route path="/:project/:lang/:commit?" component={Project}/>
  </div>
</BrowserRouter>;

ReactDOM.render(app, document.getElementById('root'));