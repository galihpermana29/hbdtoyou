import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IUploadState {
  uid: string;
  uri: string;
  url?: string;
}

export interface UploadState {
  value: number;
  collectionOfImages: IUploadState[];
}

const initialState: UploadState = {
  value: 0,
  collectionOfImages: [],
};

export const uploadSlice = createSlice({
  name: 'uploadSlice',
  initialState,
  reducers: {
    //set collectionOfImages
    setCollectionOfImages: (state, action: PayloadAction<IUploadState[]>) => {
      // state.collectionOfImages = action.payload;
      //i want to keep the old state and add the new one
      state.collectionOfImages = [
        ...state.collectionOfImages,
        ...action.payload,
      ];
    },
    //remove colletionOfImages by sending uid
    removeCollectionOfImages: (state, action: PayloadAction<string>) => {
      state.collectionOfImages = state.collectionOfImages.filter(
        (item) => item.uid !== action.payload
      );
    },

    //reset
    reset: (state) => {
      state.collectionOfImages = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCollectionOfImages, removeCollectionOfImages, reset } =
  uploadSlice.actions;

export default uploadSlice.reducer;
