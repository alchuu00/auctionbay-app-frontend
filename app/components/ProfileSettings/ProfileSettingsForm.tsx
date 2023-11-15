import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import * as API from "../../api/api";
import { StatusCode } from "../../constants/errorConstants";
import ToastWarning from "../ToastWarning";
import { useRouter } from "next/navigation";
import { routes } from "../../constants/routesConstants";
import Image from "next/image";
import { Controller } from "react-hook-form";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import { userStorage } from "../../utils/userStorage";
import { UpdateUserFields, useUpdateUserForm } from "../../hooks/useUpdateUser";
import ChangePasswordForm from "./ChangePasswordForm";
import { UserType } from "@/app/models/auth";
import EyeIcon from "@heroicons/react/outline/EyeIcon";

interface Props {
  user: UserType;
  profileSettingsForm: boolean;
  setProfileSettingsForm: (showAddAuctions: boolean) => void;
}

// FIXME there is something wrong with email and new_password fields

const ProfileSettingsForm: FC<Props> = ({
  user,
  profileSettingsForm,
  setProfileSettingsForm,
}) => {
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  console.log("fetched user", user.data);

  const { handleSubmit, errors, control } = useUpdateUserForm({
    defaultValues: user.data,
  });

  console.log("errors", errors);

  // FIXME form submission not working
  // FIXME autofill password form data
  // FIXME avatar not uploading

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
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
  
      // create FormData
      const formData = new FormData();
      formData.append("avatar", myfile);
  
      // upload file to server
      const response = await API.uploadAvatar(formData, user.data.id as string);
      console.log("upload avatar response", response);
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

  const handleUpdate = async (data: UpdateUserFields) => {
    // Exclude avatar from data
    const { avatar, ...rest } = data;
  
    const response = await API.updateUser(rest, user.data.id as string);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      userStorage.setUser(response.data);
      router.push(`${routes.DASHBOARD_PREFIX}`);
    }
  };
  
  const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
    console.log("submitting data:", data);
    console.log("Calling handleUpdate...");
    try {
      await handleUpdate(data);
      console.log("handleUpdate called");
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
    console.log("Finished onSubmit");
  });

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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted");
              const formData = new FormData(e.target as HTMLFormElement);
              console.log("Form data:", Object.fromEntries(formData.entries()));
              onSubmit(e);
            }}
            className="flex flex-col gap-2 w-[500px]"
          >
            {isPasswordChangeForm ? (
              <><Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="mb-3 w-full">
                    <label htmlFor="current-password" className="font-light">
                      Current password:
                    </label>
                    <div className="relative">
                      <input
                        {...field}
                        type={toggleHidden ? "password" : "text"}
                        aria-label="Current Password"
                        aria-describedby="current password"
                        className="border w-full font-light py-2 px-4 rounded-2xl" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <EyeIcon
                          className="h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={handleToggleHidden} />
                      </div>
                    </div>
                  </div>
                )} /><Controller
                  name="new_password"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-3 w-full">
                      <label htmlFor="new-password" className="font-light">
                        New password:
                      </label>
                      <div className="relative">
                        <input
                          {...field}
                          type={toggleHidden ? "password" : "text"}
                          aria-label="New Password"
                          aria-describedby="new password"
                          className="border w-full font-light py-2 px-4 rounded-2xl" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <EyeIcon
                            className="h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={handleToggleHidden} />
                        </div>
                      </div>
                    </div>
                  )} /><Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-3 w-full">
                      <label htmlFor="repeat-password" className="font-light">
                        Repeat password:
                      </label>
                      <div className="relative">
                        <input
                          {...field}
                          type={toggleHidden ? "password" : "text"}
                          aria-label="Repeat Password"
                          aria-describedby="repeat password"
                          className="border w-full font-light py-2 px-4 rounded-2xl" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <EyeIcon
                            className="h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={handleToggleHidden} />
                        </div>
                      </div>
                    </div>
                  )} /></>
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
                      <div
                        className="bg-white rounded-md top-5 right-5 absolute px-2 py-1"
                        onClick={() => {
                          setImagePreview(null);
                          setFile(null);
                        }}
                      ></div>
                    </>
                  ) : user.data.avatar ? (
                    <Image
                      alt="avatar"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${user.data.avatar}`}
                      width={50}
                      height={50}
                      className="object-cover rounded-full w-16 h-16"
                    />
                  ) : (
                    <div className="p-5 bg-gray-blue rounded-full">
                      <UserCircleIcon className="h-5 w-5" />
                    </div>
                  )}

                  <button
                    type="button"
                    className="border-2 border-gray-500 px-4 py-2 rounded-2xl hover:cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      if (fileInputRef.current !== null) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    Upload new picture
                  </button>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-3 w-full">
                        <label htmlFor="first_name" className="font-light">
                          First name
                        </label>
                        <input
                          {...field}
                          value={field.value === null ? "" : field.value}
                          type="text"
                          aria-label="First Name"
                          aria-describedby="first name"
                          className="border w-full font-light py-2 px-4 rounded-2xl"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-3 w-full">
                        <label htmlFor="last_name" className="font-light">
                          Last name
                        </label>
                        <input
                          {...field}
                          value={field.value === null ? "" : field.value}
                          type="text"
                          aria-label="Last Name"
                          aria-describedby="last name"
                          className="border w-full font-light py-2 px-4 rounded-2xl"
                        />
                      </div>
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-3 w-full">
                      <label htmlFor="email" className="font-light">
                        Email
                      </label>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="text"
                        aria-label="Email"
                        aria-describedby="email"
                        className="border w-full font-light py-2 px-4 rounded-2xl"
                      />
                    </div>
                  )}
                />
                <div
                  onClick={() => setIsPasswordChangeForm(true)}
                  className="hover:cursor-pointer w-fit"
                >
                  Change password
                </div>
                <div
                  onClick={() => setIsProfilePictureChangeForm(true)}
                  className="hover:cursor-pointer w-fit"
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
                  type="button"
                  className="px-3 py-2 rounded-2xl bg-gray-blue"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setProfileSettingsForm(false)}
                  className="px-3 py-2 rounded-2xl bg-gray-blue"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow"
                onClick={() => {
                  if (isProfilePictureChangeForm) {
                    setIsProfilePictureChangeForm(false);
                  } else if (isPasswordChangeForm) {
                    setIsPasswordChangeForm(false);
                  }
                }}
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
