import { makeAutoObservable } from "mobx";
import { UserType } from "../models/auth";
import { userStorage } from "./userStorage";

export interface AuthContextType {
  user?: UserType | null;
  userId?: string | null;
  login: () => void;
  signout: () => void;
}

class AuthStore {
  user?: UserType;

  constructor() {
    makeAutoObservable(this);
  }

  login(user: UserType) {
    this.user = user;
    userStorage.setUser(user);
    console.log("login set user", user);
  }

  signout() {
    userStorage.clearUser();
    this.user = undefined;
    console.log("signout clear user", userStorage.getUser());
  }

  update(user: UserType) {
    userStorage.setUser(user);
    this.user = user;
  }
}

const authStore = new AuthStore();
export default authStore;
