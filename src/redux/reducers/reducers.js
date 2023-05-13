import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import videoReducer from '../slices/videoSlice';
import followedReducer from '../slices/followedSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    video: videoReducer,
    followed: followedReducer,
});

export default rootReducer;
