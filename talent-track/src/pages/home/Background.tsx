// src/components/Background.tsx
import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const Background = styled(Box)({
  background: "linear-gradient(135deg, #1e3c72 30%, #2a5298 90%)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem 0",
  color: "white",
});

interface Props {
  children: React.ReactNode;
}

const BackgroundComponent: React.FC<Props> = ({ children }) => {
  return <Background>{children}</Background>;
};

export default BackgroundComponent;
