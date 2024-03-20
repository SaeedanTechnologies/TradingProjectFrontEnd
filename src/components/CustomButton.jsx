import React from "react";
import { Button, theme } from "antd";

const CustomButton = ({ className, style, Text, onClickHandler, icon }) => {
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
        backgroundColor: colorPrimary,
        border: `1px solid ${colorPrimary}`,
        outline: "none",
        ...style,
      }}
      onClick={onClickHandler}
    >
      {" "}
      {icon && icon} {Text}
    </Button>
  );
};

export default CustomButton;
