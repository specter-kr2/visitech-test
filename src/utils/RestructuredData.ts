import {
  IGroup,
  IUnitData,
  RestructuredGroup,
  TotalTime,
  RestructuredZone,
} from "../types/data";

export class RestructuredData {
  private _result: RestructuredGroup[];
  private _totalTime: TotalTime;

  constructor() {
    this._totalTime = { hours: 0, minutes: 0, seconds: 0 };
    this._result = [];
  }

  get totalTime() {
    return this._totalTime;
  }

  get result() {
    return this._result;
  }

  public makeDurationObject(durationIn: string): TotalTime {
    const duration = durationIn.split(":");
    return {
      hours: isNaN(+duration[0]) ? 0 : +duration[0],
      minutes: isNaN(+duration[1]) ? 0 : +duration[1],
      seconds: isNaN(+duration[2]) ? 0 : +duration[2],
    };
  }

  private addDurationToTotal(duration: TotalTime) {
    this._totalTime.hours += duration.hours;
    this._totalTime.minutes += duration.minutes;
    this._totalTime.seconds += duration.seconds;
  }

  private addDurationToUnit(
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    duration: TotalTime
  ) {
    this._result[groupIndex].days[dayIndex].units[
      unitIndex
    ].unitTotalTime.hours += duration.hours;
    this._result[groupIndex].days[dayIndex].units[
      unitIndex
    ].unitTotalTime.minutes += duration.minutes;
    this._result[groupIndex].days[dayIndex].units[
      unitIndex
    ].unitTotalTime.seconds += duration.seconds;
  }

  private addDurationToDay(
    groupIndex: number,
    dayIndex: number,
    duration: TotalTime
  ) {
    this._result[groupIndex].days[dayIndex].dayTotalTime.hours +=
      duration.hours;
    this._result[groupIndex].days[dayIndex].dayTotalTime.minutes +=
      duration.minutes;
    this._result[groupIndex].days[dayIndex].dayTotalTime.seconds +=
      duration.seconds;
  }

  private addDurationToGroup(groupIndex: number, duration: TotalTime) {
    this._result[groupIndex].groupTotalTime.hours += duration.hours;
    this._result[groupIndex].groupTotalTime.minutes += duration.minutes;
    this._result[groupIndex].groupTotalTime.seconds += duration.seconds;
  }

  private checkUnitMinTime(
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    timeBegin: string
  ) {
    this._result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime =
      Date.parse(timeBegin) <
      Date.parse(
        this._result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime
      )
        ? timeBegin
        : this._result[groupIndex].days[dayIndex].units[unitIndex].unitMinTime;
  }

  private checkUnitMaxTime(
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    timeEnd: string
  ) {
    this._result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime =
      Date.parse(timeEnd) >
      Date.parse(
        this._result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime
      )
        ? timeEnd
        : this._result[groupIndex].days[dayIndex].units[unitIndex].unitMaxTime;
  }

  private makeRestructuredZone(day: IUnitData) {
    return {
      zoneName: day.zone_name,
      beginTime: day.time_begin,
      endTime: day.time_end,
      duration: day.duration_in,
    };
  }

  private pushGroup(groupName: string) {
    this._result.push({
      groupName: groupName,
      groupTotalTime: { hours: 0, minutes: 0, seconds: 0 },
      days: [],
    });
  }

  private pushDay(
    groupIndex: number,
    day: IUnitData,
    unitName: string,
    duration: TotalTime,
    zone: RestructuredZone
  ) {
    this._result[groupIndex].days.push({
      dayName: day.time_begin.split(" ")[0],
      dayTotalTime: { ...duration },
      units: [
        {
          unitName: unitName,
          unitMinTime: day.time_begin,
          unitMaxTime: day.time_end,
          unitTotalTime: { ...duration },
          zones: [zone],
        },
      ],
    });
  }

  private pushUnit(
    groupIndex: number,
    dayIndex: number,
    day: IUnitData,
    unitName: string,
    duration: TotalTime,
    zone: RestructuredZone
  ) {
    this._result[groupIndex].days[dayIndex].units.push({
      unitName: unitName,
      unitMinTime: day.time_begin,
      unitMaxTime: day.time_end,
      unitTotalTime: { ...duration },
      zones: [zone],
    });
  }

  private pushZone(
    groupIndex: number,
    dayIndex: number,
    unitIndex: number,
    zone: RestructuredZone
  ) {
    this._result[groupIndex].days[dayIndex].units[unitIndex].zones.push(zone);
  }

  private findGroupIndex(groupName: string) {
    return this._result.findIndex((g) => g.groupName === groupName);
  }

  private findDayIndex(groupIndex: number, dayName: string) {
    return this._result[groupIndex].days.findIndex(
      (d) => d.dayName === dayName.split(" ")[0]
    );
  }

  private findUnitIndex(
    groupIndex: number,
    dayIndex: number,
    unitName: string
  ) {
    return this._result[groupIndex].days[dayIndex].units.findIndex(
      (u) => u.unitName === unitName
    );
  }

  private checkElement(el: IGroup, groupIndex: number) {
    if (groupIndex > -1) {
      el.data.forEach((day) => {
        const dayIndex = this.findDayIndex(groupIndex, day.time_begin);
        const zone = this.makeRestructuredZone(day);
        const duration = this.makeDurationObject(day.duration_in);

        this.addDurationToGroup(groupIndex, duration);

        if (dayIndex > -1) {
          const unitIndex = this.findUnitIndex(
            groupIndex,
            dayIndex,
            el.unit_name
          );
          this.addDurationToDay(groupIndex, dayIndex, duration);

          if (unitIndex > -1) {
            this.pushZone(groupIndex, dayIndex, unitIndex, zone);
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
            this.pushUnit(
              groupIndex,
              dayIndex,
              day,
              el.unit_name,
              duration,
              zone
            );
          }
        } else {
          this.pushDay(groupIndex, day, el.unit_name, duration, zone);
        }

        this.addDurationToTotal(duration);
      });
    }
  }

  public restructureData(data: IGroup[]) {
    data.forEach((el: IGroup) => {
      const groupIndex = this.findGroupIndex(el.group_name);
      if (groupIndex > -1) {
        this.checkElement(el, groupIndex);
      } else {
        this.pushGroup(el.group_name);
        const newGroupIndex = this.findGroupIndex(el.group_name);
        this.checkElement(el, newGroupIndex);
      }
    });
  }
}
