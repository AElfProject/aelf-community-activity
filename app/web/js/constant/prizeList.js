export const prizeList = [
  {
    time: 'June 24',
    heavyweight: true,
    limit: '0ELF',
    description: 'airpods  * 1, Media Robot Vacuum Cleaner * 1'
  },
  {
    time: 'June 25',
    heavyweight: false,
    description: '5 random drops (199ELF * 2 + 399ELF * 2 + 999ELF * 1)'
  },
  {
    time: 'June 26',
    heavyweight: false,
    description:'Xiaomi Stereo * 1, Tmall Genie * 1'
  },
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

// export const getPrizeListInfo = (todayTagInput, startDate = 810, monthInput, dateInput = 0) => {
export const getPrizeListInfo = (options) => {
  const {
    todayTagInput,
    prizeList,
    startDate,
    monthInput,
    dateInput = 0,
    next
  } = options;

  const today = new Date();
  const month = monthInput || today.getMonth() + 1;
  let date = dateInput || today.getDate();
  date = date < 10 ? '0' + date : date;
  const todayTag = todayTagInput || parseInt(month + '' + date, 10);
  let startIndex = todayTag === startDate ? 0 : todayTag - startDate;
  if ((todayTag - startDate) > 60) {
    const temp = Math.floor(todayTag / 100) * 100;
    startIndex = startIndex - (temp - next);
  }

  console.log('todayTag: ', todayTag);
  return {
    prizes: prizeList.slice(startIndex, startIndex + 4),
    gameStart: startIndex >= 0
  };
};
