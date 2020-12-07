import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import reducers from './redux/reducers';
import { createStore } from "redux";
import { Provider } from 'react-redux';
import Index from './pages/index';
import Header from './components/header'
import Footer from './components/footer'
import './App.css';

const store = createStore(reducers);


class App extends Component {
  render() {
    return (

      <Provider store={store}>

        <BrowserRouter>

          <Header />

          <Index />

          <Footer />

        </BrowserRouter>

      </Provider>


    );
  }
}

export default App;

