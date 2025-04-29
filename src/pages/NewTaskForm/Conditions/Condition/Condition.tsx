import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { ConditionsType } from "../../types/condition";
import ValidationMessage from "../../../../components/ValidationMessage";

function Condition({
  condition,
  setCondition,
  index,
  remove,
}: {
  condition: ConditionsType;
  setCondition: (index: number, field: string, value: any) => void;
  index: number;
  remove: (index: number) => void;
}) {
  const [conditionState, setConditionState] = useState<ConditionsType>(condition);
  const updateCondition = (field: string, value: any) => {
    setCondition(index, field, value);
  };
  useEffect(() => {
    if (
      condition.controled &&
      (condition.minimum === undefined || condition.maximum === undefined || condition.unit === undefined)
    ) {
      setValidationMessage("Všechny hodnoty musí být vyplněny");
    } else if (
      condition.minimum != undefined &&
      condition.maximum != undefined &&
      condition.minimum >= condition.maximum
    ) {
      setValidationMessage("Maximum musí být větší než minimum!");
    } else {
      setValidationMessage("");
    }
    setConditionState(condition);
  }, [condition]);

  const [validationMessage, setValidationMessage] = useState<string>("");

  return (
    <div className="condition-container">
      <div className="condition">
        <input
          type="text"
          name="name"
          id="condition"
          maxLength={40}
          value={conditionState.name}
          onChange={(e) => updateCondition(e.target.name, e.target.value)}
        />
        <i onClick={() => remove(index)} className="condition-delete-button fa-solid fa-trash" />
      </div>
      <div className="range-inputs">
        {conditionState.controled ? (
          <>
            <input
              name="minimum"
              className="range-min"
              type="number"
              placeholder="Minimum"
              value={conditionState.minimum ?? ""}
              onChange={(e) =>
                updateCondition(e.target.name, e.target.value === "" ? undefined : Number(e.target.value))
              }
            />
            <input
              name="maximum"
              className="range-max"
              type="number"
              placeholder="Maximum"
              value={conditionState.maximum ?? ""}
              onChange={(e) =>
                updateCondition(e.target.name, e.target.value === "" ? undefined : Number(e.target.value))
              }
            />
            <input
              name="unit"
              className="range-unit"
              type="text"
              placeholder="Jednotka"
              value={conditionState.unit ?? ""}
              onChange={(e) => updateCondition(e.target.name, e.target.value === "" ? undefined : e.target.value)}
            />
          </>
        ) : undefined}
        <input
          name="controled"
          className="checkbox"
          type="checkbox"
          checked={conditionState.controled}
          onChange={(e) => updateCondition(e.target.name, e.target.checked)}
        />
      </div>
      {validationMessage ? <ValidationMessage message={validationMessage} /> : undefined}
    </div>
  );
}

export default Condition;
