export const merkleAbi = [
  {
    'constant': true,
    'inputs': [{'name': '', 'type': 'uint256'}],
    'name': 'leafNodes',
    'outputs': [{'name': '', 'type': 'bytes32'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'GetNodes',
    'outputs': [{'name': '', 'type': 'bytes32[]'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': 'index', 'type': 'uint256'}],
    'name': 'GetReceipt',
    'outputs': [{'name': '', 'type': 'bytes'}, {'name': '', 'type': 'bytes32'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [],
    'name': 'GenerateMerkleTree',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'merkleTree',
    'outputs': [{'name': 'root', 'type': 'bytes32'}, {
      'name': 'leaf_count',
      'type': 'uint256'
    }, {'name': 'block', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': 'index', 'type': 'uint256'}],
    'name': 'GenerateMerklePath',
    'outputs': [{'name': '', 'type': 'bytes32[30]'}, {'name': '', 'type': 'bool[30]'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': 'newOwner', 'type': 'address'}],
    'name': 'transferOwnership',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'data', 'type': 'bytes'}],
    'name': 'Log',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_from', 'type': 'address'}, {
      'indexed': true,
      'name': '_to',
      'type': 'address'
    }],
    'name': 'OwnershipTransferred',
    'type': 'event'
  }];

export const lockAbi = [
  {
    'constant': true,
    'inputs': [{'name': '', 'type': 'uint256'}],
    'name': 'receiptToOwner',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '', 'type': 'uint256'}],
    'name': 'receipts',
    'outputs': [{'name': 'asset', 'type': 'address'}, {
      'name': 'owner',
      'type': 'address'
    }, {'name': 'targetAddress', 'type': 'string'}, {
      'name': 'amount',
      'type': 'uint256'
    }, {'name': 'startTime', 'type': 'uint256'}, {
      'name': 'endTime',
      'type': 'uint256'
    }, {'name': 'finished', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'saveTime',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'asset',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '_address', 'type': 'address'}],
    'name': 'getMyReceipts',
    'outputs': [{'name': '', 'type': 'uint256[]'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_amount', 'type': 'uint256'}, {'name': 'targetAddress', 'type': 'string'}],
    'name': 'createReceipt',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_period', 'type': 'uint256'}],
    'name': 'fixSaveTime',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'receiptCount',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '', 'type': 'address'}, {'name': '', 'type': 'uint256'}],
    'name': 'ownerToReceipts',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '_address', 'type': 'address'}],
    'name': 'getLockTokens',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_id', 'type': 'uint256'}],
    'name': 'finishReceipt',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': 'targetAddress', 'type': 'string'}, {'name': '_value', 'type': 'uint256'}],
    'name': 'burn',
    'outputs': [{'name': 'success', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': 'index', 'type': 'uint256'}],
    'name': 'getReceiptInfo',
    'outputs': [{'name': '', 'type': 'bytes32'}, {'name': '', 'type': 'string'}, {
      'name': '',
      'type': 'uint256'
    }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_address', 'type': 'address'}],
    'name': 'fixAssetAddress',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': 'newOwner', 'type': 'address'}],
    'name': 'transferOwnership',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'receiptId', 'type': 'uint256'}, {
      'indexed': false,
      'name': 'asset',
      'type': 'address'
    }, {'indexed': false, 'name': 'endTime', 'type': 'uint256'}],
    'name': 'NewReceipt',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_from', 'type': 'address'}, {
      'indexed': true,
      'name': '_to',
      'type': 'address'
    }],
    'name': 'OwnershipTransferred',
    'type': 'event'
  }];

export const tokenAbi = [
  {
    'constant': false,
    'inputs': [{'name': '_durationOfLock', 'type': 'uint256'}],
    'name': 'setDurationOfLock',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'mintingFinished',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'name',
    'outputs': [{'name': '', 'type': 'string'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
    'name': 'approve',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [],
    'name': 'disableSetTransferable',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_addresses', 'type': 'address[]'}, {'name': '_amounts', 'type': 'uint256[]'}],
    'name': 'transferForMultiAddresses',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'deployBlockNumber',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'TIMETHRESHOLD',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_from', 'type': 'address'}, {
      'name': '_to',
      'type': 'address'
    }, {'name': '_value', 'type': 'uint256'}],
    'name': 'transferFrom',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_owner', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
    'name': 'approveMintTokens',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_aelfDevMultisig', 'type': 'address'}],
    'name': 'setAElfDevMultisig',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'decimals',
    'outputs': [{'name': '', 'type': 'uint8'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'aelfDevMultisig',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'durationOfLock',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_owner', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
    'name': 'mintTokensWithinTime',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [],
    'name': 'getAll',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_spender', 'type': 'address'}, {
      'name': '_subtractedValue',
      'type': 'uint256'
    }],
    'name': 'decreaseApproval',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_amount', 'type': 'uint256'}],
    'name': 'burnTokens',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '_owner', 'type': 'address'}],
    'name': 'balanceOf',
    'outputs': [{'name': 'balance', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [],
    'name': 'finishMinting',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_aelfCommunityMultisig', 'type': 'address'}],
    'name': 'setAElfCommunityMultisig',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'transferable',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'symbol',
    'outputs': [{'name': '', 'type': 'string'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '_owner', 'type': 'address'}],
    'name': 'getLockTokens',
    'outputs': [{'name': 'value', 'type': 'uint256'}, {'name': 'blockNumber', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_transferable', 'type': 'bool'}],
    'name': 'setTransferable',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
    'name': 'transfer',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_owner', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
    'name': 'withdrawMintTokens',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'totalSupplyCap',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_owner', 'type': 'address'}],
    'name': 'mintTokens',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_addedValue', 'type': 'uint256'}],
    'name': 'increaseApproval',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'canSetTransferable',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [{'name': '_owner', 'type': 'address'}, {'name': '_spender', 'type': 'address'}],
    'name': 'allowance',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{'name': 'newOwner', 'type': 'address'}],
    'name': 'transferOwnership',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'aelfCommunityMultisig',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'MINTTIME',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_caller', 'type': 'address'}],
    'name': 'SetDurationOfLock',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_owner', 'type': 'address'}, {
      'indexed': false,
      'name': '_amount',
      'type': 'uint256'
    }],
    'name': 'ApproveMintTokens',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_owner', 'type': 'address'}, {
      'indexed': false,
      'name': '_amount',
      'type': 'uint256'
    }],
    'name': 'WithdrawMintTokens',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_owner', 'type': 'address'}, {
      'indexed': false,
      'name': '_amount',
      'type': 'uint256'
    }],
    'name': 'MintTokens',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_owner', 'type': 'address'}, {
      'indexed': false,
      'name': '_amount',
      'type': 'uint256'
    }],
    'name': 'BurnTokens',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_caller', 'type': 'address'}],
    'name': 'MintFinished',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_address', 'type': 'address'}, {
      'indexed': false,
      'name': '_transferable',
      'type': 'bool'
    }],
    'name': 'SetTransferable',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_old', 'type': 'address'}, {
      'indexed': true,
      'name': '_new',
      'type': 'address'
    }],
    'name': 'SetAElfDevMultisig',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_old', 'type': 'address'}, {
      'indexed': true,
      'name': '_new',
      'type': 'address'
    }],
    'name': 'SetAElfCommunityMultisig',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': '_address', 'type': 'address'}, {
      'indexed': false,
      'name': '_canSetTransferable',
      'type': 'bool'
    }],
    'name': 'DisableSetTransferable',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': 'previousOwner', 'type': 'address'}, {
      'indexed': true,
      'name': 'newOwner',
      'type': 'address'
    }],
    'name': 'OwnershipTransferred',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': 'from', 'type': 'address'}, {
      'indexed': true,
      'name': 'to',
      'type': 'address'
    }, {'indexed': false, 'name': 'value', 'type': 'uint256'}],
    'name': 'Transfer',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'name': 'owner', 'type': 'address'}, {
      'indexed': true,
      'name': 'spender',
      'type': 'address'
    }, {'indexed': false, 'name': 'value', 'type': 'uint256'}],
    'name': 'Approval',
    'type': 'event'
  }];
