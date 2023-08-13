import { TimesType } from '../components/route-modal/route-modal.component';

export class TimeUtils {
  findClosestFutureTime(arrayOfTimes: TimesType[]) {
    const currentTime = new Date();
    const currentTimestamp = currentTime.getTime();

    let closestFutureTimeDiff = Infinity;
    let closestFutureTimeIndex = -1;

    for (let i = 0; i < arrayOfTimes.length; i++) {
      const timeParts = arrayOfTimes[i]['time'].split(':');
      const time = new Date();
      time.setHours(parseInt(timeParts[0], 10));
      time.setMinutes(parseInt(timeParts[1], 10));
      time.setSeconds(0);

      const timeTimestamp = time.getTime();

      // Calculate time difference, considering the possibility of the next day
      const timeDiff =
        timeTimestamp > currentTimestamp
          ? timeTimestamp - currentTimestamp
          : timeTimestamp + 24 * 60 * 60 * 1000 - currentTimestamp;

      if (timeDiff < closestFutureTimeDiff) {
        closestFutureTimeDiff = timeDiff;
        closestFutureTimeIndex = i;
      }
    }

    if (closestFutureTimeIndex !== -1) {
      return arrayOfTimes[closestFutureTimeIndex].time;
    } else {
      return null; // No future time found
    }
  }
}
