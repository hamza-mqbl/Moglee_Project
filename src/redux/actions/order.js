import axios from "axios";
import config from "../../server.js";

// get all orders of a user

export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrderUserRequest",
    });
    const { data } = await axios.get(
      `${config.server}api/orders/get-updated-dispatch-backlog`
    );
    console.log("🚀 ~ getAllOrders ~ data:", data);

    dispatch({
      type: "getAllOrderUserSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrderUserFail",
      payload: error.response.data.message,
    });
  }
};
export const getDispatchBacklogReasons = () => async (dispatch) => {
  try {
    dispatch({
      type: "getDispatchBacklogReasonsRequest",
    });
    const { data } = await axios.get(
      `${config.server}api/orders/get-backlog_reasons`
    );
    console.log("🚀 ~ getAllOrders ~ data:", data);

    dispatch({
      type: "getDispatchBacklogReasonsSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "getDispatchBacklogReasonsFail",
      payload: error.response.data.message,
    });
  }
};