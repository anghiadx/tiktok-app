import { createSlice } from '@reduxjs/toolkit';
import { useLocalStorage } from '~/hooks';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { dataStorage } = useLocalStorage();

const initialState = {
    volume: dataStorage.volume || 0.6,
    muted: true,
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        changeVolume: (state, action) => {
            const volume = action.payload;
            state.volume = volume;
        },
        toggleMuted: (state) => {
            state.muted = !state.muted;
        },
        changeMuted: (state, action) => {
            const muted = action.payload;
            state.muted = muted;
        },
    },
});

const { actions, reducer } = videoSlice;

export const { changeVolume, toggleMuted, changeMuted } = actions;
export default reducer;
