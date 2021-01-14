/**
 * @file
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, { Component } from 'react';
import { Link } from 'react-router';

import { Menu } from 'antd';

import Account from '../Account/Account';
import { MenuUnfoldOutlined, ReloadOutlined } from '@ant-design/icons';
import isMobile from 'ismobilejs';

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

  renderMobileMenu(menuListTemp) {
    const menuList = menuListTemp.filter(item => !item.pcOnly);
    const listHTML = menuList.map(item => {
      return <Menu.Item key={item.key}>
        <Link to={item.url} key={item.key}>{item.title}</Link>
      </Menu.Item>
    });

    return (
      <div className="header-mobile-menu">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[ this.state.current ]}
          mode="horizontal"
          overflowedIndicator={<MenuUnfoldOutlined style={{ fontSize: '24px'}}/>}
        >
            {listHTML}
        </Menu>
      </div>);
  }

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
        title: 'Claim Token',
        pcOnly: true,
      },
      {
        url: '/daily',
        key: 'daily',
        title: 'Daily Tasks'
      },
      {
        url: '/lottery',
        key: 'lottery',
        title: 'Lottery'
      },
    ];
    const menuHTML = this.renderMenu(menuList);
    const mobileMenuHTML = this.renderMobileMenu(menuList);

    const isPhone = isMobile(window.navigator).phone;

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
            {!isPhone && menuHTML}
            {/* Please do not refresh page in AELF Wallet 1.0.x. It will crash. */}
            {/*{isPhone && <span className="header-reload"><ReloadOutlined onClick={() => {*/}
            {/*  if (window.reloadLock) {*/}
            {/*    return;*/}
            {/*  }*/}
            {/*  window.reloadLock = true;*/}
            {/*  window.location.reload();*/}
            {/*}}/></span>}*/}
            <Account/>
            {isPhone && mobileMenuHTML}
          </div>
        </div>
      </div>);
  }
}
