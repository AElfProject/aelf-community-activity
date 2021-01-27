/* From start */
import React from 'react';
import { Steps, Popover, Card } from 'antd';
import { StarFilled } from '@ant-design/icons';
const { Step } = Steps;
import { getPrizeListInfoNew } from '../../../constant/prizeList';
import isMobile  from '../../../utils/isMobile';
import './LotteryDraw.less';

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

function renderPrizeSteps(props) {

  const {currentStep, prizes} = props;

  const stepsHTML = prizes.map((prize, index) => {
    const title = prize.heavyweight ? [<StarFilled key={1}/>, ' ' + prize.time]: prize.time;
    const descriptionHTML = <div className='prize-description'>{prize.description}</div>;
    return <Step title={title} description={descriptionHTML} key={index}/>
  });

  return (
    <Steps current={currentStep} progressDot={customDot} direction={isMobile() ? 'vertical' : 'horizontal' }>
      {stepsHTML}
    </Steps>
  );
}

export default function renderLotteryDraw(props) {

  const {
    prizeInfo
  } = props;

  const {prizeList, start, next, conclusion, prolog} = prizeInfo[0];
  const prizesAll = prizeList.list;
  const {
    prizes,
    gameStart
  } = getPrizeListInfoNew({
    // todayTagInput: 903,
    prizeList: prizesAll,
    startDate: Number.parseInt(start, 10),
    next
  });

  const currentStep = 0;
  const prizeStepsHTML = renderPrizeSteps({
    currentStep,
    prizes
  });
  let currentDesc = prizes[currentStep] ? prizes[currentStep].description : (conclusion || 'Game Over~');
  currentDesc = gameStart ? currentDesc : (prolog || 'Coming soon~');

  return (
    <Card
      className='hover-cursor-auto'
      hoverable
      title='Lottery Draw: We draw the winning lottery code at 6 pm (GMT + 8)'>
      <div className='section-content lottery-prize-step-container'>
        <div className='prize-title'>
          <span className='prize-current-token'>{currentDesc}</span>
        </div>
        <div className='prize-sub-title'>After the Draw, please visit the Draw History Page to see the details of the prizes.</div>
        <div className='basic-line'/>
        <div className='prize-step-container'>
          {prizeStepsHTML}
        </div>
      </div>
    </Card>
  );
}
