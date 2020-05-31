import React, { FC } from "react";

type Props = {
  totalTime: string;
};

export const TableHeader: FC<Props> = ({ totalTime }) => {
  return (
    <thead>
      <tr className="table--header-row">
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th colSpan={2} className="table--cell-align-left">
          ВСЕГО ВРЕМЕНИ:
        </th>
        <th className="table--cell-align-right">{totalTime}</th>
      </tr>
    </thead>
  );
};
