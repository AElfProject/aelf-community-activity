import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import { LOGIN, LOGOUT } from '../constant/accountActions';

const defaultAccountInfo = {
  name: '',
  address: '',
  publicKey: {
    x: '',
    y: ''
  }
};
export default createReducer(fromJS({
  accountInfo: defaultAccountInfo
}),{
  [LOGIN]: (state, action) => {
    const accountState = state.toJS();
    return state.merge({
      accountInfo: action.accountInfo || accountState.accountInfo
    });
  },
  [LOGOUT]: (state) => {
    return state.merge({
      accountInfo: defaultAccountInfo
    });
  }
})

