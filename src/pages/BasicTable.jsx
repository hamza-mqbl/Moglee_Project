import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { TableFooter, TablePagination, MenuItem, Select } from "@mui/material";

export default function BasicTable() {
  const [orders, setOrders] = useState([]);
  console.log("🚀 ~ BasicTable ~ orders:", orders)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [backlogReasons, setBacklogReasons] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState({});

  // Fetch Orders
  useEffect(() => {
    fetch("http://localhost:5000/api/orders/get-dispatch-backlog")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Fetch Backlog Reasons
  useEffect(() => {
    fetch("http://localhost:5000/api/orders/get-backlog_reasons")
      .then((res) => res.json())
      .then((data) => {
        setBacklogReasons(data);
      })
      .catch((err) => console.error("Error fetching backlog reasons:", err));
  }, []);

  // Handle Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows Per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Store Selected Reason (ID & Description)
  const handleSelectReason = (orderId, reason) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [orderId]: {
        backlog_reason_id: reason.backlog_reason_id,
        backlog_reason_desc: reason.backlog_reason_desc,
      },
    }));
  };

  // Handle Update Button Click (Send Order ID, Reason ID & Description)
  const handleUpdateReason = async (orderId) => {
    try {
      const selectedReason = selectedReasons[orderId];
  
      if (!selectedReason || !selectedReason.backlog_reason_id || !selectedReason.backlog_reason_desc) {
        console.error("Invalid backlog reason data for order ID:", orderId);
        return;
      }
  
      const response = await fetch("http://localhost:5000/api/orders/update-backlog-reason", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          backlog_reason_id: selectedReason.backlog_reason_id,
          backlog_reason_desc: selectedReason.backlog_reason_desc,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update backlog reason: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ Successfully updated backlog reason:", data);
  
      // Optionally, update UI state to reflect the changes
  
    } catch (error) {
      console.error("❌ Error updating backlog reason:", error);
    }
  };
  

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: "auto" }}>
      <Table sx={{ minWidth: 750 }} aria-label="orders table">
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            {[
              "Store Name",
              "Created At",
              "Product Name",
              "Total Amount",
              "Status",
              "Backlog Reason",
              "Action",
            ].map((header, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: "bold" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {orders
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((order, index) => (
              <TableRow key={index} hover>
                <TableCell align="center">{order.store_name}</TableCell>
                <TableCell align="center">{order.created_at}</TableCell>
                <TableCell align="center">{order.product_name}</TableCell>
                <TableCell align="center">
                  {order.product_final_price}
                </TableCell>
                <TableCell align="center">{order.status || "null"}</TableCell>
                <TableCell align="center">
                  <Select
                    value={
                      selectedReasons[order.order_id]?.backlog_reason_id || ""
                    }
                    onChange={(e) => {
                      const selectedReason = backlogReasons.find(
                        (r) => r.backlog_reason_id === e.target.value
                      );
                      handleSelectReason(order.order_id, selectedReason);
                    }}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="" disabled>
                      Select a reason
                    </MenuItem>
                    {backlogReasons.map((reason) => (
                      <MenuItem
                        key={reason.backlog_reason_id}
                        value={reason.backlog_reason_id}
                      >
                        {reason.backlog_reason_desc}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleUpdateReason(order.order_id)}
                    disabled={!selectedReasons[order.order_id]}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
