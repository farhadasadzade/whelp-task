import React from "react";
import "./style.css";

type Type = "primary" | "secondary" | "icon";

interface IProps {
  children: React.ReactNode;
  type: Type;
  onClick?: () => void;
  htmlType?: "submit" | "button" | "reset";
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Button: React.FC<IProps> = ({
  children,
  type,
  onClick,
  htmlType,
  style,
  disabled,
}) => {
  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={type}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
