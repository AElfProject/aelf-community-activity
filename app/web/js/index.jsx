/**
 *  @file
 *  @author huangzongzhe
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import { Provider } from 'react-redux';
import configStore from './store';

import App from './App';
import Swap from './page/Swap/Swap';
import Lottery from './page/Lottery/Lottery';
import Daily from './page/Daily/Daily';

import "antd/dist/antd.less";
import './index.less';

const store = configStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Swap}/>
        <Route path="/swap" component={Swap}/>
        <Route path="/lottery" component={Lottery}/>
        <Route path="/daily" component={Daily}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
