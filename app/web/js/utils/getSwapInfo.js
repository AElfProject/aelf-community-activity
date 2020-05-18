import AElf from 'aelf-sdk';
import {HTTP_PROVIDER, SWAP_CONTRACT_ADDRESS, SWAP_PAIR, COMMON_PRIVATE} from '../constant/constant';

let swapContract;

async function getSwapContract() {
  if (swapContract) {
    return swapContract;
  }
  const Wallet = AElf.wallet;

  const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
  swapContract = await aelf.chain.contractAt(SWAP_CONTRACT_ADDRESS, wallet);
  return swapContract;
}

export async function getSwapPair(targetTokenSymbol = 'ELF') {
  const swapContract = await getSwapContract();
  return await swapContract.GetSwapPair.call({
    swapId: SWAP_PAIR,
    targetTokenSymbol
  });
}

export async function getSwapInfo() {
  const swapContract = await getSwapContract();
  return await swapContract.GetSwapInfo.call(SWAP_PAIR);
}

export async function getSwapRound() {
  const swapContract = await getSwapContract();
  return await swapContract.GetSwapRound.call({
    swapId: SWAP_PAIR,
    targetTokenSymbol: 'ELF',
    roundId: '以太坊上调用GenerateMerklePath获得的 tree index'
  });
}
