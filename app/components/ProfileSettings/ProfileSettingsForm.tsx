import React, {
  ChangeEvent,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as API from "../../api/api";
import { StatusCode } from "../../constants/errorConstants";
import ToastWarning from "../ToastWarning";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, set } from "react-hook-form";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import { userStorage } from "../../stores/userStorage";
import { UpdateUserFields, useUpdateUserForm } from "../../hooks/useUpdateUser";
import UpdatePasswordForm from "./UpdatePasswordForm";

interface Props {
  profileSettingsForm: boolean;
  setProfileSettingsForm: (showAddAuctions: boolean) => void;
}

const ProfileSettingsForm: FC<Props> = ({
  profileSettingsForm,
  setProfileSettingsForm,
}) => {
  const [apiError, setApiError] = useState("");
  const [isPasswordChangeForm, setIsPasswordChangeForm] = useState(false);
  const [isProfilePictureChangeForm, setIsProfilePictureChangeForm] =
    useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useMemo(() => userStorage.getUser(), []);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const { handleSubmit, control } = useUpdateUserForm({
    defaultValues: user?.user,
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target.files && target.files.length > 0) {
      const myfile = target.files[0];
      setFile(myfile);
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
      const response = await API.uploadAvatar(
        formData,
        user?.user.id as string
      );
    }
  };

  const toggleForm = () => {
    setIsPasswordChangeForm(false);
    setIsProfilePictureChangeForm(false);
  };

  useEffect(() => {
    // When the component is mounted, add a rule to the body to hide the scrollbar
    document.body.style.overflow = "hidden";

    // When the component is unmounted, remove the rule from the body to show the scrollbar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleUpdate = async (data) => {
    // Exclude avatar from data so it prevents calling API.updateUser
    const { avatar, ...rest } = data;

    const response = await API.updateUser(rest, user?.user.id as string);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
    } else {
      const newUserData = {
        ...user,
        user: {
          ...response.data,
        },
      };
      userStorage.setUser(newUserData);
      setProfileSettingsForm(false);
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

          {isPasswordChangeForm ? (
            <UpdatePasswordForm toggleForm={toggleForm} />
          ) : isProfilePictureChangeForm ? (
            <>
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-2 w-[500px]">
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
                        }}></div>
                    </>
                  ) : user?.user.avatar ? (
                    <Image
                      alt="avatar"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${user?.user.avatar}`}
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
                    }}>
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
                <div className="flex gap-3 justify-end mt-5">
                  <button
                    onClick={toggleForm}
                    type="button"
                    className="px-3 py-2 rounded-2xl bg-gray-blue">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow"
                    onClick={toggleForm}>
                    Save changes
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-2 w-[500px]">
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
                  className="hover:cursor-pointer w-fit">
                  Change password
                </div>
                <div
                  onClick={() => setIsProfilePictureChangeForm(true)}
                  className="hover:cursor-pointer w-fit">
                  Change profile picture
                </div>
                <div className="flex gap-3 justify-end mt-5">
                  <button
                    onClick={() => setProfileSettingsForm(false)}
                    type="button"
                    className="px-3 py-2 rounded-2xl bg-gray-blue">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow"
                    onClick={toggleForm}>
                    Save changes
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      {apiError && <ToastWarning errorMessage={apiError} />}
    </div>
  );
};

export default ProfileSettingsForm;
