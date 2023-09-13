import React, { createElement } from "react";
import "./style.css";

type Variants = "h1" | "p";

interface IProps {
  variant: Variants;
  children: React.ReactNode;
  size?: number;
  color?: string;
}

const Typography: React.FC<IProps> = ({
  children,
  variant,
  size,
  color,
  ...props
}) => {
  return createElement(
    variant,
    {
      className: `typography typography__${variant}`,
      style: {
        fontSize: size,
        color,
        ...props,
      },
    },
    children
  );
};

export default Typography;
