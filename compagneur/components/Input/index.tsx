import React from "react";

type Props = {
  name: string;
  defaultValue?: string;
};

const Input = (props: Props) => {
  return (
    <input
      defaultValue={props.defaultValue}
      name={props.name}
      className={"mt-2 px-4 py-2 bg-white rounded-xl border-gray-200 border "}
    />
  );
};

export default Input;
