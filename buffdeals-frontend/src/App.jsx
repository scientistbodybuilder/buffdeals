import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import Header from './components/Header'
import Form from './components/Form'
import Catalog from './components/Catalog'
import Login from './components/Login'
import Signup from './components/Signup'


export default function App(){
  return(
    <MantineProvider>
      <Router>
          <div className="flex flex-col items-center justify-center">
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/" element={<Form />} />
              <Route path="/catalog" element={<Catalog />} />
            </Routes>
          </div>
      </Router>
    </MantineProvider> 
  )
}

