import React, { FC, memo } from "react";

interface Props {
  dayName: string;
  dayTime: string;
  hideGroup: boolean;
  hideDay: boolean;
  handleToggleDay: Function;
  id: string;
}

export const Day: FC<Props> = memo(
  ({ dayName, dayTime, hideGroup, hideDay, handleToggleDay, id, children }) => {
    return (
      <>
        <tbody className={hideGroup ? "hidden-block" : "d-table--grouprow"}>
          <tr
            className="cursor-pointer d-table--header "
            onClick={() => handleToggleDay(id)}
          >
            <th className=""></th>
            <th className="table--dayname-row">{dayName}</th>
            <th className="table--dayname-row"></th>
            <th className="table--dayname-row"></th>
            <th
              colSpan={2}
              className="table--dayname-row table--cell-align-left"
            >
              ВСЕГО ПО {dayName} ВРЕМЕНИ:
            </th>
            <th className="table--dayname-row table--cell-align-right">
              {dayTime}
            </th>
          </tr>
          <tr className={hideDay ? "hidden-block" : ""}>
            <th className=""></th>
            <th className=""></th>
            <th className="table--dayhead-row table--cell-align-left">
              ЮНИТ (unit_name)
            </th>
            <th className="table--dayhead-row table--cell-align-left">
              ЗОНА (zone_name)
            </th>
            <th className="table--dayhead-row table--cell-align-right">
              ВРЕМЯ ВХОДА (time_begin)
            </th>
            <th className="table--dayhead-row table--cell-align-right">
              ВРЕМЯ ВЫХОДА (time_end)
            </th>
            <th className="table--dayhead-row table--cell-align-right">
              ВРЕМЯ НАХОЖДЕНИЯ (duration_in)
            </th>
          </tr>
        </tbody>
        {children}
      </>
    );
  }
);
