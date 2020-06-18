/* From start */
import React from 'react';
import { Steps, Popover, Card } from 'antd';
import { StarFilled } from '@ant-design/icons';
const { Step } = Steps;
import {TOKEN_DECIMAL} from '../../../constant/constant';
import { getPrizeListInfo } from '../../../constant/prizeList';
import isMobile  from '../../../utils/isMobile';
import './LotteryDraw.less';

const prizeListInfo = getPrizeListInfo();
// const prizeListInfo = getPrizeListInfo(630, 6, 30);
// const prizeListInfo = getPrizeListInfo(718, 7, 1);
const {
  prizes,
  gameStart
} = prizeListInfo;

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

// TODO: 【Low priority】 get prize from api
function renderPrizeSteps(props) {

  const {currentStep} = props;

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

export default function renderLotteryDraw() {

  const currentStep = 0;
  const prizeStepsHTML = renderPrizeSteps({
    currentStep
  });
  let currentDesc = prizes[currentStep] ? prizes[currentStep].description : 'Game Over~';
  currentDesc = gameStart ? currentDesc : 'Coming soon~';

  return (
    <Card
      className='hover-cursor-auto'
      hoverable
      title='Lottery Draw: We draw the winning lottery code at 5 pm (GMT + 8)'>
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
