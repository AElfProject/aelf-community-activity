export const prizeList = [
  {
    time: 'June 23 19:00',
    endTime: '1611745200000',
    heavyweight: true,
    limit: '0ELF',
    description: 'airpods  * 1, Media Robot Vacuum Cleaner * 1'
  },
  {
    time: 'June 24 20:00',
    endTime: '1611748800000',
    heavyweight: true,
    limit: '0ELF',
    description: 'airpods  * 1, Media Robot Vacuum Cleaner * 1'
  },
  {
    time: 'June 25 21:00',
    endTime: '1611752400000',
    heavyweight: false,
    description: '5 random drops (199ELF * 2 + 399ELF * 2 + 999ELF * 1)'
  },
  // {
  //   time: 'June 26 22:00',
  //   endTime: '1611756000000',
  //   heavyweight: false,
  //   description:'Xiaomi Stereo * 1, Tmall Genie * 1'
  // },
  {
    time: 'June 27',
    heavyweight: false,
    description: 'Smart Bracelet * 1, Redmi AirDots * 1'
  },
  {
    time: 'June 28',
    heavyweight: false,
    description: 'aelfie * 3'
  },
  {
    time: 'June 29',
    heavyweight: false,
    description: 'Huawei Smart Bracelet * 1, External Hard Drive 1T * 1'
  },
  {
    time: 'June 30',
    heavyweight: false,
    description: '5 random drops (199ELF * 2 + 399ELF * 2 + 999ELF * 1)'
  },
  {
    time: 'July 1',
    heavyweight: true,
    description: 'iPhone11 128G * 1, Xiaomi Pad * 1'
  },
  {
    time: 'July 2',
    heavyweight: false,
    description: 'Xiaomi Stereo * 1, Tmall Genie * 1'
  },
  {
    time: 'July 3',
    heavyweight: false,
    description: 'External Hard Drive 1T * 1, Xiaomi Stereo * 1'
  },
  {
    time: 'July 4',
    heavyweight: false,
    description: 'Redmi AirDots * 1, Huawei Smart Bracelet * 1'
  },
  {
    time: 'July 5',
    heavyweight: false,
    limit: '0ELF',
    description: '5 random drops (199 ELF * 2 + 399ELF * 2 + 999ELF * 1)'
  },
  {
    time: 'July 6',
    heavyweight: false,
    description: 'Media Robot Vacuum Cleaner  * 1'
  },
  {
    time: 'July 7',
    heavyweight: false,
    limit: '0ELF',
    description: 'aelfie * 3'
  },
  {
    time: 'July 8',
    heavyweight: true,
    description: 'Xiaomi Ruby laptop * 1'
  },
  {
    time: 'July 9',
    heavyweight: false,
    description: 'Huawei Smart Bracelet * 1'
  },
  {
    time: 'July 10',
    heavyweight: false,
    description: 'External Hard Drive 1T * 1'
  },
  {
    time: 'July 11',
    heavyweight: false,
    description: '5 random drops (199 ELF * 2 + 399 ELF * 2 + 999 ELF * 1)'
  },
  {
    time: 'July 12',
    heavyweight: false,
    description: 'Xiaomi Stereo * 1, Huawei Smart Bracelet * 1'
  },{
    time: 'July 13',
    heavyweight: false,
    description: '5 random drops (199 ELF * 2 + 399 ELF * 2 + 999 ELF * 1)'
  },
  {
    time: 'July 14',
    heavyweight: false,
    description: 'aelfie * 3'
  },
  {
    time: 'July 15',
    heavyweight: true,
    description: 'airpods * 1, xiaomi pad * 1, Media Robot Vacuum Cleaner * 1'
  },
  {
    time: 'July 16',
    heavyweight: false,
    description: 'Grand prize draw'
  }
];

export const getPrizeListInfoNew = (options) => {
  const {
    prizeList,
  } = options;

  const timeNow = new Date().getTime();
  const gameStart = prizeList[0] ? prizeList[0].endTime < timeNow : false;
  const validPrizeList = prizeList.filter(prize => {
    return prize.endTime > timeNow;
  });

  return {
    prizes: validPrizeList.slice(0, 4),
    gameStart
  };
};
