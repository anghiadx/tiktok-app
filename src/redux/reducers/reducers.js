import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import videoReducer from '../slices/videoSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    video: videoReducer,
});

export default rootReducer;
