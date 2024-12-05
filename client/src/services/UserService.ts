import { $api } from '@/http/axios.ts'
import { AxiosResponse } from 'axios'
import { TUser } from '@/models/TUser.ts'

class AuthService {
   static async fetchUsers(): Promise<AxiosResponse<TUser[]>> {
       return $api.get<TUser[]>('/users')
   }
}

export default AuthService