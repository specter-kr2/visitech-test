import React, { FC, memo, useState, useEffect } from "react";
import { RestructuredData } from "../utils/RestructuredData";
import { RestructuredGroup, TotalTime } from "../types/data";
import { TableHeader } from "../components/TableHeader";
import { Group } from "../components/Group";
import { Unit } from "../components/Unit";
import { Day } from "../components/Day";
import { makeHumanTime } from "../utils/makeHumanTime";
import { BATCH_SIZE } from "../utils/constants";
import "./table.css";

import DATA from "../data/data.json";

const data = new RestructuredData();

export const Table: FC = memo(() => {
  const [groupsState, setGroupsState] = useState<RestructuredGroup[]>([]);
  const [totalTime, setTotalTime] = useState<TotalTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hiddenGroups, setHiddenGroups] = useState<number[]>([]);
  const [hiddenDays, setHiddenDays] = useState<string[]>([]);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function addData() {
      if (offset + BATCH_SIZE >= DATA.length) {
        data.restructureData(DATA.slice(offset, DATA.length));
        setGroupsState(data.result);
        setTotalTime(data.totalTime);
        return setOffset(DATA.length);
      }
      data.restructureData(DATA.slice(offset, offset + BATCH_SIZE));
      setGroupsState(data.result);
      setTotalTime(data.totalTime);
      return setOffset(offset + BATCH_SIZE);
    }
    const timer = setTimeout(addData, 0);
    return () => clearTimeout(timer);
  }, [offset]);

  const handleToggleGroup = (id: number) => {
    if (hiddenGroups.includes(id)) {
      return setHiddenGroups(hiddenGroups.filter((g) => g !== id));
    }
    return setHiddenGroups([...hiddenGroups, id]);
  };

  const handleToggleDay = (id: string) => {
    if (hiddenDays.includes(id)) {
      return setHiddenDays(hiddenDays.filter((g) => g !== id));
    }
    return setHiddenDays([...hiddenDays, id]);
  };

  return (
    <table>
      <TableHeader totalTime={makeHumanTime(totalTime)} />
      {groupsState.map((group, groupInd) => {
        return (
          <Group
            key={`group-${group.groupName}-${groupInd}`}
            groupName={group.groupName}
            groupTime={makeHumanTime(group.groupTotalTime)}
            handleToggleGroup={handleToggleGroup}
            id={groupInd}
          >
            {group.days.map((day, dayInd) => (
              <Day
                key={`group-${group.groupName}-${groupInd}-day-${day.dayName}-${dayInd} `}
                dayName={day.dayName}
                dayTime={makeHumanTime(day.dayTotalTime)}
                hideGroup={hiddenGroups.includes(groupInd)}
                handleToggleDay={handleToggleDay}
                id={`${groupInd}_${dayInd}`}
                hideDay={hiddenDays.includes(`${groupInd}_${dayInd}`)}
              >
                {day.units.map((unit, unitInd) => (
                  <Unit
                    key={`group-${group.groupName}-${groupInd}-day-${day.dayName}-${dayInd}-unit-${unit.unitName}-${unitInd}`}
                    unitName={unit.unitName}
                    maxTimeBegin={unit.unitMinTime}
                    maxTimeEnd={unit.unitMaxTime}
                    allDurationTime={makeHumanTime(unit.unitTotalTime)}
                    zones={unit.zones}
                    hideGroup={hiddenGroups.includes(groupInd)}
                    hideDay={hiddenDays.includes(`${groupInd}_${dayInd}`)}
                  />
                ))}
              </Day>
            ))}
          </Group>
        );
      })}
    </table>
  );
});
