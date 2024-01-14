import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ChannelDataType } from '@/types/type';

interface ChannelDataResponse {
  channelData: ChannelDataType;
}

export const fetchChannelData = createAsyncThunk('channelData/fetchData', async () => {
  const response = await fetch('https://erinasaiyukii.com/api/channel/data');
  const data: ChannelDataResponse = await response.json();
  return data.channelData;
});

type Init = {
  value: {
    channelData: ChannelDataType;
  };
};

export const channelData = createSlice({
  name: 'channelData',
  initialState: {
    value: {
      channelData: {
        id: -1,
        name: '',
        tagName: '',
        des: '',
        accountId: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
        sub: -1,
        avatarImage: '',
        bannerImage: '',
        streamKey: '',
        live: false,
      },
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
