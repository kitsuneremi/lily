import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChannelDataType } from '@/types/type';

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
});

export default channelData.reducer;
export const { set } = channelData.actions;
