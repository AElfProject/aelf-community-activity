/**
 * @file reducers/index.js
 */

import { combineReducers } from 'redux';
import counter from './counter'; // Hi fresh people, the counter is the tutorial for you.
import account from './account'

export default combineReducers({
  counter,
  account
})
