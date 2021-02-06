import {
  LOGIN,
  LOGOUT
} from '../constant/accountActions'
import { NightElfCheck } from '../utils/NightElf/NightElf';
import { CHAIN_ID, LOGIN_INFO } from '../constant/constant';
import { message } from 'antd';

let addressInUse;

export const login = (accountInfo) => {
  return {
    type: LOGIN,
    accountInfo
  }
};

export const logout = (accountInfo) => {
  return {
    type: LOGOUT,
    accountInfo
  }
};

export function asyncLogin() {
  return dispatch => {
    NightElfCheck.getInstance().check.then(checkResult => {
      const aelf = NightElfCheck.initAelfInstanceByExtension();
      aelf.login(LOGIN_INFO).then(result => {
        if (result.error) {
          message.warning(result.errorMessage.message || result.errorMessage);
        } else {
          const detail = JSON.parse(result.detail);
          addressInUse = detail.address;
          dispatch(login(detail));
        }
      }).catch(error => {
        message.error(error.message || 'AELF Explorer extension error');
      });
    }).catch(error => {
      message.error(`AELF Explorer extension load failed: ${error.message}`);
      console.log('error: ', error);
    });
  }
}

export function asyncLogout() {
  return dispatch => {
    const aelf = NightElfCheck.initAelfInstanceByExtension();
    aelf.logout({
      chainId: CHAIN_ID,
      address: addressInUse
    }, (error) => {
      if (error) {
        message.error(error.errorMessage.message || error.errorMessage || error.message);
      } else {
        dispatch(logout());
      }
    });
  }
}
