import { getUrlParameter } from './utils';

function checkInviter (inviter, whiteList = []) {
  if (inviter
    && (inviter.includes('ELF_') && inviter.includes('_tDVV'))) {
    return inviter;
  }

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
  let inviter = setInviter(whiteList);
  if (inviter) {
    return inviter;
  }
  // const inviter = localStorage.getItem('inviter');
  inviter = localStorage.getItem('inviter');
  if (checkInviter(inviter, whiteList)) {
    return inviter;
  }
  // return setInviter(whiteList);
};
