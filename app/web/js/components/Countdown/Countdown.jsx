import React, {Component} from 'react';

function getHoursMinutesSeconds(countdown) {
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor(countdown % 3600 / 60);
  const seconds = countdown % 60;

  return [hours, minutes, seconds].map(item => {
    if (item < 10) {
      return '0' + item;
    }
    return item;
  });
}

export default class CountDown extends Component {
  constructor() {
    super();
    this.state = {
      countdown: '-'
    };
    this.getCountdown = this.getCountdown.bind(this);
  }

  async componentDidMount() {
    const { countdown } = this.props;
    this.getCountdown(countdown);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.countdown !== this.props.countdown) {
      this.getCountdown(this.props.countdown);
    }
  }

  componentWillUnmount() {
    this.getCountdown = () => {};
  }

  async getCountdown(countdown = 0) {
    if (countdown && countdown >= 0) {
      countdown--;
    } else {
      return;
    }

    const countDownArray = getHoursMinutesSeconds(countdown);

    const countdownString = countDownArray.join(' : ');

    this.setState({
      countdown: countdownString
    });
    setTimeout(() => {
      this.getCountdown(countdown)
    }, 1000);
  }

  render() {
    const { countdown } = this.state;
    return <span>{countdown}</span>;
  }
}
