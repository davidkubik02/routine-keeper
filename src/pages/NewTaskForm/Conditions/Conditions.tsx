import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import "./Conditions.css";
import { ConditionsType } from "../types/condition";
import Condition from "./Condition/Condition";

function Conditions({
  conditions,
  setConditions,
  removeFromArrayByIndex,
}: {
  conditions: ConditionsType[];
  setConditions: Dispatch<SetStateAction<ConditionsType[]>>;
  removeFromArrayByIndex: (array: ConditionsType[], index: number) => ConditionsType[];
}) {
  const setCondition = (index: number, field: string, value: any) => {
    setConditions((conditions) => {
      const updatedConditions = [...conditions];
      const prev = updatedConditions[index];
      updatedConditions[index] = {
        ...prev,
        [field]: value,
      };
      return updatedConditions;
    });
  };
  const removeCondition = (index: number) => {
    setConditions((conditions) => removeFromArrayByIndex(conditions, index));
  };
  return (
    <div className="form-input">
      <label htmlFor="conditions">Podmínky k splnění:</label>
      {conditions.map((condition, index) => {
        return (
          <Condition
            key={index}
            condition={condition}
            setCondition={setCondition}
            index={index}
            remove={removeCondition}
          />
        );
      })}
      {conditions.length < 5 && (
        <div
          onClick={() =>
            setConditions((conditions) => [...conditions, { name: "", controled: false, fulfilled: false }])
          }
          className="condition-add-button"
        >
          {"přidat podmínku"}
        </div>
      )}
    </div>
  );
}

export default Conditions;
