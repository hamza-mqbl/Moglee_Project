import axios from "axios";
import config from "../../server.js";

// Load user

export const loadUser = () => async (dispatch) => {
  console.log("load user is hitting")
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${config.server}api/user/getuser`, {
      withCredentials: true,
    });
    console.log("🚀 ~ loadUser ~ data:", data);

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    console.log("🚀 ~ loadUser ~ error:", error)
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  console.log("config.server,,,,,,,,,,,,,,", config.server);
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${config.server}/shop/getSeller`, {
      withCredentials: true,
    });
    console.log("🚀 ~ loadSeller ~ data:", data);
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// update user informaiton

export const updateUserInformation =
  (email, phoneNumber, name, password) => async (dispatch, action) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${config.server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };

// update user address
export const updateUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });
      const { data } = await axios.put(
        `${config.server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );
      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "user address updated successfully!",
          user: data.user,
        },
      });
    } catch (error) {
      console.log("🚀 ~ error:", error);
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };
// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });
    const { data } = await axios.delete(
      `${config.server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );
    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted Successfully",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};
