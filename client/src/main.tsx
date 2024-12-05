import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/styles/bundle.scss'

const root = document.getElementById('root')!

if (!root) {
    throw new Error('root is not defined')
}

createRoot(root).render(
    <App />
)
