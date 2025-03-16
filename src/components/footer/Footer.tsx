import React from "react";
import "./footer.css";

function Footer({
  taskAmount,
  finishedTaskAmount,
}: {
  taskAmount: number;
  finishedTaskAmount: number;
}) {
  const finishedPercentige = (): number => {
    return +((finishedTaskAmount * 100) / taskAmount).toFixed(2) || 0;
  };
  const styleByCondition = ():
    | { fontWeight: string; color: string }
    | undefined => {
    return finishedPercentige() === 100
      ? { fontWeight: "bold", color: "green" }
      : undefined;
  };
  return (
    <footer className="home-footer">
      <h3>Progress:</h3>
      <div className="progress-container">
        <div>{`${finishedTaskAmount}/${taskAmount}`}</div>
        <div style={styleByCondition()}>{`${finishedPercentige()}%`}</div>
      </div>
    </footer>
  );
}

export default Footer;
