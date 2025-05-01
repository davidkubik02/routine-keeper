import React, { useState } from "react";
import { ConditionsType } from "../../pages/NewTaskForm/types/condition";
import Condition from "./Condition/Condition";

function Conditions({
  conditions,
  closeConditions,
  conditionsValidation,
}: {
  conditions: ConditionsType[];
  closeConditions: any;
  conditionsValidation: (conditions: ConditionsType[]) => void;
}) {
  const [conditionsState, setConditionsState] = useState<ConditionsType[]>(
    conditions.map((condition) => {
      return { ...condition, fulfilled: false, range: condition.minimum };
    })
  );

  const updateConditionState = (index: number, updatetCondition: ConditionsType): void => {
    setConditionsState((prev) => prev.map((condition, i) => (index === i ? updatetCondition : condition)));
  };

  const validateConditions = () => {
    const fulfilled = conditionsState.every((condition) => condition.fulfilled);
    if (fulfilled) {
      closeConditions();
      conditionsValidation(conditionsState);
    } else {
      alert("Potvrď všechny podmínky, bez toho úkol nesplníš!");
    }
  };

  return (
    <>
      <div className="overlay" onClick={closeConditions} />
      <div className="conditions-container">
        <i className="fa-solid fa-x note-close" onClick={closeConditions} />
        <h2>Potvrďte podmínky</h2>
        {conditionsState.map((condition, index) => (
          <Condition key={index} index={index} condition={condition} onUpdate={updateConditionState} />
          // <div key={index} className="condition-confirm">
          //   <div className="">
          //     <div>{condition.condition.name}</div>
          //     {condition.condition.controled ? (
          //       <div>
          //         <div>{condition.condition.minimum}</div>
          //         <input type="range" min={condition.condition.minimum} max={condition.condition.maximum} />
          //         <div>{condition.condition.maximum}</div>
          //         <div>{condition.condition.unit}</div>
          //       </div>
          //     ) : undefined}
          //   </div>
          //   <input
          //     onChange={() => {
          //       updateCheckBoxArray(index, condition.isChecked);
          //     }}
          //     type="checkbox"
          //     checked={condition.isChecked}
          //   />
          //   {/* dodělat range */}
          // </div>
        ))}
        <button onClick={validateConditions} className="condition-submit-button">
          Potvrdit
        </button>
      </div>
    </>
  );
}

export default Conditions;
