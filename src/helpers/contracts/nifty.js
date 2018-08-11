import {web3MetamaskSendTransaction, web3Instance} from '../web3';
import niftyJson from './abi/nifty.json';
import addresses from './config/addresses';

const niftyContract = new web3Instance.eth.Contract(niftyJson, addresses.nifty);

export async function mintToken(labelHash) {
  const address = window.web3.eth.defaultAccount;
  const data = niftyContract.methods.mint(labelHash).encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await niftyContract.methods
    .mint(labelHash)
    .estimateGas({from: address, value: '0'});
  web3MetamaskSendTransaction({
    from: address,
    to: addresses.registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit,
  });
}

export async function unmintToken(labelHash) {
  const address = window.web3.eth.defaultAccount;
  const data = niftyContract.methods.burn(labelHash).encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await niftyContract.methods
    .burn(labelHash)
    .estimateGas({from: address, value: '0'});
  web3MetamaskSendTransaction({
    from: address,
    to: addresses.registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit,
  });
}

export async function getTokensOwned(owner) {
  const tokens = [];

  const nbTokens = await niftyContract.methods.balanceOf(owner).call();
  for (let i = 0; i < nbTokens; i++) {
    const tokenId = await niftyContract.methods
      .tokenOfOwnerByIndex(owner, i)
      .call();
    tokens.push(tokenId);
  }
  return tokens;
}
