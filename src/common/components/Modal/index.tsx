import React from "react";
import { Typography } from "..";
import "./style.css";

interface IProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
}

const Modal: React.FC<IProps> = ({
  title,
  onClose,
  isVisible,
  subtitle,
  children,
}) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <div className={`modal ${isVisible ? "visible" : ""}`}>
      <div className="modal__back" onClick={closeModal}></div>
      <div className="modal__body" onClick={(e) => e.stopPropagation()}>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="p">{subtitle}</Typography>
        {children}
      </div>
    </div>
  );
};

export default Modal;
