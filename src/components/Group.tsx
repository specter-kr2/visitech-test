import React, { FC, memo } from "react";

interface Props {
  groupName: string;
  groupTime: string;
  handleToggleGroup: Function;
  id: number;
}

export const Group: FC<Props> = memo(
  ({ groupName, groupTime, handleToggleGroup, id, children }) => {
    return (
      <>
        <tbody>
          <tr
            className="table--groupname-row cursor-pointer"
            onClick={() => handleToggleGroup(id)}
          >
            <th className="">{groupName}</th>
            <th className=""></th>
            <th className=""></th>
            <th className=""></th>
            <th colSpan={2} className="table--cell-align-left">
              ВСЕГО ПО {groupName} ВРЕМЕНИ:
            </th>
            <th className="table--cell-align-right">{groupTime}</th>
          </tr>
        </tbody>

        {children}
      </>
    );
  }
);
