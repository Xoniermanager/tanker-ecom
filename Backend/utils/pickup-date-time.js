const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const calculatePickupDateTime = (days) => {
  let pickupDate = dayjs().add(days, 'day'); 
  
  while (pickupDate.day() === 0 || pickupDate.day() === 6) {
    pickupDate = pickupDate.add(1, 'day');
  }
  
  pickupDate = pickupDate.hour(10).minute(0).second(0);
  
  return pickupDate.format('YYYY-MM-DDTHH:mm:ss');
};

module.exports = {calculatePickupDateTime}