import React from 'react';
import LoginForm from "./components/login";
import Dashboard from "./components/dashboard";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={LoginForm}/>
            <Route exact path="/dashboard" component={Dashboard}/>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
