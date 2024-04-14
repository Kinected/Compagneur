import React from "react";

const Button = ({
  children,
  onClick,
  type,
}: {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  type?: "submit";
}) => (
  <button
    onClick={onClick}
    type={type}
    className={
      "p-4 py-2 w-fit bg-white rounded-xl border border-gray-200 text-xs font-light"
    }
  >
    {children}
  </button>
);

export default Button;
