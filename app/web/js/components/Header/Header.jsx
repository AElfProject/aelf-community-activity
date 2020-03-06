/**
 * @file
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, { Component } from 'react';
import { Link } from 'react-router';

import { Menu } from 'antd';

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

  renderMenu() {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[ this.state.current ]} mode="horizontal">
        <Menu.Item key="swap">
          <Link to='/swap' key='swap'>Tokne Swap</Link>
        </Menu.Item>
        <Menu.Item key="lottery">
          <Link to='/lottery' key='lottery'>Lottery</Link>
        </Menu.Item>
      </Menu>
    );
  }

  render() {

    const menuHTML = this.renderMenu();

    return (
      <div className='header-fixed-container'>
        <div className='header-container'>
          <Link to='/' key='logo'>
            <Svg
              icon='aelf_logo_purple'
              className='aelf-logo-container'
            />
          </Link>

          {menuHTML}

        </div>
      </div>);
  }
}
