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

export const store = create<State & Actions>((setState) => ({
    user: {} as TUser,
    isAuth: false,
    isLoading: false,
    setUser: (user: TUser) => {
        setState({user})
    },
    setIsAuth: (isAuth: boolean) => {
        setState({isAuth})
    },
    login: async (email, password) => {
        try {
            const response = await AuthService.login(email, password)
            console.log('response', response)
            localStorage.setItem(token.access, response.data.accessToken)
            setState({ isAuth: true })
            setState({ user: response.data.user })
        }
        catch (error) {
            if (error instanceof Error) console.log(error)
        }
    },
    registration: async (email, password) => {
        try {
            const response = await AuthService.registration(email, password)
            console.log('response', response)
            localStorage.setItem(token.access, response.data.accessToken)
            setState({ isAuth: true })
            setState({ user: response.data.user })
        }
        catch (error) {
            if (error instanceof Error) console.log(error)
        }
    },
    logout: async () => {
        try {
            const response = await AuthService.logout()
            console.log('response', response)
            localStorage.removeItem(token.access)
            setState({ isAuth: false })
            setState({ user: {} as TUser })
        }
        catch (error) {
            if (error instanceof Error) console.log(error)
        }
    },
    checkAuth: async () => {
        setState({ isLoading: true })
        try {
            const response = await axios.get<AuthResponse>(`${BASE_URL}/refresh`, {withCredentials: true})
            console.log('response', response)
            localStorage.setItem(token.access, response.data.accessToken)
            setState({ isAuth: true })
            setState({ user: response.data.user })
        }
        catch (error) {
            if (error instanceof Error) console.log(error)
        }
        finally {
            setState({ isLoading: false })
        }
    }
}))