import { UserType } from "../models/auth";

const user_prefix = "user";

const userStorage = {
  getUser: () => {
    if (typeof window !== "undefined") {
      const user = window.localStorage.getItem(`${user_prefix}`);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  getUserId: (): string | null => {
    const user = userStorage.getUser();
    return user && user.user ? user.user.id : null;
  },
  setUser: (user: UserType): void => {
    window.localStorage.setItem(`${user_prefix}`, JSON.stringify(user));
  },
  clearUser: (): void => {
    window.localStorage.removeItem(`${user_prefix}`);
  },
};

export { userStorage };
