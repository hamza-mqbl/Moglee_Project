import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { MdOutlineCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserProfile = ({ user }) => {
  const { currentColor } = useStateContext();

  return (
    <div className="nav-item right-1 top-16 absolute bg-white dark:bg-[#42464D] p-8 rounded-lg md:w-96">
      <div className="justify-between flex items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={user?.avatar.url}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl text-gray-200">{user?.name}</p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            Administrator
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 boredr-b-1 border-color p-4 hover:bg-light-gray cursor-pointer dark:hover:bg-[#42464D"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className="text-xl rounded-lg p-3 hover:bg-ligth-gray"
            >
              {item.icon}
            </button>

            <Link to="/profile">
              <div>
                <p className="font-semibold dark:text-gray-200">{item.title}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>
  );
};

export default UserProfile;
