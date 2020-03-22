/* From start */
import React from 'react';
import { Table, InputNumber, Button, message } from 'antd';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import addressFormat from '../../../utils/addressFormat';
import { EXPLORER_URL, LOGIN_INFO, LOTTERY } from '../../../constant/constant';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '180px'
  },
  {
    title: 'Random Hash',
    dataIndex: 'random_hash',
    key: 'random_hash',
    // render: text => <a>{text}</a>,
    // render: text => <a>{text}</a>,
  },
  // {
  //   title: 'Owner',
  //   dataIndex: 'owner',
  //   key: 'owner',
  // },
  {
    title: 'level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: 'block',
    dataIndex: 'block',
    key: 'block',
  },
];

// TODO: get data from explore api
const dataSource = [
  {
    id: '123',
    random_hash: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
    // owner: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
    level: 1,
    block: 2791111
  },
  {
    id:'223',
    random_hash: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
    // owner: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
    level: 2,
    block: 2791112
  },
];
let buyCount = 0;

function renderHistory() {
  return <Table dataSource={dataSource} columns={columns} pagination={false} />;
}

function onExchangeNumberChange(value) {
  console.log('changed', value);
  buyCount = value;
}

async function buyLottery () {
  if (!buyCount) {
    throw Error('Please input the amount to buy.');
  }

  await NightElfCheck.getInstance().check;
  const aelf = NightElfCheck.initAelfInstanceByExtension();
  const accountInfo = await aelf.login(LOGIN_INFO);

  if (accountInfo.error) {
    throw Error(accountInfo.errorMessage.message || accountInfo.errorMessage);
  }

  await aelf.chain.getChainStatus();
  const wallet = {
    address: JSON.parse(accountInfo.detail).address
  };
  // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
  // There is only one value named address;
  const lotteryContract = await aelf.chain.contractAt(
    LOTTERY.CONTRACT_ADDRESS,
    wallet
  );
  const lotteryResult = await lotteryContract.Buy({
    value: buyCount
  });

  // TODO: new component
  const {TransactionId} = lotteryResult.result;
  const explorerHref = `${EXPLORER_URL}/tx/${TransactionId}`;
  const txIdHTML = <div>
    <span>Transaction ID: {TransactionId}</span>
    <br/>
    <a target='_blank' href={explorerHref}>Turn to aelf explorer to get the information of this transaction</a>
  </div>;
  message.success(txIdHTML, 16);
}

async function onBuyClick() {
  try {
    await buyLottery();
  } catch(e) {
    message.error(e.message || 'Failed to buy a lottery.')
  }
}

export default function renderPersonalDraw(props) {

  const {voteBalance, address} = props;

  const historyHTML = renderHistory();

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        My Lottery
      </div>
      <div className='section-content'>
        <div className='personal-title'>Exchange Lottery Code</div>
        <div className='basic-line'/>
        <div className='basic-blank'/>
        <div>
          <div>Address: {address ? addressFormat(address) : 'Please login'}</div>
          <div className='basic-blank'/>
          <div> Balance: {voteBalance ? voteBalance + ' VOTE' : '-'}</div>
          <div className='basic-blank'/>
          <div className='personal-exchange'>
            Exchange Quantity ({LOTTERY.RATIO} VOTE = 1 Lottery Code): &nbsp;&nbsp;&nbsp;
            <InputNumber min={1} max={voteBalance/LOTTERY.RATIO} defaultValue={1} onChange={onExchangeNumberChange} />
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={onBuyClick}>Exchange</Button>
          </div>
        </div>

        <div className='basic-blank'/>
        <div className='personal-title'>History</div>
        <div className='basic-line'/>
        <div className='basic-blank'/>
        {historyHTML}
      </div>
    </section>
  );
}
