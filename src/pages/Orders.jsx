import React from "react";
import BasicTable from "./BasicTable";
import { Header } from "../components";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

const Orders = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 pb-4 md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <Header category="Page" title="Backlog Table" />
      <ErrorBoundary>
        <BasicTable />
      </ErrorBoundary>
    </div>
  );
};

export default Orders;
