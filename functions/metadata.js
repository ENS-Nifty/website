import addresses from './config/addresses';
import faunadb, {query as q} from 'faunadb';
import {registrarContract, niftyContract} from './config/contracts';
import {nodeFromLabelHash} from './helpers/hashes';
import BigNumber from 'bignumber.js';

require('dotenv').config();

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

function mod(numberOne, numberTwo) {
  return BigNumber(`${numberOne}`)
    .mod(BigNumber(`${numberTwo}`))
    .toString();
}

function rarebitsFormat(imageUrl, homeUrl, dateRegistered, lockedEther) {
  return {
    image_url: imageUrl,
    home_url: homeUrl,
    properties: [
      {key: 'locked-ether', value: parseFloat(lockedEther), type: 'integer'},
      {key: 'date-registered', value: dateRegistered, type: 'string'},
    ],
  };
}

function openseaFormat(imageUrl, homeUrl, dateRegistered, lockedEther) {
  return {
    image: imageUrl,
    external_url: homeUrl,
    background_color: 'FFFFFF',
    attributes: {lockedEther: parseFloat(lockedEther), dateRegistered},
  };
}

exports.handler = (event, context, cb) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  };

  let hash = event.path.substr(event.path.lastIndexOf('/') + 1) // hash

  if (!hash) {
    return cb(null, {statusCode: 500, body: 'Hash not provided'});
  }

  if (hash.toLowerCase().substr(0, 2) !== '0x') {
    let foo = new BigNumber(hash)
    hash = '0x' + foo.toString(16)
  }
  hash =
    '0x' +
    hash
      .toLowerCase()
      .replace('0x', '')
      .padStart(64, '0');

  const labelHash = hash.toLowerCase();

  // timdaub.eth
  let timdaub = '0x3bf87c5c609b6a0e5b0daa400c18c396b1db1c927e55a0e1d61405b756e2b0b8'
  let hodlinghard = '0x3bb488a88408612ef53465a9f10776788bffdfd42c0463ba5ae1ea1b2e9898ba'
  if (labelHash == timdaub.toLowerCase()) {
    let imageUrl = 'https://gateway.pinata.cloud/ipfs/QmSQZ191DA3ysDCHpKaVxZsRKQgEE3PBCAJaH6nHnbtPb1/Simon%20Denny%20Backdated%20NFT:%20Ethereum%20stamp%20%282016-2018-2021%29.jpg'
    let homeUrl = 'https://simondenny.net/'
    cb(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        name: 'Backdated NFT/ Ethereum stamp',
        description: `Artist: Simon Denny
Title: Backdated NFT/ Ethereum stamp (2016-2018-2021)

"Backdated NFT/ Ethereum stamp (2016-2018-2021)" is an NFT minted in the past. A paper portrait-as-postage-stamp of Vitalik Buterin from 2016 is rubber stamped with the details of a token issued with a different digital asset in 2018. The original digital asset is replaced with an image of this stamped portrait, performing the impossible.`,
        image: imageUrl,
        external_url: homeUrl,
        // background_color: 'FFFFFF',
        // attributes: { lockedEther: parseFloat(lockedEther), dateRegistered }
        image_url: imageUrl,
        home_url: homeUrl,
        // properties: [
        //   { key: 'locked-ether', value: parseFloat(lockedEther), type: 'integer' },
        //   { key: 'date-registered', value: dateRegistered, type: 'string' }
        // ]
      }),
    });
  } else if (labelHash == hodlinghard.toLowerCase()) {
    let imageUrl = 'https://gateway.pinata.cloud/ipfs/QmWvgU2T2Xd8noydjisaYsuaZHVM7YJwVPnPWEUKugrkac/Backdated%20NFT%20Cryptokitty%20Display%20Hardware%20Wallet%20Replica%20%282018-2019-2021%29.jpg'
    let homeUrl = 'https://simondenny.net'
    cb(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        name: 'Backdated NFT/ Cryptokitty Display Hardware Wallet Replica (Celestial Cyber Dimension)',
        description: `Artist: Simon Denny

Title: Backdated NFT / Cryptokitty Display Hardware Wallet Replica (Celestial Cyber Dimension)
(2018-2019-2021)

The first sale of an NFT to take place at an art auction house was held on May 12, 2018. Up for auction was “Celestial Cyber Dimension,” a Cryptokitty created by DapperLabs consisting of an image by artist Guile Twardowski hosted on a custom-designed hardware wallet with an LCD screen built by Richard Moore. Following the sale, a cardboard replica of the wallet was made and exhibited in Berlin. In 2019, an attempt was made to gift the cardboard copy to Craig Wright, a technologist and entrepreneur who has claimed to be Satoshi, the inventor of Bitcoin.  An NFT minted, exceptionally, in the past, "Backdated NFT/ Cryptokitty Display Hardware Wallet Replica (Celestial Cyber Dimension)" is a monument to this historic meeting of the worlds of art and crypto.   The cardboard Cryptokitty wallet replica is tethered to an old NFT that was minted in 2019. Rubber-stamped with the details of the earlier token, then photographed, the object-image constitutes "Backdated NFT/ Cryptokitty Display Hardware Wallet Replica (Celestial Cyber Dimension)," which acts as a parasite within the realm of emergent crypto art. In hijacking an existing token by replacing its image, the work exposes a technical reality of the format: the assets linked with many NFTs, claiming to be immutable, are in fact not stored on the blockchain, but are linked from their blockchain entry to sites on the open web, and are therefore alterable.   By being minted as an NFT, the artwork not only goes back in time on the blockchain, but specifically journeys to the year of its ostensible meeting with Satoshi, the defacto creator of the crypto universe.`,
        image: imageUrl,
        external_url: homeUrl,
        // background_color: 'FFFFFF',
        // attributes: { lockedEther: parseFloat(lockedEther), dateRegistered }
        image_url: imageUrl,
        home_url: homeUrl,
        // properties: [
        //   { key: 'locked-ether', value: parseFloat(lockedEther), type: 'integer' },
        //   { key: 'date-registered', value: dateRegistered, type: 'string' }
        // ]
      }),
    })
  }
  
  return client
    .query(q.Get(q.Match(q.Index('domain_by_label_hash'), labelHash)))
    .then(ret => ret.data)
    .then(data => {
      const hue = mod(labelHash, 360);
      const tokenID = BigNumber(labelHash).toString(10);
      const lockedEther = data.lockedEther ? data.lockedEther : '?';
      const dateRegistered = data.dateRegistered ? data.dateRegistered : '?';
      const label = data.label ? data.label : '?';
      const homeUrl = `https://etherscan.io/token/${
        addresses.nifty
      }?a=${tokenID}`;
      const imageUrl = `https://res.cloudinary.com/dszcbwdrl/image/upload/e_hue:${hue}/v1537475886/token.png`;
      cb(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          name: label + '.eth',
          description: `ENS domain bought on ${dateRegistered} for ${lockedEther} ether. The owner of the '${label}.eth' token may untokenize the name for use at ensnifty.com`,
          ...rarebitsFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
          ...openseaFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
        }),
      });
    })
    .catch(err => {
      if (err.name === 'NotFound' && err.message === 'instance not found') {
        const labelHash = hash.toLowerCase();
        const hue = mod(labelHash, 360);
        const tokenID = BigNumber(labelHash).toString(10);
        const homeUrl = `https://etherscan.io/token/${
          addresses.nifty
        }?a=${tokenID}`;
        const imageUrl = `https://res.cloudinary.com/dszcbwdrl/image/upload/e_hue:${hue}/v1537475886/token.png`;
        const dateRegistered = '?';
        const lockedEther = '?';
        cb(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            name: 'Unknown',
            description: 'The name of this hash is unknown',
            ...rarebitsFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
            ...openseaFormat(imageUrl, homeUrl, dateRegistered, lockedEther),
          }),
        });
      } else {
        cb(null, {statusCode: 400, body: err.name + ':' + err.message});
      }
    });
};
