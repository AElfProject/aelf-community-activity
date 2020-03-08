import React, {Component} from 'react';
import { Button, Menu, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import {NightElfCheck} from '../../utils/NightElf/NightElf';
import {LOGIN_INFO, CHAIN_ID} from '../../constant/constant';

import './account.less';

export default class Account extends Component {
  constructor() {
    super();
    this.state = {
      showLoginButton: true,
      loginName: '-',
      loginAddress: '-'
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.login();
  }

  login() {
    NightElfCheck.getInstance().check.then(checkResult => {
      const aelf = NightElfCheck.initAelfInstanceByExtension();
      aelf.login(LOGIN_INFO).then(result => {
        if (result.error) {
          message.warning(result.errorMessage.message || result.errorMessage);
        } else {
          const detail = JSON.parse(result.detail);
          this.setState({
            showLoginButton: false,
            loginName: detail.name,
            loginAddress: detail.address
          });
        }
      }).catch(error => {
        message.error(error.message || 'Extension error');
      });

    }).catch(error => {
      console.log('error: ', error);
    });
  }

  logout() {
    const aelf = NightElfCheck.initAelfInstanceByExtension();
    aelf.logout({
      chainId: CHAIN_ID,
      address: this.state.loginAddress
    }, (error, result) => {
      if (error) {
        message.error(error.errorMessage.message || error.errorMessage || error.message);
      } else {
        this.setState({
          showLoginButton: true,
          loginName: '-',
          loginAddress: '-',
        });
      }
    });
  }

  renderLogin() {
    return <Button type="primary" onClick={this.login}>Login</Button>
  }

  renderAccountInfo() {

    const menuHTML = <Menu onClick={this.logout}>
      <Menu.Item key="1">logout</Menu.Item>
    </Menu>;
    return (
      <Dropdown overlay={menuHTML}>
        <Button>
          {this.state.loginName} <DownOutlined />
        </Button>
      </Dropdown>
    );
  }

  render() {
    const { showLoginButton } = this.state;
    const accountOperationShowHTML = showLoginButton ? this.renderLogin() : this.renderAccountInfo();

    return (
      <div className='account-container'>
        {accountOperationShowHTML}
      </div>
    );
  }
}
