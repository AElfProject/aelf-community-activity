import React, { Component } from 'react';
import { Table } from 'antd';
import Contract from '../../../utils/Contract';
import addressFormat from '../../../utils/addressFormat';
import { LOTTERY } from '../../../constant/constant';
import LotteryAward from './LotteryAward';

const awardHistoryColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: 'level',
    dataIndex: 'level',
    key: 'level',
    width: 72,
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    render: text => <div>{addressFormat(text)}</div>,
    width: 520
  },
  {
    title: 'Block',
    dataIndex: 'block',
    key: 'block'
  },
  {
    title: 'Registration Information',
    dataIndex: 'registrationInformation',
    key: 'registrationInformation'
  },
];

export default class AwardHistory extends Component{
  constructor(props) {
    super(props);
    this.state = {
      rewardResults: [],
      randomHashBelongsToCurrentAddress: [],
      rewardListBelongsToCurrentAddress: []
    };
    this.getRewardResults = this.getRewardResults.bind(this);
    this.renderHistoryPeriod = this.renderHistoryPeriod.bind(this);
    this.updateRandomHashBelongsToCurrentAddress = this.updateRandomHashBelongsToCurrentAddress.bind(this);
  }

  async componentDidMount() {
    this.getRewardResults();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const currentPeriodNumberChanged = prevProps.currentPeriodNumber !== this.props.currentPeriodNumber;

    if (currentPeriodNumberChanged) {
      this.getRewardResults();
    }
    const addressChanged = prevProps.address !== this.props.address;
    if (addressChanged) {
      this.updateRandomHashBelongsToCurrentAddress();
    }
  }

  updateRandomHashBelongsToCurrentAddress() {
    const {address} = this.props;
    if (!address) {
      this.setState({
        rewardListBelongsToCurrentAddress: []
      });
      return;
    }
    const {rewardResults} = this.state;
    const addressRewardList = rewardResults.filter(rewardResult => {
      const {rewardLotteries: allRewardLotteries} = rewardResult;
      const addressRewardLotteries = allRewardLotteries.filter(lottery => {
        return lottery.owner === address;
      });
      return addressRewardLotteries.length;
    });
    this.setState({
      rewardListBelongsToCurrentAddress: addressRewardList
    });
  }

  async getRewardResults() {
    const { currentPeriodNumber } = this.props;

    const promiseList = [];
    for (let index = 1; index < currentPeriodNumber; index++) {
      promiseList.push(getRewardResultByPeriod(index).then(rewardResult => {
        const { rewardResults } = this.state;
        const reverseIndex = currentPeriodNumber - 1 - index;
        rewardResults[reverseIndex] = rewardResult;
        this.setState(
          rewardResults
        );
        // return true;
      }).catch(e => {
        message.error(`Get ${index} period reward result failed.`);
        // return e;
      }));
    }

    Promise.all(promiseList).then(() => {
      // console.log('updateRandomHashBelongsToCurrentAddress');
      this.updateRandomHashBelongsToCurrentAddress();
    }).catch(e => {
      message.error(e.message || 'Update random hash failed.');
      // console.log('updateRandomHashBelongsToCurrentAddress e', e);
    });
  }

  renderHistoryPeriod(rewardResult) {
    const {rewardLotteries, period, randomHash} = rewardResult;

    if (!period || !randomHash) {
      return null;
    }
    // const format = 'YYYY-MM-DD';
    // const timeFormatted = moment(new Date()).format(format);

    return (<div key={randomHash}>
      {/*<div className='history-period'>{timeFormatted}</div>*/}
      <div className='history-period'>Period: {period} &nbsp;&nbsp;&nbsp; Random Hash: {randomHash}</div>
      <Table
        dataSource={rewardLotteries}
        columns={awardHistoryColumns}
        pagination={false}
        rowKey='id'
        scroll={{x: 1024}}
      />
    </div>);
  }

  renderHistoryPeriods() {
    const {rewardResults} = this.state;

    return rewardResults.map(rewardResult => {
      return this.renderHistoryPeriod(rewardResult);
    });
  }

  render() {

    const {currentPeriodNumber, address} = this.props;
    const {randomHashBelongsToCurrentAddress, rewardListBelongsToCurrentAddress} = this.state;
    const historyPeriodsHTML = this.renderHistoryPeriods();

    return (
      <>
        <LotteryAward
          currentPeriodNumber={currentPeriodNumber}
          randomHashBelongsToCurrentAddress={randomHashBelongsToCurrentAddress}
          rewardListBelongsToCurrentAddress={rewardListBelongsToCurrentAddress}
          address={address}
        />
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            All Award History
          </div>
          <div className='section-content swap-flex-wrap'>
            {historyPeriodsHTML}
          </div>
        </section>
      </>
    );
  }
}

async function getRewardResultByPeriod(period) {
  // {
  //   rewardLotteries: [
  //     {
  //       id: '33',
  //       owner: '2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6',
  //       level: '1',
  //       block: '83621',
  //       registrationInformation: ''
  //     }
  //   ],
  //   period: '2',
  //   randomHash: '40479c107111c9966d5c55ff4978875974e2cef572a628438270f164f8779065'
  // }
  const aelfContract = new Contract();
  const lotteryContractInstance = await aelfContract.getContractInstance(LOTTERY.CONTRACT_ADDRESS);
  return lotteryContractInstance.GetRewardResult.call({
    value: period
  });
}
