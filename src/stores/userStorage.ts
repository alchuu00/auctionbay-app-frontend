import { UserType } from "../models/auth";

const USER_PREFIX = "user";

const userStorage = {
  getUser: () => {
    if (typeof window !== "undefined") {
      const userString = window.localStorage.getItem(`${USER_PREFIX}`);
      let user: UserType | null = null;
      try {
        user = userString ? JSON.parse(userString) : null;
      } catch (error) {
        console.error('Error parsing user from local storage', error);
      }
      return user;
    }
    return null;
  },

  getUserId: (): string | null => {
    const user: UserType | null = userStorage.getUser();
    return user && user ? user.id : null;
  },

  setUser: (user: UserType): void => {
    window.localStorage.setItem(`${USER_PREFIX}`, JSON.stringify(user));
  },

  clearUser: (): void => {
    window.localStorage.removeItem(`${USER_PREFIX}`);
  },

};

export { userStorage };
