import AElf from 'aelf-sdk';
import {HTTP_PROVIDER, SWAP_CONTRACT_ADDRESS, SWAP_PAIR, COMMON_PRIVATE} from '../constant/constant';

export async function getSwapPair(targetTokenSymbol = 'ELF') {
  const Wallet = AElf.wallet;

  const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));

  const swapContract = await aelf.chain.contractAt(SWAP_CONTRACT_ADDRESS, wallet);
  return await swapContract.GetSwapPair.call({
    swapId: SWAP_PAIR,
    targetTokenSymbol
  });
}

export async function getSwapInfo() {
  const Wallet = AElf.wallet;

  const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));

  const swapContract = await aelf.chain.contractAt(SWAP_CONTRACT_ADDRESS, wallet);
  return await swapContract.GetSwapInfo.call(SWAP_PAIR);
}
