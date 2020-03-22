/* From start */
import React from 'react';
import { Steps, Popover } from 'antd';
const { Step } = Steps;
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

// TODO: 【Low priority】 get prize from api
function renderPrizeSteps(props) {

  const {currentStep} = props;

  const prizes = [
    {
      limit: '0ELF',
      description: 'aelf周边大礼包随机空投3个'
    },
    {
      limit: '10,000 ELF',
      description: '移动硬盘、蓝牙耳机、小米音响、天猫精灵、华为手环各1款\n' +
        '\n' +
        '（在4月10日将只发放法拉利奖项，抽奖要求为拥有10个Lottery Code ）',
    },
    {
      limit: '50,000 ELF',
      description: '99 - 999ELF奖项，随机空投5份(199ELF*2+399ELF*2+999ELF*1) +扫地机器人1款',
    },
    {
      limit: '100,000 ELF',
      description: 'iPhone11、小米笔记本、airpods、小米平板各1款'
    }
  ];

  const stepsHTML = prizes.map((prize, index) => {
    const descriptionHTML = <div className='prize-description'>{prize.description}</div>;
    return <Step title={prize.limit} description={descriptionHTML} key={index}/>
  });

  return (
    <Steps current={currentStep} progressDot={customDot}>
      {stepsHTML}
    </Steps>
  );
}

export default function renderLotteryDraw(props) {

  const {swapInfo} = props;
  const {swapRatio, currentRound} = swapInfo;

  const currentSwappedToken = currentRound.swappedAmount / (swapRatio.originShare / swapRatio.targetShare);
  const currentSwappedTokenStr = currentSwappedToken.toLocaleString();

  const currentStep = getCurrentStep(currentSwappedToken);
  const prizeStepsHTML = renderPrizeSteps({
    currentStep
  });

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Lottery
      </div>
      <div className='section-content lottery-prize-step-container'>
        <div className='prize-title'>Test Tokens Issued：<span className='prize-current-token'>{currentSwappedTokenStr} ELF</span></div>
        <div className='prize-sub-title'>蓝牙耳机、小米音响、天猫精灵、华为手环  各 1 款</div>
        <div className='basic-line'/>
        <div className='prize-step-container'>
          {prizeStepsHTML}
        </div>
      </div>
    </section>
  );
}

function getCurrentStep(currentSwappedToken) {
  let currentStep = 0;

  if (currentSwappedToken >= 100000) {
    currentStep = 3;
  } else if (currentSwappedToken >= 50000) {
    currentStep = 2;
  } else if (currentSwappedToken >= 10000) {
    currentStep = 1;
  }
  return currentStep;
}
