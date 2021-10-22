import './App.css';
import * as React from 'react';
import Navbar from "./Navbar";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Login from "./Login";
import Tabs from "./Tabs";
import Chat from "./Chat";

// import "./styles.css";

export default function App() {

  return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Tabs} />
            <Route path='/login' component={Login} />
            <Route path='/chat/:id' component={Chat} />

          </Switch>
        </div>
      </BrowserRouter>
  );
}