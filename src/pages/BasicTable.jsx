import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableFooter,
  TablePagination,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import config from "../server";

export default function BasicTable() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [backlogReasons, setBacklogReasons] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState({});
  const [storeFilter, setStoreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fulfillStatusFilter, setFulfillSStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [uniqueStores, setUniqueStores] = useState([]);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [uniqueFulfillStatuses, setUniqueFulfillStatuses] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [backlogComments, setBacklogComments] = useState({});
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${config.server}/api/orders/get-dispatch-backlog`
        );
        const data = await response.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);

        const stores = [
          ...new Set(sortedData.map((order) => order.store_name)),
        ];
        setUniqueStores(stores);

        const products = [
          ...new Set(sortedData.map((order) => order.product_name)),
        ];
        setUniqueProducts(products);

        const statuses = [...new Set(sortedData.map((order) => order.status))];
        setUniqueStatuses(statuses);

        const fulfillStatuses = [
          ...new Set(sortedData.map((order) => order.fulfillment_status)),
        ];
        setUniqueFulfillStatuses(fulfillStatuses);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchBacklogReasons = async () => {
      try {
        const response = await fetch(
          `${config.server}/api/orders/get-backlog_reasons`
        );
        const data = await response.json();
        setBacklogReasons(data);
      } catch (err) {
        console.error("Error fetching backlog reasons:", err);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchOrders(), fetchBacklogReasons()]);
      setLoading(false); // Set loading to false after both fetches are done
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateReason = async (orderId) => {
    try {
      const selectedReason = selectedReasons[orderId];
      const comment = backlogComments[orderId] || "";

      if (
        !selectedReason ||
        !selectedReason.backlog_reason_id ||
        !selectedReason.backlog_reason_desc
      ) {
        setSnackbarMessage("Please select a valid backlog reason.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      const response = await fetch(
        `${config.server}/api/orders/update-backlog-reason`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            backlog_reason_id: selectedReason.backlog_reason_id,
            backlog_reason_desc: selectedReason.backlog_reason_desc,
            backlog_comment: comment,
          }),
        }
      );

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      setSelectedReasons((prev) => {
        const updatedReasons = { ...prev };
        delete updatedReasons[orderId];
        return updatedReasons;
      });

      setBacklogComments((prev) => {
        const updatedComments = { ...prev };
        delete updatedComments[orderId];
        return updatedComments;
      });

      setSnackbarMessage("Backlog reason updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error updating backlog reason.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (!storeFilter || order.store_name === storeFilter) &&
      (!statusFilter || order.status === statusFilter) &&
      (!dateFilter || order.created_at.split("T")[0] === dateFilter) &&
      (!productFilter || order.product_name === productFilter) &&
      (!fulfillStatusFilter || order.fulfillment_status === fulfillStatusFilter)
    );
  });

  if (loading) {
    return (
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      mt={-10} // Adjust this value as needed
    >
      <CircularProgress size={50} />
    </Box>
    
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3}}>
      <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
        {/* Store Name Filter */}
        <Select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Stores</MenuItem>
          {uniqueStores.map((store, index) => (
            <MenuItem key={index} value={store}>
              {store}
            </MenuItem>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {uniqueStatuses.map((status, index) => (
            <MenuItem key={index} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>

        {/* Fulfillment Status Filter */}
        <Select
          value={fulfillStatusFilter}
          onChange={(e) => setFulfillSStatusFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Fulfillment Status</MenuItem>
          {uniqueFulfillStatuses.map((fulfillstatus, index) => (
            <MenuItem key={index} value={fulfillstatus}>
              {fulfillstatus}
            </MenuItem>
          ))}
        </Select>

        {/* Product Name Filter */}
        <Select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Products</MenuItem>
          {uniqueProducts.map((product, index) => (
            <MenuItem key={index} value={product}>
              {product}
            </MenuItem>
          ))}
        </Select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <Table
        sx={{ minWidth: 450, whiteSpace: "nowrap" }}
        aria-label="orders table"
      >
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            {[
              "Store Name",
              "Created At",
              "Product Name",
              "Total Amount",
              "Status",
              "Fulfillment Status",
              "Backlog Reason",
              "Backlog Comments",
              "Action",
            ].map((header, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredOrders
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((order, index) => (
              <TableRow key={index} hover>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  {order.store_name}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  {order.created_at.split("T")[0]}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "wrap" }}>
                  {order.product_name}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                {Number(order.product_final_price).toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  {order.status || "null"}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  {order.fulfillment_status || "null"}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  <Select
                    value={
                      selectedReasons[order.order_id]?.backlog_reason_id || ""
                    }
                    onChange={(e) => {
                      const selectedReason = backlogReasons.find(
                        (r) => r.backlog_reason_id === e.target.value
                      );
                      setSelectedReasons((prev) => ({
                        ...prev,
                        [order.order_id]: {
                          backlog_reason_id: selectedReason.backlog_reason_id,
                          backlog_reason_desc:
                            selectedReason.backlog_reason_desc,
                        },
                      }));
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
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <input
                    className="py-4 bg-white border-2 border-gray-200 focus:border-blue-200 outline-none text-gray-700 text-lg font-medium"
                    type="text"
                    value={backlogComments[order.order_id] || ""}
                    onChange={(e) => {
                      setBacklogComments((prev) => ({
                        ...prev,
                        [order.order_id]: e.target.value,
                      }));
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
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
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
}
