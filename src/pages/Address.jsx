import React from "react";
import AddressComponent from "../components/Address/AddressComponent.jsx"
import { Header } from "../components";

const Address = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 pb-4 md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <Header category="Page" title="Address" />

      <AddressComponent />
    </div>
  );
};

export default Address;
