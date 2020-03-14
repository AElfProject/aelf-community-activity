/**
 * @file store/index.js
 * @author hzz780
 * 2019.11
 */

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

const middleware = [
  thunkMiddleware,
  createLogger()
];

export default function configStore () {
  return createStore(rootReducer, applyMiddleware(...middleware));
};
