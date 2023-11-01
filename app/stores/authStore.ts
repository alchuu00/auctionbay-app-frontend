import { makeAutoObservable } from 'mobx'
import { UserType } from '../models/auth'
import { userStorage } from '../utils/localStorage'

export interface AuthContextType {
  user?: UserType | null
  userId?: string | null
  login: () => void
  signout: () => void
}

class AuthStore {
  user?: UserType | null = userStorage.getUser() || null
  userId?: string | null = userStorage.getUserId() || null

  constructor() {
    makeAutoObservable(this)
  }

  login(user: UserType) {
    userStorage.setUser(user)
    userStorage.setUserId(user.id)
    this.user = user
  }

  signout() {
    userStorage.clearUser()
    this.user = undefined
    this.userId = undefined
  }
}

const authStore = new AuthStore()
export default authStore