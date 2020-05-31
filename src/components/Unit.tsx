import React, { FC, useState, memo } from "react";
import { RestructuredZone } from "../types/data";
import { Zone } from "./Zone";

interface Props {
  unitName: string;
  maxTimeBegin: string;
  maxTimeEnd: string;
  allDurationTime: string;
  zones: RestructuredZone[];
  hideDay: boolean;
  hideGroup: boolean;
}

export const Unit: FC<Props> = memo(
  ({
    unitName,
    maxTimeBegin,
    maxTimeEnd,
    allDurationTime,
    zones,
    hideDay,
    hideGroup,
  }) => {
    const [showUnit, setShowUnit] = useState(true);

    return (
      <>
        <tbody className={hideDay || hideGroup ? "hidden-block" : ""}>
          <tr className="cursor-pointer" onClick={() => setShowUnit(!showUnit)}>
            <td className=""></td>
            <td className=""></td>
            <td className="table--unitname-row">{unitName}</td>
            <td className="table--unitname-row"></td>
            <td className="table--unitname-row table--cell-align-right ">
              МИН В ДЕНЬ ПО ЮНИТУ:
              <br />
              {maxTimeBegin}
            </td>
            <td className="table--unitname-row table--cell-align-right ">
              МАКС В ДЕНЬ ПО ЮНИТУ:
              <br />
              {maxTimeEnd}
            </td>
            <td className="table--unitname-row table--cell-align-right ">
              ОБЩЕЕ В ДЕНЬ ПО ЮНИТУ:
              <br />
              {allDurationTime}
            </td>
          </tr>
        </tbody>
        <tbody
          className={!showUnit || hideDay || hideGroup ? "hidden-block" : ""}
        >
          {showUnit && zones.map(Zone)}
        </tbody>
      </>
    );
  }
);
