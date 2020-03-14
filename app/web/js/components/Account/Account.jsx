import React, {Component} from 'react';
import { Button, Menu, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './account.less';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../actions/account'

function mapStateToProps(state) {
  return {
    account: state.account.toJS()
  }
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(ActionsAccount, dispatch)
  }
}
class Account extends Component {
  constructor() {
    super();
    this.state = {
      showLoginButton: true,
      loginName: '-',
      loginAddress: '-'
    };
  }

  componentDidMount() {
    this.props.asyncLogin();
  }

  renderLogin() {
    return <Button type="primary" onClick={this.props.asyncLogin}>Login</Button>
  }

  renderAccountInfo() {
    const { account } = this.props;
    const { accountInfo } = account;
    const { name } = accountInfo;
    const menuHTML = <Menu onClick={this.props.asyncLogout}>
      <Menu.Item key="1">logout</Menu.Item>
    </Menu>;
    return (
      <Dropdown overlay={menuHTML}>
        <Button>
          {name} <DownOutlined />
        </Button>
      </Dropdown>
    );
  }

  render() {
    const { account } = this.props;
    const { accountInfo } = account;
    const { address } = accountInfo;

    const accountOperationShowHTML = !address ? this.renderLogin() : this.renderAccountInfo();

    return (
      <div className='account-container'>
        {accountOperationShowHTML}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
