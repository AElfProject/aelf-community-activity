/* From start */
import React, { Component } from 'react';
import { Button, Form, Input, Select, Modal, message, Card } from 'antd';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import { LOGIN_INFO, LOTTERY } from '../../../constant/constant';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import { GET_CRYPTO_ADDRESS } from '../../../constant/apis';
import axios from '../../../service/axios';
import { checkTimeAvailable, getAvailableTime, renderAvailableTime } from '../../../utils/cmsUtils';

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
      lotteryIdArray: [],
      // lotteryIdRemovedTemp: {[period: string | number]: number[]}
      lotteryIdRemovedTemp: {},
      takeAwardDate: {
        start: '',
        end: ''
      }
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderLotteryIdOption = this.renderLotteryIdOption.bind(this);
    this.renderFromItemSelect = this.renderFromItemSelect.bind(this);
    this.onPeriodChange = this.onPeriodChange.bind(this);
    this.removeLotteryIdArray = this.removeLotteryIdArray.bind(this);

    this.formRef = React.createRef();
  }

  async componentDidMount() {
    getAvailableTime().then(res => {
      const { data } = res;
      const takeAwardDate = data.find(item => item.type === 'lotteryTakeAward') || {};
      this.setState({
        takeAwardDate,
      });
    });
  }

  async removeLotteryIdArray(index, period) {
    let {lotteryIdArray, lotteryIdRemovedTemp} = this.state;
    lotteryIdArray = lotteryIdArray.filter(item => {
      return parseInt(item) !== index;
    });

    if (lotteryIdRemovedTemp[period]) {
      lotteryIdRemovedTemp[period] = [...lotteryIdRemovedTemp[period], index.toString()];
    } else {
      lotteryIdRemovedTemp[period] = [index.toString()];
    }

    this.setState({
      lotteryIdArray,
      lotteryIdRemovedTemp
    });
    this.formRef.current.resetFields();
  }

  async handleOk() {
    const {rewardInput} = this.state;
    const {lotteryId, period, registrationInformation} = rewardInput;

    const { data: { address:crytoyRegTrationInfo }} = await axios(`${GET_CRYPTO_ADDRESS}?address=${registrationInformation}`)

    const { address } = this.props;
    if (address) {
      try {
        // const lotteryContract = await NightElfCheck.getContractInstance({
        const lotteryContract = await NightElfCheck.initContractInstance({
          loginInfo: LOGIN_INFO,
          contractAddress: LOTTERY.CONTRACT_ADDRESS,
        });

        const takeRewardResult = await lotteryContract.TakeReward({
          lotteryId: parseInt(lotteryId, 10),
          registrationInformation: crytoyRegTrationInfo + '',
          period: parseInt(period, 10),
        });

        if (takeRewardResult.errorMessage) {
          message.warning(takeRewardResult.errorMessage.message);
          return;
        }

        const {TransactionId} = takeRewardResult.result || takeRewardResult;
        MessageTxToExplore(TransactionId);

        this.removeLotteryIdArray(parseInt(lotteryId, 10), period);
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
    const { lotteryIdRemovedTemp } = this.state;
    const {rewardListBelongsToCurrentAddress, address} = this.props;
    const rewardListThisPeriod = rewardListBelongsToCurrentAddress.filter(item => {
      return parseInt(item.period, 10) === parseInt(value, 10);
    });
    const rewardLotteriesTemp = rewardListThisPeriod[0].rewardLotteries.filter(item => {
      const validCheck = !item.registrationInformation && item.owner === address;
      if (lotteryIdRemovedTemp[value]) {
        return validCheck && !lotteryIdRemovedTemp[value].includes(item.id);
      }
      return validCheck;
    });

    const lotteryIdArray = rewardLotteriesTemp.map(item => {
      return item.id;
    });

    this.setState({
      lotteryIdArray
    });
  }

  renderOption(value) {
    return <Option value={value} key={value}>{value - LOTTERY.START_PERIOD + 1}</Option>;
  }

  renderLotteryIdOption(value) {
    return <Option value={value} key={value}>{value}</Option>;
  }

  renderFromItemSelect(arrayInput, nameInput, labelInput, onChange) {

    const desc = {
      period: 'If you have won a prize, please check your period number on the lottery draw page and specify it here.',
      lotteryId: 'You can check the lottery code in the lottery draw page.'
    };

    const renderOptions = nameInput === 'lotteryId' ? this.renderLotteryIdOption : this.renderOption;

    const optionsHTML = arrayInput.map(value => {
      return renderOptions(value);
    });

    const placeholder = arrayInput.length
      ? 'Select a ' + labelInput
      : 'Good Luck!';

    // noStyle
    return (
      <Form.Item label={labelInput}>
        <Form.Item noStyle name={nameInput} label={labelInput} rules={[{ required: true }]}>
          <Select
            placeholder={placeholder}
            onChange={onChange}
            allowClear
          >
            {optionsHTML}
          </Select>
        </Form.Item>
        <div>{desc[nameInput]}</div>
      </Form.Item>
    );
  }

  render() {
    const {currentPeriodNumber, rewardListBelongsToCurrentAddress} = this.props;
    const {rewardInput, lotteryIdArray, takeAwardDate} = this.state;
    const {lotteryId, period, registrationInformation} = rewardInput;

    const onFinish = values => {
      this.setState({
        visible: true,
        rewardInput: {
          period: values.period,
          lotteryId: values.lotteryId,
          registrationInformation: `Address: ${values.receiving_address}; Telegram / WeChat: ${values.telegram}`
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
      <Card
        className='hover-cursor-auto'
        hoverable
        title={'Take Award (Latest Award Period: ' + (
          currentPeriodNumber < LOTTERY.START_PERIOD
            ? '-'
            : currentPeriodNumber - LOTTERY.START_PERIOD
        ) + ')'}
        extra={renderAvailableTime(takeAwardDate)}
      >
        <div className='section-content lottery-form-container'>
          <div className='basic-blank'/>
          <Form
            ref={this.formRef}
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
            >
              <Form.Item
                noStyle
                name="receiving_address"
                rules={[{ required: true, message: 'Please input the receiving address!' }]}
              >
                <Input maxLength={256}/>
              </Form.Item>
              <div>If you're concerned about privacy issue caused by filling in real address, you can fill in anything instead and wait for aelf team to contact you through offical channel. Please ensure contact you submit below is accurate.</div>
            </Form.Item>

            <Form.Item
              // label="Telegram / WeChat"
              label="Telegram / Email"
            >
              <Form.Item
                name="telegram"
                noStyle
                rules={[{ required: true, message: 'Please input the telegram!' }]}
              >
                <Input maxLength={128}/>
              </Form.Item>
              {/* <div>Please enter your user name (Telegram / WeChat) so that we can contact you</div> */}
              <div>Please note that verification of aelf's official status is required. aelf team will not charge you extra for any reason.</div>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                disabled={!checkTimeAvailable(takeAwardDate)}
                type="primary" htmlType="submit"
              >
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
          <p>Period: {period - LOTTERY.START_PERIOD + 1} &nbsp;&nbsp;&nbsp; Lottery ID: {lotteryId}</p>
          <p>{registrationInformation}</p>
        </Modal>
      </Card>
    );
  }
}
