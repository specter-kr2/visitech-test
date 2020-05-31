import { IGroup, RestructuredGroup, TotalTime } from "../types/data";

function makeDurationObject(durationIn: string): TotalTime {
  const duration = durationIn.split(":");
  return {
    hours: isNaN(+duration[0]) ? 0 : +duration[0],
    minutes: isNaN(+duration[1]) ? 0 : +duration[1],
    seconds: isNaN(+duration[2]) ? 0 : +duration[2],
  };
}

export function restructureData(data: IGroup[]) {
  const result: RestructuredGroup[] = [];
  const totalTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  const addDurationToTotal = (duration: TotalTime) => {
    totalTime.hours += duration.hours;
    totalTime.minutes += duration.minutes;
    totalTime.seconds += duration.seconds;
  };

  const addDurationToUnit = (
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    duration: TotalTime
  ) => {
    result[groupIndex].days[dayIndex].units[unitIndex].unitTotalTime.hours +=
      duration.hours;
    result[groupIndex].days[dayIndex].units[unitIndex].unitTotalTime.minutes +=
      duration.minutes;
    result[groupIndex].days[dayIndex].units[unitIndex].unitTotalTime.seconds +=
      duration.seconds;
  };

  const addDurationToDay = (
    groupIndex: number,
    dayIndex: number,
    duration: TotalTime
  ) => {
    result[groupIndex].days[dayIndex].dayTotalTime.hours += duration.hours;
    result[groupIndex].days[dayIndex].dayTotalTime.minutes += duration.minutes;
    result[groupIndex].days[dayIndex].dayTotalTime.seconds += duration.seconds;
  };

  const addDurationToGroup = (groupIndex: number, duration: TotalTime) => {
    result[groupIndex].groupTotalTime.hours += duration.hours;
    result[groupIndex].groupTotalTime.minutes += duration.minutes;
    result[groupIndex].groupTotalTime.seconds += duration.seconds;
  };

  const checkUnitMinTime = (
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    timeBegin: string
  ) => {
    result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime =
      Date.parse(timeBegin) <
      Date.parse(result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime)
        ? timeBegin
        : result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime;
  };

  const checkUnitMaxTime = (
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    timeEnd: string
  ) => {
    result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime =
      Date.parse(timeEnd) >
      Date.parse(result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime)
        ? timeEnd
        : result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime;
  };

  const checkElement = (el: IGroup, groupIndex: number) => {
    if (groupIndex > -1) {
      el.data.forEach((day) => {
        const dayIndex = result[groupIndex].days.findIndex(
          (d) => d.dayName === day.time_begin.split(" ")[0]
        );
        const zone = {
          zoneName: day.zone_name,
          beginTime: day.time_begin,
          endTime: day.time_end,
          duration: day.duration_in,
        };
        const duration = makeDurationObject(day.duration_in);

        addDurationToGroup(groupIndex, duration);

        if (dayIndex > -1) {
          const unitIndex = result[groupIndex].days[dayIndex].units.findIndex(
            (u) => u.unitName === el.unit_name
          );
          addDurationToDay(groupIndex, dayIndex, duration);
          if (unitIndex > -1) {
            result[groupIndex].days[dayIndex].units[unitIndex].zones.push(zone);
            addDurationToUnit(groupIndex, dayIndex, unitIndex, duration);
            checkUnitMinTime(groupIndex, dayIndex, unitIndex, day.time_begin);
            checkUnitMaxTime(groupIndex, dayIndex, unitIndex, day.time_end);
          } else {
            result[groupIndex].days[dayIndex].units.push({
              unitName: el.unit_name,
              unitMinTime: day.time_begin,
              unitMaxTime: day.time_end,
              unitTotalTime: { ...duration },
              zones: [zone],
            });
          }
        } else {
          result[groupIndex].days.push({
            dayName: day.time_begin.split(" ")[0],
            dayTotalTime: { ...duration },
            units: [
              {
                unitName: el.unit_name,
                unitMinTime: day.time_begin,
                unitMaxTime: day.time_end,
                unitTotalTime: { ...duration },
                zones: [zone],
              },
            ],
          });
        }

        addDurationToTotal(duration);
      });
    }
  };

  data.forEach((el: IGroup) => {
    const groupIndex = result.findIndex((g) => g.groupName === el.group_name);
    if (groupIndex > -1) {
      checkElement(el, groupIndex);
    } else {
      result.push({
        groupName: el.group_name,
        groupTotalTime: { hours: 0, minutes: 0, seconds: 0 },
        days: [],
      });
      const newGroupIndex = result.findIndex(
        (g) => g.groupName === el.group_name
      );
      checkElement(el, newGroupIndex);
    }
  });

  return { groups: result, totalTime };
}
