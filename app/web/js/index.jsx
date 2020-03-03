/**
 *  @file
 *  @author huangzongzhe
 */


import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';

import Swap from './Swap/Swap';

// <Route path="/" component={HomePage}>
//   <Route path="/assets" component={Assets}></Route>
//   {/*<Route path="/qrcode" component={QRCode}></Route>*/}
//   <Route path="/personalcenter/home" component={personalCenterHome}></Route>
//   <Route path="/personalcenter/walletlist" component={WalletList}></Route>
// </Route>
ReactDOM.render(
      <Router history={hashHistory}>
        <Route path="/" component={Swap}></Route>
      </Router>,
  document.getElementById('root')
);
