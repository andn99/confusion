import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Navbar, NavbarBrand} from 'reactstrap';
import {DISHES} from './shared/dishes'

import Menu from './components/Menu';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      dishes: DISHES
    }
  }
  render() {
    return (
      <div className="App">
        <Navbar dark color = 'primary'>
          <div className = 'container'>
            <NavbarBrand href="/">Confusion Restaurant</NavbarBrand>
          </div>
        </Navbar>
        <Menu dishes = {this.state.dishes}></Menu>
      </div>
    );
  }
}

export default App;
