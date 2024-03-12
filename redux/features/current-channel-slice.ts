import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { baseURL } from '@/lib/functional';
import { Account } from '@/prisma/type';


export const fetchChannelData = createAsyncThunk('channelData/fetchData', async (id: number) => {
    const response = await fetch(`${baseURL}/api/channel/data?accountId=${id}`);
    const data = await response.json();
    return data as Account;
});

type Init = {
    value: {
        channelData: Account | null;
    };
};

export const channelData = createSlice({
    name: 'channelData',
    initialState: {
        value: {
            channelData: null,
        },
    } as Init,
    reducers: {
        set: (state, action: PayloadAction<Init>) => {
            state.value.channelData = action.payload.value.channelData;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchChannelData.fulfilled, (state, action) => {
            state.value.channelData = action.payload;
        });
    },
});

export default channelData.reducer;
export const { set } = channelData.actions;
