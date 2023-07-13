import React, { useState } from "react";

interface conditionInterface {
  condition: string;
  isChecked: boolean;
}

function Conditions({
  conditions,
  closeConditions,
  conditionsValidation,
}: {
  conditions: string[];
  closeConditions: any;
  conditionsValidation: any;
}) {
  const [conditionsState, setConditionsState] = useState<conditionInterface[]>(
    conditions.map((condition) => {
      return { condition, isChecked: false };
    })
  );

  const updateCheckBoxArray = (index: number, isChecked: boolean): void => {
    setConditionsState((prevConditionsState) => {
      const updatedConditions = [...prevConditionsState];
      updatedConditions[index].isChecked = !isChecked;
      return updatedConditions;
    });
  };

  const validateConditions = () => {
    const validation = conditionsState.filter(
      (condition) => !condition.isChecked
    );
    if (validation.length) {
      alert("Potvrďte všechny podmínky k splnění!");
    } else {
      closeConditions();
      conditionsValidation();
    }
  };

  return (
    <>
      <div className="overlay" onClick={closeConditions} />
      <div className="conditions-container">
        <i className="fa-solid fa-x note-close" onClick={closeConditions} />
        <h2>Potvrďte podmínky</h2>
        {conditionsState.map((condition, index) => (
          <div key={index} className="condition-confirm">
            <input type="text" readOnly value={condition.condition} />
            <input
              onChange={() => {
                updateCheckBoxArray(index, condition.isChecked);
              }}
              type="checkbox"
              checked={condition.isChecked}
            />
          </div>
        ))}
        <button
          onClick={validateConditions}
          className="condition-submit-button"
        >
          Potvrdit
        </button>
      </div>
    </>
  );
}

export default Conditions;
