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
function renderPrizeSteps() {
  const html = <span>test</span>;

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

  const stepsHTML = prizes.map(prize => {
    const descriptionHTML = <div className='prize-description'>{prize.description}</div>;
    return <Step title={prize.limit} description={descriptionHTML} />
  });

  return (
    <Steps current={1} progressDot={customDot}>
      {stepsHTML}
    </Steps>
  );
}

export default function renderLotteryDraw() {
  const prizeStepsHTML = renderPrizeSteps();

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Lottery
      </div>
      <div className='section-content lottery-prize-step-container'>
        <div className='prize-title'>Test Tokens Issued：<span className='prize-current-token'>17,000 ELF</span></div>
        <div className='prize-sub-title'>蓝牙耳机、小米音响、天猫精灵、华为手环  各 1 款</div>
        <div className='basic-line'/>
        <div className='prize-step-container'>
          {prizeStepsHTML}
        </div>
      </div>
    </section>
  );
}
