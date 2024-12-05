import { FC, useEffect, useState } from 'react'
import LoginForm from '@/component/LoginForm.tsx'
import { store } from '@/store/store.ts'
import { token } from '@/utils/constants.ts'
import { TUser } from '@/models/TUser.ts'
import AuthService from '@/services/UserService.ts'

const App: FC = () => {
    const [users, setUsers] = useState<TUser[]>([])
    const { checkAuth, isAuth, user, logout, isLoading } = store()

    useEffect(() => {
        if (localStorage.getItem(token.access)) checkAuth()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await AuthService.fetchUsers()
            setUsers(response.data)
        }
        catch (error) {
            console.error(error)
        }
    }

    if (isLoading) return <div>LOADING...</div>
    return (
        <main>
            {isAuth ? <>
                <h1>{isAuth ? `User is authorized ${user?.email}` : 'user is unauthorized'}</h1>
                <h1>{user.isActivated ? 'Account verified' : `Confirm your account via email ${user.email}`}</h1>
                <button onClick={() => logout()}>logout</button>
            </> : <LoginForm />}
            <button onClick={fetchUsers}>get users</button>
            <ul>{users.map((user) => <li key={user._id}>{user.email}</li>)}</ul>
        </main>
    )
}

export default App