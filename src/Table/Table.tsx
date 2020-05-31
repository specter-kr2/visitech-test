import React, { FC, memo, useState, useEffect } from "react";
import { GroupsData } from "../utils/GroupsData";
import { RestructuredGroup, TotalTime } from "../types/data";
import { TableHeader } from "../components/TableHeader";
import { Group } from "../components/Group";
import { Unit } from "../components/Unit";
import { Day } from "../components/Day";
import { makeHumanTime } from "../utils/makeHumanTime";
import "./table.css";

import DATA from "../data/data.json";

const groupsData = new GroupsData();
const LIMIT = 2;

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
      if (offset + LIMIT >= DATA.length) {
        groupsData.restructureData(
          DATA.slice(offset, offset + (DATA.length - offset))
        );
        setGroupsState(groupsData._result);
        setTotalTime(groupsData._totalTime);
        return setOffset(offset + (DATA.length - offset));
      }
      groupsData.restructureData(DATA.slice(offset, offset + LIMIT));
      setGroupsState(groupsData._result);
      setTotalTime(groupsData._totalTime);
      return setOffset(offset + LIMIT);
    }
    const timer = setInterval(addData, 500);
    return () => clearInterval(timer);
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
