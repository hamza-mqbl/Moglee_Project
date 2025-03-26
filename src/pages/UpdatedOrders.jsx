import React from "react";
import UpdatedBasicTable from "./UpdatedBasicTable.jsx";
import { Header } from "../components";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary.jsx";

const UpdatedOrders = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 pb-4 md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <Header category="Page" title="Backlog Table" />
      <ErrorBoundary>
        <UpdatedBasicTable />
      </ErrorBoundary>
    </div>
  );
};

export default UpdatedOrders;
