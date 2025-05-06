import React from "react";
import Header from './components/Header'
import Form from './components/Form'


export default function App(){
  return(
    <div className="flex flex-col items-center justify-center">
      <Header />
      <Form />
    </div>
  )
}

