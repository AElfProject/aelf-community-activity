/**
 *  @file
 *  @author huangzongzhe
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import App from './App';
import Swap from './page/Swap/Swap';
import Lottery from './page/Lottery/Lottery';

import "antd/dist/antd.less";
import './index.less';

ReactDOM.render(
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Swap}/>
          <Route path="/swap" component={Swap}/>
          <Route path="/lottery" component={Lottery}/>
        </Route>
      </Router>,
  document.getElementById('root')
);
