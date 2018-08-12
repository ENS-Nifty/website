import { web3MetamaskSendTransaction, web3Instance } from '../web3';
import registrarJson from './abi/registrar.json';
// import resolverJson from './abi/resolver.json';
import addresses from './config/addresses';

const registrarContract = new web3Instance.eth.Contract(
  registrarJson,
  addresses.registrar
);
// const resolverContract = new web3Instance.eth.Contract(resolverJson);

export async function transferName(labelHash, cb) {
  const address = window.web3.eth.defaultAccount;
  const data = registrarContract.methods
    .transfer(labelHash, addresses.nifty)
    .encodeABI();
  const gasPrice = web3Instance.utils.toWei('10', 'gwei');
  const gasLimit = await registrarContract.methods
    .transfer(labelHash, addresses.nifty)
    .estimateGas({ from: address, value: '0' });
  web3MetamaskSendTransaction({
    from: address,
    to: addresses.registrar,
    data,
    value: '0',
    gasPrice,
    gasLimit
  })
    .then(txHash => {
      return web3Instance.eth.getTransactionReceiptMined(txHash);
    })
    .then(cb);
}

export async function labelHashToName(labelHash) {
  fetch(
    `https://buyethdomains.com/api/reverse-lookup/label-to-name?label=${labelHash}`
  )
    .then(res => res.json())
    .then(console.log);
}

export async function addNameToLabelHash(name) {
  fetch(`https://buyethdomains.com/api/reverse-lookup/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({ name })
  });
}
