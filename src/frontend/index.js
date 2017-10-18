import 'regenerator-runtime/runtime'
import 'normalize.css'
import './global.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Project from './project/project'

const app = <BrowserRouter>
  <Route path="/:project/:lang/:commit?" component={Project}/>
</BrowserRouter>;

ReactDOM.render(app, document.getElementById('root'));