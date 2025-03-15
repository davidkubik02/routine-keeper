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
    return (finishedTaskAmount * 100) / taskAmount || 0;
  };
  return (
    <footer className="home-footer">
      Progress:
      <div>
        <div className="progress-fraction">{`${finishedTaskAmount}/${taskAmount}`}</div>
        <div className="progress-percent">{`${finishedPercentige()}%`}</div>
      </div>
    </footer>
  );
}

export default Footer;
