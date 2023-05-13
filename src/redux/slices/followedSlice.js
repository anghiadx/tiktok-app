const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
    followedId: [],
};

const followedSlice = createSlice({
    name: 'followed',
    initialState,
    reducers: {
        addFollowedId: (state, action) => {
            const userId = action.payload;
            const isset = state.followedId.includes(userId);

            if (!isset) {
                state.followedId.push(userId);
            }
        },
        removeFollowedId: (state, action) => {
            const userId = action.payload;
            const index = state.followedId.findIndex((id) => id === userId);

            if (index !== -1) {
                state.followedId.splice(index, 1);
            }
        },
    },
});

const { reducer, actions } = followedSlice;
export const { addFollowedId, removeFollowedId } = actions;

export default reducer;
