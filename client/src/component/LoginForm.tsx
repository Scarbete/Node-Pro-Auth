import { FC, useState } from 'react'
import { store } from '@/store/store.ts'

const LoginForm: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { login, registration } = store()

    const submit = (type?: string) => (type === 'login')
        ? login(email, password)
        : registration(email, password)

    return (
        <div>
            <input
                value={email}
                onChange={event => setEmail(event.target.value)}
                type={'text'}
                placeholder={'Email'}
            />
            <input
                value={password}
                onChange={event => setPassword(event.target.value)}
                type={'text'}
                placeholder={'Password'}
            />
            <button onClick={() => submit('login')}>Login</button>
            <button onClick={() => submit()}>Register</button>
        </div>
    )
}

export default LoginForm