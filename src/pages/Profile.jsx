import React from "react";
import ProfileComponent from "../components/ProfileComponent.jsx";
import { Header } from "../components";

const Profile = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 pb-4 md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <Header category="Page" title="Profile" />

      <ProfileComponent />
    </div>
  );
};

export default Profile;
