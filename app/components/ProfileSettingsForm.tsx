import React, { useEffect, useState } from "react";
import { userStorage } from "../utils/localStorage";
import { UserType } from "../models/auth";

const ProfileSettingsForm = () => {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const getUser = async () => {
          try {
            const user = await userStorage.getUser();
            setUser(user);
          } catch (error) {
            console.error("Error retrieving user:", error);
          }
        };
    
        getUser();
      }, []);
  return (
    <div>
      <div className="backdrop-blur-sm bg-dark-gray bg-opacity-10 absolute top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center">
        <div className="mb-4 bg-white flex flex-col p-10 text-md gap-4 rounded-3xl">
          <h1 className="font-bold text-2xl mb-4">Profile settings</h1>
          <form className="flex flex-col gap-2">
            <div className="flex gap-3">
              <div className="flex flex-col">
                <label id="first_name">First name</label>
                <input value={user?.first_name} name="first_name" type="text" className="rounded-2xl"/>
              </div>
              <div className="flex flex-col">
                <label id="last_name">Last name</label>
                <input value={user?.last_name} name="last_name" type="text" className="rounded-2xl"/>
              </div>
            </div>
            <label id="email">Email</label>
            <input value={user?.email} name="email" type="email" className="rounded-2xl"/>
          </form>
          <div>Change password</div>
          <div>Change profile picture</div>
          <div className="flex gap-3 justify-end">
            <button className="px-3 py-2 rounded-2xl bg-gray-blue">
              Cancel
            </button>
            <button className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsForm;
