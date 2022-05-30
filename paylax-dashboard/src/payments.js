import React from "react";
import styled from "styled-components";
import Dashboard from "./Component/Dashboard";
import Sidebar from "./Component/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function Dapp() {
  return (
    <Div>
      <Sidebar />
      <Dashboard />

    </Div>
  );
}

const Div = styled.div`
  position: relative;
`;
