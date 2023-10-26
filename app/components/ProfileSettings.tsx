import React, { useState } from "react";
import CogIcon from "@heroicons/react/outline/CogIcon";
import { signout } from "../api/api";
import ProfileSettingsForm from "./ProfileSettingsForm";

const ProfileSettings = () => {
  const [profileSettingsForm, setProfileSettingsForm] =
    useState<boolean>(false);

  const handleProfileSettingsForm = () => {
    setProfileSettingsForm(true);
  };
  return (
    <div className="backdrop-blur-sm bg-dark-gray bg-opacity-10 absolute top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center">
      <div className="mb-4 bg-white flex flex-col justify-center items-center p-10 text-md gap-4 rounded-3xl">
        <div
          onClick={handleProfileSettingsForm}
          className="flex justify-center items-center gap-2"
        >
          <CogIcon className="h-5 w-5" />
          Profile settings
        </div>
        <div
          onClick={signout}
          className="px-10 py-2 border border-dark-gray rounded-full"
        >
          Log Out
        </div>
      </div>
      {profileSettingsForm && <ProfileSettingsForm />}
    </div>
  );
};

export default ProfileSettings;
