import axios from 'axios'
import { BASE_URL, token } from '@/utils/constants.ts'
import { AuthResponse } from '@/models/response/AuthResponse.ts'

export const $api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem(token.access)}`
    return config
})

$api.interceptors.response.use(
    config => config,
    async error => {
        const originConfig = error.config

        if (error.response.status === 401 && !error.config._isRetry) {
            originConfig._isRetry = true

            try {
                const response = await axios.get<AuthResponse>(`${BASE_URL}/refresh`, {withCredentials: true})
                localStorage.setItem(token.access, response.data.accessToken)
                return $api.request(originConfig)
            }
            catch (error) {
                console.error(`Refresh token expired or invalid: ${error}`)
                localStorage.removeItem(token.access)
            }
        }
        throw error
    }
)