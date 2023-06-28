import moment from 'moment';

const env = {
  pauseWeekend: process.env.PAUSE_WEEKEND || true,
};

const isPausedWeekend = () => {
  if (env.pauseWeekend) {
    const dayInWeek = moment.utc().day(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
    const hour = moment.utc().hour(); // 0-23
    Logger.debug('isPausedWeekend', dayInWeek, hour);
    // EUR Sun 21:00 - Fri 22:00, XAG Sun 22:00 - Fri 22:00
    if (dayInWeek > 5) return true;
    if (dayInWeek === 5 && hour >= 22) return true;
    if (dayInWeek === 0 && hour <= 21) return true;
  }
  return false;
};

export {
  isPausedWeekend,
};
