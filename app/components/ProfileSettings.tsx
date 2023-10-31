import React, { useState } from "react";
import CogIcon from "@heroicons/react/outline/CogIcon";
import * as API from "../api/api";
import ProfileSettingsForm from "./ProfileSettingsForm";
import { StatusCode } from "../constants/errorConstants";
import authStore from "../stores/authStore";
import { useRouter } from "next/navigation";

const ProfileSettings = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [showError, setShowError] = useState(false);
  const [profileSettingsForm, setProfileSettingsForm] =
    useState<boolean>(false);

  const handleProfileSettingsForm = () => {
    setProfileSettingsForm(true);
  };

  const signout = async () => {
    const response = await API.signout();
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      authStore.signout();
      router.push("/");
    }
  };
  return (
    <div className="backdrop-blur-sm bg-dark-gray bg-opacity-10 absolute top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center">
      <div className="mb-4 bg-white flex flex-col justify-center items-center p-10 text-md gap-4 rounded-3xl">
        <div
          onClick={handleProfileSettingsForm}
          className="flex justify-center items-center gap-2 hover:cursor-pointer"
        >
          <CogIcon className="h-5 w-5" />
          Profile settings
        </div>
        <button
          onClick={signout}
          className="px-10 py-2 border border-dark-gray rounded-full"
        >
          Log Out
        </button>
      </div>
      {profileSettingsForm && <ProfileSettingsForm />}
    </div>
  );
};

export default ProfileSettings;
