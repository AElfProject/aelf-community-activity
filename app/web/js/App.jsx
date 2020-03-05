/**
 *  @file
 *  @author huangzongzhe
 */

import React from 'react';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DownloadPlugins from './components/DownloadPlugins/DownloadPlugins';

import NightElfCheck from './utils/NightElfCheck';

export default class HomePage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showDownloadPlugins: false
    }
  }

  componentDidMount() {
    NightElfCheck.getInstance().check.then(checkResult => {
      console.log('checkResult: ', checkResult);
    }).catch(error => {
      this.setState({
        showDownloadPlugins: true
      });
    });
  }

  renderDownLoadPlugins() {
    return (
      <div>
        <div className='basic-blank'/>
        <div className='basic-container'>
          <DownloadPlugins/>
        </div>
      </div>
    );
  }

  render() {

    const {showDownloadPlugins} = this.state;

    const downloadPluginsHTML = showDownloadPlugins ? this.renderDownLoadPlugins() : false; // render or not
    return (
      <div>
        <Header/>
        <div className='body-container'>
          {downloadPluginsHTML}
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
}
