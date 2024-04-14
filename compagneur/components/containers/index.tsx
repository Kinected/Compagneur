import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  status?: boolean;
};

const Container = (props: Props) => {
  return (
    <div
      className={
        "w-full flex-col bg-white p-4 rounded-lg shadow-md flex gap-4 justify-between"
      }
    >
      <div className={"flex justify-between"}>
        <span className={"text-xl font-medium text-black"}>{props.title}</span>
        {props.status !== undefined && (
          <span className={"text-md text-black"}>
            {props.status ? "Connecté" : "Non associé"}
          </span>
        )}
      </div>
      <div className={"flex flex-col gap-4"}>{props.children}</div>
    </div>
  );
};

export default Container;
