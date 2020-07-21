/**
 * @file
 * @author zhouminghui yangpeiyang, hzz780
 */

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import './DownloadPlugins.less';

export default class DownloadPlugins extends PureComponent {

  render() {
    const { style } = this.props;
    return (
      <div className='DownloadPlugins' style={style}>
        {/* <div className='Tips'>为避免每次操作时填写私钥信息，你可以通过插件来使用这些工具（安装插件后仍然显示这些信息，请尝试刷新操作）</div> */}
        <div className='Tips'>
          <div>Before you start, make sure you have downloaded and installed the NightELF explorer extension, and don't forget to refresh the page:) </div>
          <div>Please use Chrome or the explorer that supports Chrome extensions.</div>
        </div>
        <div className='step'>
          <Row>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className='Step-con'>
                1.Install the extension
                <a className='download-button' target='_blank' href='https://chrome.google.com/webstore/search/AELF'>download</a>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className='Step-con'>2.Create a wallet</div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className='Step-con'>3.Refresh the page!</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
