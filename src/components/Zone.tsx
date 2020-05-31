import React from "react";
import { RestructuredZone } from "../types/data";

export const Zone = (zone: RestructuredZone, index: number) => {
  if (zone) {
    return (
      <tr
        key={`zone-${zone.zoneName}-${index}-${zone.duration}`}
        className="table--zone-row"
      >
        <td className=""></td>
        <td className=""></td>
        <td className=""></td>
        <td className="">{zone.zoneName}</td>
        <td className="table--cell-align-right">{zone.beginTime}</td>
        <td className="table--cell-align-right">{zone.endTime}</td>
        <td className="table--cell-align-right">{zone.duration}</td>
      </tr>
    );
  }
};
