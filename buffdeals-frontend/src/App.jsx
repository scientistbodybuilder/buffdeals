import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import supabase from "./supabaseClient";
import { MantineProvider } from '@mantine/core';
import Form from './components/Form'
import Catalog from './components/Catalog'
import Login from './components/Login'
import Signup from './components/Signup'
import PrivateRoute from "./components/PrivateRoute";
import { AuthContextProvider } from "./context/AuthContext";


export default function App(){ 
  return(
    <MantineProvider>
      <AuthContextProvider>
        <Router>
          <div className="flex flex-col items-center justify-center">
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              {/* <Route path="/" element={<Form />} /> */}
              <Route path="/" element={<Catalog />} />
            </Routes>
          </div>
        </Router>
      </AuthContextProvider>
    </MantineProvider> 
  )
}

