import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '~/services';
import { useLocalStorage } from '~/hooks';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { setDataStorage, deleteStorage } = useLocalStorage();

const initialState = {
    isAuth: false,
    currentUser: {},
};

// get current user action
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
    const currentUser = await authService.getCurrentUser();

    return currentUser;
});

// register action
export const register = createAsyncThunk('auth/register', async (registerData) => {
    const responseData = await authService.register(registerData);

    return responseData;
});

// login action
export const login = createAsyncThunk('auth/login', async (loginData) => {
    const responseData = await authService.login(loginData);

    return responseData;
});

// Logout action
export const logout = createAsyncThunk('auth/logout', async () => {
    const responseData = await authService.logout();

    return responseData;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggle: (state) => {
            state.isAuth = !state.isAuth;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isAuth = true;
                state.currentUser = action.payload;
            })
            .addCase(register.fulfilled, (state, action) => {
                const userData = action.payload.data;
                if (userData?.nickname) {
                    // Save the token to localstorage
                    const token = action.payload.meta.token;
                    const dataStorage = {
                        token,
                    };
                    setDataStorage(dataStorage);

                    // Update auth state
                    state.isAuth = true;
                    state.currentUser = userData;
                }
            })
            .addCase(login.fulfilled, (state, action) => {
                const userData = action.payload.data;
                if (userData?.nickname) {
                    // Save the token to localstorage
                    const token = action.payload.meta.token;
                    const dataStorage = {
                        token,
                    };
                    setDataStorage(dataStorage);

                    // Update auth state
                    state.isAuth = true;
                    state.currentUser = userData;
                }
            })
            .addCase(logout.fulfilled, (state, action) => {
                if (!action.payload) {
                    deleteStorage('token');
                    state.isAuth = false;
                    state.currentUser = {};
                }
            });
    },
});

const { reducer, actions } = authSlice;

export const { toggle } = actions;

export default reducer;
