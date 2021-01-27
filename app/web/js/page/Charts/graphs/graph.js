import Axios from 'axios';

const DEFAULT_ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/aelfproject/map";

export const GET_DEPOSIT_BY_INVITE_CODE = (pageNum, pageSize) => {
  const skip = pageSize * (pageNum - 1);
  return `
    {
      invitors(first: ${pageSize}, skip: ${skip}, orderBy: amount, orderDirection: desc) {
        id
        amount
      }
    }
  `;
};

export async function queryGraph(gql, endpoint = DEFAULT_ENDPOINT) {
  const response = await Axios.post(endpoint, {
    query: gql,
    variables: null
  });
  return response.data;
}

export async function getDepositByInvitor(pageSize, pageNum) {
  const { data = {} } = await queryGraph(
    GET_DEPOSIT_BY_INVITE_CODE(pageNum, pageSize)
  );
  return data.invitors || [];
}

export const GET_DEPOSIT = (pageNum, pageSize) => {
  const skip = pageSize * (pageNum - 1);
  return `
    {
      accounts(first: ${pageSize}, skip: ${skip}, orderBy: amount, orderDirection: desc) {
        id
        amount
      }
    }
  `;
};

export async function getDeposit(pageSize, pageNum) {
  const { data = {} } = await queryGraph(GET_DEPOSIT(pageNum, pageSize));
  return data.accounts || [];
}

export const GET_USER_DEPOSIT = (address) => {
  return `
    {
      account(id: "${address}") {
        id
        amount
      }
    }
  `;
};

export async function getUserDeposit(address) {
  const { data = {} } = await queryGraph(
    GET_USER_DEPOSIT(address.toLowerCase())
  );
  const { account = null } = data;
  return account;
}
