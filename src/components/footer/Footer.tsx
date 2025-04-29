import React from "react";
import "./footer.css";
import Button from "../Button";

function Footer({
  taskAmount,
  finishedTaskAmount,
  evaluationHandle,
  resetHandle,
}: {
  taskAmount: number;
  finishedTaskAmount: number;
  evaluationHandle: () => void;
  resetHandle: () => void;
}) {
  const finishedPercentige = (): number => {
    return +((finishedTaskAmount * 100) / taskAmount).toFixed(2) || 0;
  };
  const styleByCondition = (): { fontWeight: string; color: string } | undefined => {
    return finishedPercentige() === 100 ? { fontWeight: "bold", color: "green" } : undefined;
  };

  return (
    <footer className="home-footer">
      <Button type="button" value="Vyhodnotit" clickHandle={evaluationHandle} />
      <Button type="button" value="Resetovat" clickHandle={resetHandle} />
      <h3>Progress:</h3>
      <div className="progress-container">
        <div>{`${finishedTaskAmount}/${taskAmount}`}</div>
        <div style={styleByCondition()}>{`${finishedPercentige()}%`}</div>
      </div>
    </footer>
  );
}

export default Footer;
