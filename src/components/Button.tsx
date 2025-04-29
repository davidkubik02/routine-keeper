import React from "react";

function Button({
  clickHandle,
  value,
  type,
}: {
  clickHandle?: (e: React.MouseEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
}) {
  return <input type={type} onClick={clickHandle} className="form-submit" value={value} />;
}

export default Button;
