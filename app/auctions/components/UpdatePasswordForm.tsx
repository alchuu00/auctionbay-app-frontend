"use client";

import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  UpdatePasswordFields,
  usePasswordForm,
} from "../../../src/hooks/useFormUpdatePassword";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/outline/EyeOffIcon";
import * as API from "../../../src/api/api";
import { StatusCode } from "@/src/constants/errorConstants";
import { userStorage } from "@/src/stores/userStorage";
import { toast } from "react-toastify";

interface Props {
  toggleForm: () => void;
}

const UpdatePasswordForm = ({ toggleForm }: Props) => {
  const [toggleHiddenCurrent, setToggleHiddenCurrent] = useState(true);
  const [toggleHiddenNew, setToggleHiddenNew] = useState(true);
  const [toggleHiddenConfirm, setToggleHiddenConfirm] = useState(true);

  const user = userStorage.getUser();

  const handleToggleHiddenCurrent = () => {
    setToggleHiddenCurrent(!toggleHiddenCurrent);
  };

  const handleToggleHiddenNew = () => {
    setToggleHiddenNew(!toggleHiddenNew);
  };

  const handleToggleHiddenConfirm = () => {
    setToggleHiddenConfirm(!toggleHiddenConfirm);
  };

  const { handleSubmit, errors, control } = usePasswordForm();

  useEffect(() => {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }, [errors]);

  const handleUpdatePassword = async (data: UpdatePasswordFields) => {
    const response = await API.updateUserPassword(
      { password: data.new_password, confirm_password: data.confirm_password },
      user?.id as string
    );
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      toast.error(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      toast.error(response.data.message);
    } else {
      toggleForm();
    }
  };

  const onSubmit = handleSubmit(async (data: UpdatePasswordFields) => {
    await handleUpdatePassword(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 lg:w-[500px]">
      <Controller
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
                type={toggleHiddenCurrent ? "password" : "text"}
                aria-label="Current Password"
                aria-describedby="current password"
                className="border-2 border-gray-blue w-full font-light py-2 px-4 rounded-2xl"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {toggleHiddenCurrent ? (
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenCurrent}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenCurrent}
                      />
                    )}
              </div>
            </div>
          </div>
        )}
      />
      <Controller
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
                type={toggleHiddenNew ? "password" : "text"}
                aria-label="New Password"
                aria-describedby="new password"
                className="border-2 border-gray-blue w-full font-light py-2 px-4 rounded-2xl"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {toggleHiddenNew ? (
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenNew}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenNew}
                      />
                    )}
              </div>
            </div>
          </div>
        )}
      />
      <Controller
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
                type={toggleHiddenConfirm ? "password" : "text"}
                aria-label="Repeat Password"
                aria-describedby="repeat password"
                className="border-2 border-gray-blue w-full font-light py-2 px-4 rounded-2xl"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {toggleHiddenConfirm ? (
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenConfirm}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenConfirm}
                      />
                    )}
              </div>
            </div>
          </div>
        )}
      />
      <div className="flex gap-3 justify-end mt-5">
        <button
          onClick={() => toggleForm()}
          type="button"
          className="px-3 py-2 rounded-2xl bg-gray-blue hover:drop-shadow-md">
          Cancel
        </button>
        <button
          type="submit"
          className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow hover:drop-shadow-md">
          Save changes
        </button>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
