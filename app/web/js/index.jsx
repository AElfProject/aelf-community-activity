/**
 *  @file
 *  @author huangzongzhe
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import Swap from './page/Swap/Swap';
import Lottery from './page/Lottery/Lottery';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import "antd/dist/antd.less";
import './index.less';

class HomePage extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div>
        <Header/>
        <div className='body-container'>
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
}

ReactDOM.render(
      <Router history={hashHistory}>
        <Route path="/" component={HomePage}>
          <IndexRoute component={Swap}/>
          <Route path="/swap" component={Swap}/>
          <Route path="/lottery" component={Lottery}/>
        </Route>
      </Router>,
  document.getElementById('root')
);
