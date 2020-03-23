/* From start */
import React, { Component } from 'react';
import { Button, Form, Input, Select, Modal, message } from 'antd';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import { LOGIN_INFO, LOTTERY } from '../../../constant/constant';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

export default class LotteryAward extends Component {
  constructor() {
    super();

    this.state = {
      visible: false,
      rewardInput: {
        lotteryId: '',
        period: '',
        registrationInformation: ''
      },
      lotteryIdArray: []
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderFromItemSelect = this.renderFromItemSelect.bind(this);
    this.onPeriodChange = this.onPeriodChange.bind(this);
    this.removeLotteryIdArray = this.removeLotteryIdArray.bind(this);
  }

  async removeLotteryIdArray(index) {
    let {lotteryIdArray} = this.state;
    lotteryIdArray = lotteryIdArray.filter(item => {
      return parseInt(item) !== index;
    });
    this.setState({
      lotteryIdArray
    });
  }

  async handleOk() {
    const {rewardInput} = this.state;
    const {lotteryId, period, registrationInformation} = rewardInput;

    const { address } = this.props;
    if (address) {
      try {
        const lotteryContract = await NightElfCheck.getContractInstance({
          loginInfo: LOGIN_INFO,
          contractAddress: LOTTERY.CONTRACT_ADDRESS,
        });

        const takeRewardResult = await lotteryContract.TakeReward({
          lotteryId: parseInt(lotteryId, 10),
          registrationInformation: registrationInformation + '',
          period: parseInt(period, 10),
        });

        if (takeRewardResult.errorMessage) {
          message.warning(takeRewardResult.errorMessage.message);
          return;
        }

        const {TransactionId} = takeRewardResult.result;
        MessageTxToExplore(TransactionId);

        this.removeLotteryIdArray(parseInt(lotteryId, 10));

      } catch(e) {
        message.warning(e.message || 'Take reward failed.');
      }
    }

    this.setState({
      visible: false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  onPeriodChange(value) {
    const {rewardListBelongsToCurrentAddress} = this.props;
    const rewardListThisPeriod = rewardListBelongsToCurrentAddress.filter(item => {
      return parseInt(item.period, 10) === parseInt(value, 10);
    });
    const rewardLotteriesTemp = rewardListThisPeriod[0].rewardLotteries.filter(item => {
      return !item.registrationInformation;
    });

    const lotteryIdArray = rewardLotteriesTemp.map(item => {
      return item.id;
    });
    //
    // const lotteryIdArray = rewardListThisPeriod[0].rewardLotteries.map(item => {
    //   return item.id;
    // });

    this.setState({
      lotteryIdArray
    });
  }

  renderOption(value) {
    return <Option value={value} key={value}>{value}</Option>;
  }
  renderFromItemSelect(arrayInput, nameInput, labelInput, onChange) {

    const optionsHTML = arrayInput.map(value => {
      return this.renderOption(value);
    });

    const placeholder = arrayInput.length
      ? 'Select a ' + labelInput
      : 'Good Luck!';

    return <Form.Item name={nameInput} label={labelInput} rules={[{ required: true }]}>
      <Select
        placeholder={placeholder}
        onChange={onChange}
        allowClear
      >
        {optionsHTML}
      </Select>
    </Form.Item>;
  }

  render() {

    const {currentPeriodNumber, rewardListBelongsToCurrentAddress} = this.props;
    const {rewardInput, lotteryIdArray} = this.state;
    const {lotteryId, period, registrationInformation} = rewardInput;

    const onFinish = values => {
      this.setState({
        visible: true,
        rewardInput: {
          period: values.period,
          lotteryId: values.lotteryId,
          registrationInformation: `Address: ${values.receiving_address}; Telegram: ${values.telegram}`
        }
      });
    };

    const onFinishFailed = errorInfo => {
      message.warning(errorInfo);
    };

    const periodArray = rewardListBelongsToCurrentAddress.map(item => item.period);
    periodArray.sort((a,b) => b - a);

    const periodItemHTML = this.renderFromItemSelect(periodArray, 'period', 'Period', this.onPeriodChange);
    const lotteryIdItemHTML = this.renderFromItemSelect(lotteryIdArray, 'lotteryId', 'Lottery ID');

    return (
      <section className='section-basic basic-container'>
        <div className='section-title'>
          Take Award (Latest Award Period: {currentPeriodNumber ? currentPeriodNumber - 1 : 0})
        </div>
        <div className='section-content lottery-form-container'>
          <div className='basic-blank'/>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >

            {periodItemHTML}
            {lotteryIdItemHTML}

            <Form.Item
              label="Receiving address"
              name="receiving_address"
              rules={[{ required: true, message: 'Please input the receiving address!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Telegram"
              name="telegram"
              rules={[{ required: true, message: 'Please input the telegram!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Modal
          title="Confirm Information"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Period: {period} &nbsp;&nbsp;&nbsp; Lottery ID: {lotteryId}</p>
          <p>{registrationInformation}</p>
        </Modal>
      </section>
    );
  }
}
