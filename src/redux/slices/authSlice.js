import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggle: (state) => {
            state.isAuth = !state.isAuth;
        },
    },
});

const { reducer, actions } = authSlice;

export const { toggle } = actions;
export default reducer;
