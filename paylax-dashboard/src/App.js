import logo from './logo.svg';
import './App.css';
import Header from './Component/Homepage/header'
import relaxxi from './relaxx.png'
import checkout from './checkout.png'
import collect from './collect.png'
import retention from './retention.png'
import userfriendly from './userfriendly.png'
import { motion } from 'framer-motion';
import './Component/Homepage/variant';
import GoogleButton from 'react-google-button';
import Homepage from './Homepage';
import Dapp from './DApp';
import Payments from './Payments';
import Transaction from './Transaction';
import Request from './Request';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { emoji, emojii, emojiii, emojiiii, emojiwrap, fadeInUp, mobilewrap } from './Component/Homepage/variant';
function App() {
  document.body.style.overflow = "hidden"
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<Homepage />} />
        <Route path="dashboard" element={<Dapp />} />
        <Route path="payments" element={<Payments />} />
        <Route path="transaction" element={<Transaction />} />
        <Route path="request" element={<Request />} />
        <Route path="*" element={<Homepage />} />
      </Route>
    </Routes>
  </BrowserRouter>

  );
}

export default App;
