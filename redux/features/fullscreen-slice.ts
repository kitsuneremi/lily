import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type init = {
    value: {
        fullscreen: boolean
    }
}

export const fullscreen = createSlice({
    name: 'fullscreen',
    initialState: {
        value: {
            fullscreen: true
        }
    } as init,
    reducers: {
        set: (state, action: PayloadAction<init>) => {
            return {
                value: {
                    fullscreen: action.payload.value.fullscreen
                }
            }

        },
        close: () => {
            return {
                value: {
                    fullscreen: false
                }
            }
        },
        open: () => {
            return {
                value: {
                    fullscreen: true
                }

            };
        }
    },

}
)

export default fullscreen.reducer
export const { set, close, open } = fullscreen.actions