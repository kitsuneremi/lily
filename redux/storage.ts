import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './features/sidebar-slice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storage = configureStore({
    reducer: {
        sidebarReducer,

    }
})


export type RootState = ReturnType<typeof storage.getState>
export type AppDispatch = typeof storage.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector