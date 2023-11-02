import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { userStorage } from "../utils/localStorage";
import { UserType } from "../models/auth";
import {
  CreateUpdateUserFields,
  useCreateUpdateUserForm,
} from "../hooks/useCreateUpdateUser";
import * as API from "../api/api";
import { StatusCode } from "../constants/errorConstants";
import ToastWarning from "./ToastWarning";
import { useRouter } from "next/navigation";
import { routes } from "../constants/routesConstants";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import Image from "next/image";

interface Props {
  defaultValues?: UserType & { isActiveUser?: boolean };
  profileSettingsForm: boolean;
  setProfileSettingsForm: (showAddAuctions: boolean) => void;
}

const ProfileSettingsForm: FC<Props> = ({
  profileSettingsForm,
  setProfileSettingsForm,
  defaultValues,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [apiError, setApiError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isPasswordChangeForm, setIsPasswordChangeForm] = useState(false);
  const [isProfilePictureChangeForm, setIsProfilePictureChangeForm] =
    useState(false);
  const [toggleHidden, setToggleHidden] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleToggleHidden = () => {
    setToggleHidden(!toggleHidden);
  };

  const router = useRouter();

  const { handleSubmit, errors, control } = useCreateUpdateUserForm({
    defaultValues,
  });

  //FIXME form submission not working

  const onSubmit = handleSubmit(async (data: CreateUpdateUserFields) => {
    await handleUpdate(data);
    console.log("submitted data: ", data);
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await userStorage.getUser();
        setUser(user);
        setFormData({
          first_name: user?.user.first_name,
          last_name: user?.user.last_name,
          email: user?.user.email,
        });
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    };

    getUser();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files.length > 0) {
      const myfile = target.files[0];
      setFile(myfile);
      console.log("myfile:", myfile);
      // set image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(myfile);
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

  const handleUpdate = async (data: CreateUpdateUserFields) => {
    const response = await API.updateUser(data, defaultValues?.id as string);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      router.push(`${routes.DASHBOARD_PREFIX}`);
    }
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {};

  return (
    <div>
      <div className="backdrop-blur-sm bg-dark-gray bg-opacity-10 absolute top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center">
        <div className="mb-4 bg-white flex flex-col p-6 text-md gap-4 rounded-3xl">
          {profileSettingsForm && (
            <>
              {isPasswordChangeForm && (
                <h1 className="font-bold text-2xl mb-4">Change password</h1>
              )}
              {isProfilePictureChangeForm && (
                <h1 className="font-bold text-2xl mb-4">
                  Change profile picture
                </h1>
              )}
              {!isPasswordChangeForm && !isProfilePictureChangeForm && (
                <h1 className="font-bold text-2xl mb-4">Profile settings</h1>
              )}
            </>
          )}
          <form onSubmit={onSubmit} className="flex flex-col gap-2 w-[500px]">
            {isPasswordChangeForm ? (
              <>
                <div className="mb-3 w-full">
                  <label htmlFor="password" className="font-light">
                    Current password:
                  </label>
                  <div className="relative">
                    <input
                      type={toggleHidden ? "password" : "text"}
                      aria-label="Current Password"
                      aria-describedby="current password"
                      className="border w-full font-light py-2 px-4 rounded-2xl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHidden}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 w-full">
                  <label htmlFor="password" className="font-light">
                    New password:
                  </label>
                  <div className="relative">
                    <input
                      type={toggleHidden ? "password" : "text"}
                      aria-label="New Password"
                      aria-describedby="new password"
                      className="border w-full font-light py-2 px-4 rounded-2xl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHidden}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 w-full">
                  <label htmlFor="password" className="font-light">
                    Repeat new password:
                  </label>
                  <div className="relative">
                    <input
                      type={toggleHidden ? "password" : "text"}
                      aria-label="Repeat new password"
                      aria-describedby="repeat new password"
                      className="border w-full font-light py-2 px-4 rounded-2xl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHidden}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : isProfilePictureChangeForm ? (
              <>
                <div className="rounded-2xl flex flex-col justify-center items-center relative gap-4">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Selected Image"
                        width={50}
                        height={50}
                        className="object-cover rounded-full w-16 h-16"
                      />
                      {imagePreview && (
                        <div
                          className="bg-white rounded-md top-5 right-5 absolute px-2 py-1"
                          onClick={() => {
                            setImagePreview(null);
                            setFile(null);
                          }}
                        ></div>
                      )}
                    </>
                  ) : (
                    <div className="object-cover rounded-full w-16 h-16 bg-gray-200"></div>
                  )}
                  <label htmlFor="image" className="border-2 border-gray-500 px-4 py-2 rounded-2xl hover:cursor-pointer">
                    Upload new picture
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <div className="flex flex-col">
                    <label id="first_name">First name</label>
                    <input
                      defaultValue={formData.first_name}
                      onChange={handleInputChange}
                      name="first_name"
                      type="text"
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label id="last_name">Last name</label>
                    <input
                      defaultValue={formData.last_name}
                      onChange={handleInputChange}
                      name="last_name"
                      type="text"
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <label id="email">Email</label>
                <input
                  defaultValue={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  type="email"
                  className="rounded-2xl"
                />
                <div
                  onClick={() => setIsPasswordChangeForm(true)}
                  className="hover:cursor-pointer"
                >
                  Change password
                </div>
                <div
                  onClick={() => setIsProfilePictureChangeForm(true)}
                  className="hover:cursor-pointer"
                >
                  Change profile picture
                </div>
              </>
            )}
            <div className="flex gap-3 justify-end mt-5">
              {isPasswordChangeForm || isProfilePictureChangeForm ? (
                <button
                  onClick={() => {
                    setIsPasswordChangeForm(false);
                    setIsProfilePictureChangeForm(false);
                  }}
                  className="px-3 py-2 rounded-2xl bg-gray-blue"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setProfileSettingsForm(false)}
                  className="px-3 py-2 rounded-2xl bg-gray-blue"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastWarning errorMessage={apiError} showErrorMessage={showError} />
    </div>
  );
};

export default ProfileSettingsForm;
