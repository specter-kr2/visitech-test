export interface IUnitData {
  zone_name: string;
  time_begin: string;
  time_end: string;
  duration_in: string;
}

export interface IGroup {
  unit_name: string;
  group_name: string;
  data: IUnitData[];
}

export interface TotalTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface RestructuredZone {
  zoneName: string;
  beginTime: string;
  endTime: string;
  duration: string;
}

export interface RestructuredUnit {
  unitName: string;
  unitMinTime: string;
  unitMaxTime: string;
  unitTotalTime: TotalTime;
  zones: RestructuredZone[];
}

export interface RestructuredDay {
  dayName: string;
  dayTotalTime: TotalTime;
  units: RestructuredUnit[];
}

export interface RestructuredGroup {
  groupName: string;
  groupTotalTime: TotalTime;
  days: RestructuredDay[];
}
