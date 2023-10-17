import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type init = {
    value: {
        watchsidebar: boolean
    }
}

export const watchsidebar = createSlice({
    name: 'watchsidebar',
    initialState: {
        value: {
            watchsidebar: false
        }
    } as init,
    reducers: {
        set: (state, action: PayloadAction<init>) => {
            return {
                value: {
                    watchsidebar: action.payload.value.watchsidebar
                }
            }

        },
        close: () => {
            return {
                value: {
                    watchsidebar: false
                }
            }
        },
        open: () => {
            return {
                value: {
                    watchsidebar: true
                }

            };
        },
        reverse: (state) => {
            return {
                value: {
                    watchsidebar: !state.value.watchsidebar
                }

            }
        }
    },

}
)

export default watchsidebar.reducer
export const { set, close, open, reverse } = watchsidebar.actions