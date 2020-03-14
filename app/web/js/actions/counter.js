import {
  ADD,
  MINUS
} from '../constant/counterActions'

export const add = () => {
  console.log();
  return {
    type: ADD,
    text: 'hzz780' + 1
  }
};
export const minus = () => {
  return {
    type: MINUS
  }
};

// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}
