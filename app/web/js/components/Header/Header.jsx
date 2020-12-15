/**
 * @file
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, { Component } from 'react';
import { Link } from 'react-router';

import { Menu } from 'antd';

import Account from '../Account/Account';

import Svg from '../Svg/Svg';
import './header.styles.less';

function getCurrentTab() {
  return window.location.hash.replace('#/', '') || 'swap';
}

export default class BrowserHeader extends Component {
  constructor() {
    super();

    this.state = {
      current: getCurrentTab(),
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({
      current: e.key,
    });
  };

  renderMenu(menuList) {

    const listHTML = menuList.map(item => {
      return <Menu.Item key={item.key}>
        <Link to={item.url} key={item.key}>{item.title}</Link>
      </Menu.Item>
    });

    return (
      <Menu onClick={this.handleClick} selectedKeys={[ this.state.current ]} mode="horizontal">
        {listHTML}
      </Menu>
    );
  }

  render() {

    const menuList = [
      {
        url: '/swap',
        key: 'swap',
        title: 'Token Swap'
      },
      // {
      //   url: '/daily',
      //   key: 'daily',
      //   title: 'Daily Tasks'
      // },
      // {
      //   url: '/lottery',
      //   key: 'lottery',
      //   title: 'Lottery'
      // },
    ];
    const menuHTML = this.renderMenu(menuList);

    return (
      <div className='header-fixed-container'>
        <div className='header-container'>
          <Link to='/' key='logo'>
            <Svg
              icon='aelf_logo_purple'
              className='aelf-logo-container'
            />
          </Link>
          <div className='header-right'>
            {menuHTML}
            <Account/>
          </div>
        </div>
      </div>);
  }
}
