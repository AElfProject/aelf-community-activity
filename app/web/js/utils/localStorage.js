import { getUrlParameter } from './utils';

function checkInviter (inviter, whiteList = []) {
  if (whiteList.includes(inviter)) {
    return inviter;
  }
  return '';
}

export const setInviter = (whiteList = []) => {
  const inviter = getUrlParameter('inviter');
  if (!inviter || !checkInviter(inviter, whiteList)) {
    return;
  }
  localStorage.setItem('inviter', inviter);
  return checkInviter(inviter, whiteList);
};

export const getOrSetInviter = (whiteList = []) => {
  const inviter = localStorage.getItem('inviter');
  if (checkInviter(inviter, whiteList)) {
    return inviter;
  }
  return setInviter(whiteList);
};