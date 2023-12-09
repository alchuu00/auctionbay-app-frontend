import React, { useState, FC, useEffect, useRef } from "react";
import CogIcon from "@heroicons/react/outline/CogIcon";
import * as API from "../../../src/api/api";
import ProfileSettingsForm from "./ProfileSettingsForm";
import { useRouter } from "next/navigation";
import { StatusCode } from "@/src/constants/errorConstants";
import authStore from "@/src/stores/authStore";
import { routes } from "@/src/constants/routesConstants";

interface Props {
  showProfileSettings: boolean;
  setShowProfileSettings: (showProfileSettings: boolean) => void;
}

const ProfileSettingsLogout: FC<Props> = ({
  showProfileSettings,
  setShowProfileSettings,
}) => {
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
      router.push(`${routes.HOME}`);
      authStore.signout();
    }
  };

  useEffect(() => {
    // When the component is mounted, add a rule to the body to hide the scrollbar
    document.body.style.overflow = "hidden";

    // When the component is unmounted, remove the rule from the body to show the scrollbar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      onClick={(event) => {
        // Closes profile settings when user clicks outside of the component
        if (event.target === event.currentTarget) {
          setShowProfileSettings(false);
        }
      }}
      className="backdrop-blur-sm bg-dark-gray bg-opacity-10 absolute top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center h-full">
      <div className="mb-4 bg-white flex flex-col justify-center items-center p-10 text-md gap-4 rounded-3xl">
        <div
          onClick={handleProfileSettingsForm}
          className="flex justify-center items-center gap-2 hover:cursor-pointer hover:drop-shadow-md">
          <CogIcon className="h-5 w-5" />
          Profile settings
        </div>
        <button
          onClick={signout}
          className="px-10 py-2 border border-dark-gray rounded-full hover:drop-shadow-md">
          Log Out
        </button>
      </div>
      {profileSettingsForm && (
        <ProfileSettingsForm
          profileSettingsForm={profileSettingsForm}
          setProfileSettingsForm={setProfileSettingsForm}
        />
      )}
    </div>
  );
};

export default ProfileSettingsLogout;
