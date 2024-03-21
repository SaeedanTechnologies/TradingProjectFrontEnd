import React from "react";
import { Button, theme } from "antd";

const CustomButton = ({ className, style, Text, onClickHandler, icon, disabled, backgroundColor, borderColor }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  return (
    <Button
      type="primary"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor ? backgroundColor : colorPrimary,
        border: `1px solid ${borderColor ? borderColor : colorPrimary}`,
        outline: "none",
        ...style,
      }}
      onClick={onClickHandler}
      disabled={disabled}
    >
      {" "}
      {icon && icon} {Text}
    </Button>
  );
};

export default CustomButton;
