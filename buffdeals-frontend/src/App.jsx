import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header'
import Form from './components/Form'


export default function App(){
  return(
    <Router>
    <div className="flex flex-col items-center justify-center">
      <Header />
      <Routes>
        <Route path="/" element={<Form />} />
      </Routes>
    </div>
    </Router>
  )
}

