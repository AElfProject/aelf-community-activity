import {Buffer} from 'buffer';

export function getMerklePathFromOtherChain(merklePathBytes, merklePathBool) {

  const merklePathBytesArray = merklePathBytes.split(',');
  const merklePathBoolArray = merklePathBool.split(',');

  const merklePath = {
    merklePathNodes: []
  };

  // Buffer.from('3e4913820222479c03b65ce19b465e6baf9e81f01214df15283d1fa3c02d474b', 'hex'); // is ok
  // Buffer.from('0x3e4913820222479c03b65ce19b465e6baf9e81f01214df15283d1fa3c02d474b', 'hex'); // need remove 0x
  merklePathBytesArray.forEach((value, index) => {
    if (value !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      const valueTemp = value.replace(/^0x/, '');
      merklePath.merklePathNodes[index] = {
        hash: {
          value: Buffer.from(valueTemp, 'hex').toString('base64')
        },
        isLeftChildNode: merklePathBoolArray[index]
      };
    }
  });

  return merklePath;
}
