import React, { useState } from "react";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { useStateContext } from "../../contexts/ContextProvider";
import config from "../../server";
const PasswordComponent = () => {
  console.log(config.server);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentColor } = useStateContext();

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      // alert("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    console.log(config.server);

    try {
      // Replace with your actual API endpoint
      const response = await axios.put(
        `${config.server}api/user/update-user-password`,
        {
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // alert("Password updated successfully");
      } else {
        // alert("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      // alert("Failed to update password: " + error.message);
    } finally {
      setIsSubmitting(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Card>
        <CardHeader
          title={<Typography variant="h5">Change Password</Typography>}
        />
        <CardContent>
          <form onSubmit={passwordChangeHandler}>
            <TextField
              label="Current Password"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: currentColor,
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "8px",
                padding: "10px 20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: `${currentColor}CC`, // Slightly transparent for hover
                },
                marginTop: "20px",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordComponent;
