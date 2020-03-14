import { createReducer } from 'redux-immutablejs';
import { fromJS } from 'immutable';
import { ADD, MINUS } from '../constant/counterActions';

const defaultCountNum = 0;

export default createReducer(fromJS({
  num: defaultCountNum
}),{
  [ADD]: (state, action) => {
    const counterState = state.toJS();
    return state.merge({
      num: counterState.num + 1,
      text: action.text
    })
  },
  [MINUS]: (state) => {
    const counterState = state.toJS();
    return state.merge({
      num: counterState.num - 1
    })
  }
});
