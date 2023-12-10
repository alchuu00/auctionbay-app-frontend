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
  }

  signout() {
    this.user = undefined;
    userStorage.clearUser();
  }

  update(user: UserType) {
    this.user = user;
    userStorage.setUser(user);
  }
}

const authStore = new AuthStore();
export default authStore;
