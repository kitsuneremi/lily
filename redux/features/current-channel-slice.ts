import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ChannelDataType } from '@/types/type';

interface ChannelDataResponse {
    channelData: ChannelDataType;
}

export const fetchChannelData = createAsyncThunk('channelData/fetchData', async (id: number) => {
    const response = await fetch(`https://erinasaiyukii.com/api/channel/data?accountId=${id}`);
    const data: ChannelDataResponse = await response.json();
    console.log(data)
    return data.channelData;
});

type Init = {
    value: {
        channelData: ChannelDataType | null;
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
