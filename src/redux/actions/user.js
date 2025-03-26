import axios from "axios";
import config from "../../server.js";

// Load user

export const loadUser = () => async (dispatch) => {
  console.log("load user is hitting");
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
      payload: data?.user,
    });
  } catch (error) {
    console.log("🚀 ~ loadUser ~ error:", error);
    dispatch({
      type: "LoadUserFail",
      payload: error?.response?.data?.message,
    });
  }
};

// update user informaiton

export const updateUserInformation =
  (email, name, password) => async (dispatch, action) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${config.server}api/user/update-user-info`,
        {
          email,
          password,
          name,
        },
        {
          withCredentials: true,
        }
      );
      console.log("🚀 ~ data.user----------line number 50:", data);

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
      console.log("🚀 ~ data:", data);
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
