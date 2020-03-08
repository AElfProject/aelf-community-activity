/**
 * @file contanst.js
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
// button 判断是否可点击 在数据上做判断操作
// const DEFAUTRPCSERVER = 'http://3.25.10.185:8000/swagger/index.html'; // 还是需要代理，因为是http的请求...
const DEFAUTRPCSERVER = 'https://aelf-wallet-test.aelf.io/chain'; // 还是需要代理，因为是http的请求...
const APPNAME = 'aelf community';
const COMMON_PRIVATE= 'f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71';
const SWAP_CONTRACT_ADDRESS = 'uSXxaGWKDBPV6Z8EG8Et9sjaXhH1uMWEpVvmo2KzKEaueWzSe';
const SWAP_PAIR = '1d5461213d84bbc5076f3599fc90fd12d51d0bfaa13dc021981a69ffa48caf78';
const HTTP_PROVIDER = 'http://192.168.197.51:8000';
const CHAIN_ID = 'AELF';
const EXPLORER_URL = 'https://explorer-test.aelf.io';
const ADDRESS_INFO = {
  prefix: 'ELF',
  suffix: 'AELF',
};

const LOGIN_INFO = {
  chainId: CHAIN_ID,
  payload: {
    method: 'LOGIN',
    contracts: [{
      chainId: CHAIN_ID,
      contractAddress: SWAP_CONTRACT_ADDRESS,
      contractName: 'Token swap contract',
      description: 'Swap token from the other chain. Base on protocol [-]',
      github: 'https://github.com/AElfProject/AElf/blob/token-swap-contract/protobuf/token_swap_contract.proto'
    }]
  }
};

export {
  CHAIN_ID,
  DEFAUTRPCSERVER,
  APPNAME,
  COMMON_PRIVATE,
  SWAP_CONTRACT_ADDRESS,
  SWAP_PAIR,
  HTTP_PROVIDER,
  ADDRESS_INFO,
  LOGIN_INFO,
  EXPLORER_URL
};
