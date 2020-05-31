import { IGroup, RestructuredGroup, TotalTime } from "../types/data";

export class GroupsData {
  private result: RestructuredGroup[];
  private totalTime: TotalTime;

  constructor() {
    this.totalTime = { hours: 0, minutes: 0, seconds: 0 };
    this.result = [];
  }

  get _totalTime() {
    return this.totalTime;
  }

  get _result() {
    return this.result;
  }

  public makeDurationObject(durationIn: string): TotalTime {
    const duration = durationIn.split(":");
    return {
      hours: isNaN(+duration[0]) ? 0 : +duration[0],
      minutes: isNaN(+duration[1]) ? 0 : +duration[1],
      seconds: isNaN(+duration[2]) ? 0 : +duration[2],
    };
  }

  private addDurationToTotal = (duration: TotalTime) => {
    this.totalTime.hours += duration.hours;
    this.totalTime.minutes += duration.minutes;
    this.totalTime.seconds += duration.seconds;
  };

  private addDurationToUnit = (
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    duration: TotalTime
  ) => {
    this.result[groupIndex].days[dayIndex].units[
      unitIndex
    ].unitTotalTime.hours += duration.hours;
    this.result[groupIndex].days[dayIndex].units[
      unitIndex
    ].unitTotalTime.minutes += duration.minutes;
    this.result[groupIndex].days[dayIndex].units[
      unitIndex
    ].unitTotalTime.seconds += duration.seconds;
  };

  private addDurationToDay = (
    groupIndex: number,
    dayIndex: number,
    duration: TotalTime
  ) => {
    this.result[groupIndex].days[dayIndex].dayTotalTime.hours += duration.hours;
    this.result[groupIndex].days[dayIndex].dayTotalTime.minutes +=
      duration.minutes;
    this.result[groupIndex].days[dayIndex].dayTotalTime.seconds +=
      duration.seconds;
  };

  private addDurationToGroup = (groupIndex: number, duration: TotalTime) => {
    this.result[groupIndex].groupTotalTime.hours += duration.hours;
    this.result[groupIndex].groupTotalTime.minutes += duration.minutes;
    this.result[groupIndex].groupTotalTime.seconds += duration.seconds;
  };

  private checkUnitMinTime = (
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    timeBegin: string
  ) => {
    this.result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime =
      Date.parse(timeBegin) <
      Date.parse(
        this.result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime
      )
        ? timeBegin
        : this.result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime;
  };

  private checkUnitMaxTime = (
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    timeEnd: string
  ) => {
    this.result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime =
      Date.parse(timeEnd) >
      Date.parse(
        this.result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime
      )
        ? timeEnd
        : this.result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime;
  };

  private checkElement = (el: IGroup, groupIndex: number) => {
    if (groupIndex > -1) {
      el.data.forEach((day) => {
        const dayIndex = this.result[groupIndex].days.findIndex(
          (d) => d.dayName === day.time_begin.split(" ")[0]
        );
        const zone = {
          zoneName: day.zone_name,
          beginTime: day.time_begin,
          endTime: day.time_end,
          duration: day.duration_in,
        };
        const duration = this.makeDurationObject(day.duration_in);

        this.addDurationToGroup(groupIndex, duration);

        if (dayIndex > -1) {
          const unitIndex = this.result[groupIndex].days[
            dayIndex
          ].units.findIndex((u) => u.unitName === el.unit_name);
          this.addDurationToDay(groupIndex, dayIndex, duration);
          if (unitIndex > -1) {
            this.result[groupIndex].days[dayIndex].units[unitIndex].zones.push(
              zone
            );
            this.addDurationToUnit(groupIndex, dayIndex, unitIndex, duration);
            this.checkUnitMinTime(
              groupIndex,
              dayIndex,
              unitIndex,
              day.time_begin
            );
            this.checkUnitMaxTime(
              groupIndex,
              dayIndex,
              unitIndex,
              day.time_end
            );
          } else {
            this.result[groupIndex].days[dayIndex].units.push({
              unitName: el.unit_name,
              unitMinTime: day.time_begin,
              unitMaxTime: day.time_end,
              unitTotalTime: { ...duration },
              zones: [zone],
            });
          }
        } else {
          this.result[groupIndex].days.push({
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

        this.addDurationToTotal(duration);
      });
    }
  };

  public restructureData = (data: IGroup[]) => {
    data.forEach((el: IGroup) => {
      const groupIndex = this.result.findIndex(
        (g) => g.groupName === el.group_name
      );
      if (groupIndex > -1) {
        this.checkElement(el, groupIndex);
      } else {
        this.result.push({
          groupName: el.group_name,
          groupTotalTime: { hours: 0, minutes: 0, seconds: 0 },
          days: [],
        });
        const newGroupIndex = this.result.findIndex(
          (g) => g.groupName === el.group_name
        );
        this.checkElement(el, newGroupIndex);
      }
    });
  };
}
