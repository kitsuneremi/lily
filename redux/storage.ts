import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import sidebarReducer from './features/sidebar-slice'
import watchsidebarReducer from './features/watch-sidebar-slice'
import channelReducer from './features/current-channel-slice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storage = configureStore({
    reducer: {
        sidebarReducer,
        watchsidebarReducer,
        channelReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})


export type RootState = ReturnType<typeof storage.getState>
export type AppDispatch = typeof storage.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector