import React, { useEffect, useState } from "react";
import { ConditionsType } from "../../../pages/NewTaskForm/types/condition";
import "./Condition.css";

function Condition({
  index,
  condition,
  onUpdate,
}: {
  index: number;
  condition: ConditionsType;
  onUpdate: (index: number, updatetCondition: ConditionsType) => void;
}) {
  const changeHandle = (field: "range" | "fulfilled", value: any) => {
    onUpdate(index, { ...condition, [field]: value });
  };
  return (
    <div className="condition-confirm" style={{ backgroundColor: condition.fulfilled ? "#e2ffb6" : "#ffacb6" }}>
      <div className="condition-confirm-container">
        <div>{condition.name}</div>
        {condition.controled ? (
          <div className="range-wrapper">
            <div className="range-track">
              <input
                disabled={condition.fulfilled}
                readOnly
                type="range"
                min={condition.minimum}
                max={condition.maximum}
                value={condition.range}
                onChange={(e) => changeHandle("range", parseInt(e.target.value))}
                className="range-slider"
                id="rangeInput"
              />
              <div
                className="range-value"
                style={{
                  left: `${
                    (((condition.range ?? 0) - (condition.minimum ?? 0)) /
                      ((condition.maximum ?? 0) - (condition.minimum ?? 0))) *
                    100
                  }%`,
                }}
              >
                {condition.range} {condition.unit}
              </div>
            </div>

            <div className="range-labels">
              <span>{condition.minimum}</span>
              <span>{condition.maximum}</span>
            </div>
          </div>
        ) : undefined}
      </div>
      <input
        onChange={(e) => {
          changeHandle("fulfilled", e.target.checked);
        }}
        type="checkbox"
        checked={condition.fulfilled}
      />
    </div>
  );
}

export default Condition;
