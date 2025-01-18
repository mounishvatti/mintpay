import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    userId: '',
    session: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setSession: (state, action) => {
      state.session = action.payload;
    },
  },
});

export const { setUsername, setUserId, setSession } = userSlice.actions;
export default userSlice.reducer;