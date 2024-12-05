import { TUser } from '@/models/TUser.ts'

export type AuthResponse = {
    accessToken: string
    refreshToken: string
    user: TUser
}