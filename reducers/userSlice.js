const { createSlice } = require("@reduxjs/toolkit");
const { logIn } = require("../actions/user");

const initialState = {
  isLoggingIn: false,
  data: null,
  prices: Array(100)
    .fill()
    .map((v, i) => (i + 1) * 100),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 동기적 실행인 리듀서
    logOut(state, action) {
      state.data = null;
    },
  },
  // 비동기 실행인 리듀서
  extraReducers: (builder) =>
    builder
      .addCase(logIn.pending, (state, action) => {
        // user/logIn/pending
        state.data = null;
        state.isLoggingIn = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        // user/logIn/fulfilled
        state.data = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(logIn.rejected, (state, action) => {
        // user/logIn/rejected
        state.error = action.payload;
      }),
});

module.exports = userSlice;
