import { TotalTime } from "../types/data";

function declOfNum(number: number, titles: string[]) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

const hours = ["час", "часа", "часов"];
const minutes = ["минута", "минуты", "минут"];

export function makeHumanTime(time: TotalTime) {
  const minutesFromSeconds = Math.floor(time.seconds / 60);
  const h = time.hours + Math.floor((time.minutes + minutesFromSeconds) / 60);
  const m = (time.minutes + minutesFromSeconds) % 60;
  return `${h} ${declOfNum(h, hours)} ${m} ${declOfNum(m, minutes)}`;
}
