/* From start */
import React, { Component } from 'react';
import { Button, Card, Input } from 'antd';
import { GET_BOUGHT_LOTTERIES } from '../../../constant/apis';
import axios from '../../../service/axios';

export default class GrandPrize extends Component{
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      prizeErrorShow: false,
      prizeErrorMessage: '',
      prizeInfoShow: false,
      prizeInfo: '',
      boughtInfo: {
        currentAddress: 0,
        total: 1
      }
    }
  }

  async getBoughtLotteries() {
    const boughtInfo = (await axios.get(`${GET_BOUGHT_LOTTERIES}`, {
      params: {
        owner: this.state.address
      }
    })).data;
    if (boughtInfo && !boughtInfo.currentAddress) {
      this.setState({
        prizeErrorShow: true,
        prizeInfoShow: false,
        prizeErrorMessage: 'Unfortunately, You cannot be able to share the grand prize because you are absent from the Lottery Code Switch and Lucky Draw.'
      });
      return;
    }

    console.log('boughtInfo: ', boughtInfo);

    const percent = boughtInfo.currentAddress / boughtInfo.total;
    const prizeAmount = percent * this.props.grandPrizeAmount;
    this.setState({
      prizeErrorShow: false,
      prizeInfoShow: true,
      prizeInfo: `Prize Weight: ${(percent * 100).toFixed(2)}%              Prize Amount: ${prizeAmount.toFixed(2)} ELF`,
      boughtInfo
    });
  }

  onAddressChange(event) {
    this.setState({
      address: event.target.value
    });
  }

  render() {

    const { address, prizeErrorShow, prizeErrorMessage, prizeInfoShow, prizeInfo } = this.state;

    return (
      <Card
        className='hover-cursor-auto'
        hoverable
        title='Check information about the Grand Prize'>
        <div className='section-content'>
          {/*<div className='basic-blank'/>*/}
          <Input value={address} placeholder='Address' onChange={event => this.onAddressChange(event)} style={{ maxWidth: 580 }}/>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => this.getBoughtLotteries()}>Check</Button>
          {prizeErrorShow && <div className="grand-prize-error">{prizeErrorMessage}</div>}
          {prizeInfoShow && <div className="grand-prize-right">{prizeInfo}</div>}
        </div>
      </Card>
    );
  }
}
