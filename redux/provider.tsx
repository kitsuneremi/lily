'use client'
import { storage } from './storage'
import { Provider } from 'react-redux'

export default function ValProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={storage}>
            {children}
        </Provider>
    )

}