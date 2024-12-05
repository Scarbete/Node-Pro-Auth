import axios from 'axios'
import { create } from 'zustand'
import { TUser } from '@/models/TUser.ts'
import AuthService from '@/services/AuthService.ts'
import { BASE_URL, token } from '@/utils/constants.ts'
import { AuthResponse } from '@/models/response/AuthResponse.ts'

type State = {
    user: TUser
    isAuth: boolean
    isLoading: boolean
}

type Actions = {
    setUser: (user: TUser) => void
    setIsAuth: (isAuth: boolean) => void
    login: (email: string, password: string) => void
    registration: (email: string, password: string) => void
    logout: () => void
    checkAuth: () => void
}

const handleError = (error: unknown) => {
    if (error instanceof Error) console.error('Error:', error.message)
    else console.error('Unknown error:', error)
}

export const store = create<State & Actions>((set) => ({
    user: {} as TUser,
    isAuth: false,
    isLoading: false,
    setUser: (user: TUser) => set({user}),
    setIsAuth: (isAuth: boolean) => set({isAuth}),
    login: async (email, password) => {
        try {
            const response = await AuthService.login(email, password)
            localStorage.setItem(token.access, response.data.accessToken)
            set({ isAuth: true })
            set({ user: response.data.user })
        }
        catch (error) {
            handleError(error)
        }
    },
    registration: async (email, password) => {
        try {
            const response = await AuthService.registration(email, password)
            localStorage.setItem(token.access, response.data.accessToken)
            set({ isAuth: true })
            set({ user: response.data.user })
        }
        catch (error) {
            handleError(error)
        }
    },
    logout: async () => {
        try {
            await AuthService.logout()
            localStorage.removeItem(token.access)
            set({ isAuth: false })
            set({ user: {} as TUser })
        }
        catch (error) {
            handleError(error)
        }
    },
    checkAuth: async () => {
        set({ isLoading: true })
        try {
            const response = await axios.get<AuthResponse>(`${BASE_URL}/refresh`, {withCredentials: true})
            localStorage.setItem(token.access, response.data.accessToken)
            set({ isAuth: true })
            set({ user: response.data.user })
        }
        catch (error) {
            handleError(error)
        }
        finally {
            set({ isLoading: false })
        }
    }
}))