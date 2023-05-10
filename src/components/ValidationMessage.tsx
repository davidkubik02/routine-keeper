import React from "react";

function ValidationMessage({ message }: { message: string }) {
  return <p className="validation-message">{message}</p>;
}

export default ValidationMessage;
