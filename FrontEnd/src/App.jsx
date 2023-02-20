import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Home from "./Pages/Home"
import Login from "./Pages/Login/Login";
import Dashboard from './Pages/DashBoard'
import Register from "./Pages/Register/Register";
import PublicLayout from './layout/PublicLayout'
import PrivateLayout from './layout/PrivateLayout'
import { Store } from "./store/store";


const App = () => {
  const [login, setLogin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setLogin(true)
  }, [])

  return (
    <Store.Provider value={{ login, setLogin }}>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Store.Provider>
  );
}

export default App