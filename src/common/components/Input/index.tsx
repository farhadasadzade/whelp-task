import React from "react";
import "./style.css";

type InputType = "text" | "tel" | "email";

interface InputProps {
  type: InputType;
  placeholder?: string;
  label?: string;
  id: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isNotValid?: boolean;
  register?: any;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  placeholder,
  label,
  onChange,
  isNotValid,
  register,
}) => {
  return (
    <>
      <label htmlFor={id}>
        {label}
        <input
          onChange={onChange}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          className={`${isNotValid ? "not-valid" : ""}`}
          {...register?.(id)}
        />
      </label>
    </>
  );
};

export default Input;
