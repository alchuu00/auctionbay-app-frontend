import EyeIcon from "@heroicons/react/outline/EyeIcon";
import React, { ChangeEvent, FC } from "react";
import { Controller } from "react-hook-form";

interface Props {
    control: any;
    toggleHidden: boolean;
    handleToggleHidden: () => void;
      onSubmit: (e: ChangeEvent<HTMLFormElement>) => void;
}

const ChangePasswordForm: FC<Props> = ({onSubmit, control, toggleHidden, handleToggleHidden}) => {
  return (
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
                type={toggleHidden ? "password" : "text"}
                aria-label="Repeat Password"
                aria-describedby="repeat password"
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
        )}
      />
    </form>
  );
};

export default ChangePasswordForm;
