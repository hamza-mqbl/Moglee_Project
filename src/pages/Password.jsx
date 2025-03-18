import React, { useState } from 'react'
import PasswordComponent from "../components/Password/PasswordComponent.jsx"
import Header from '../components/Header.jsx';

const Password = () => {
   return (
      <div className="m-2 md:m-10 mt-24 p-2 pb-4 md:p-10  md:rounded-3xl rounded-xl">
        {/* <Header category="Page" title="Password" /> */}
  
        <PasswordComponent />
      </div>
    );
}

export default Password