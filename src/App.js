import './App.css';
import * as React from 'react';
import Navbar from "./Navbar";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Login from "./Login";
// import "./styles.css";


const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

export default function App() {

  return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
              <Route exact path='/' component={Home} />

              <Route path='/login' component={Login} />
          </Switch>
        </div>
      </BrowserRouter>
  );
}