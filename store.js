const { configureStore } = require("@reduxjs/toolkit");

const reducer = require("./reducers");

const firstMiddleware = () => (next) => (action) => {
  console.log("로깅", action);
  next(action);
};
// applyMiddleware나 composeWithDevtools 같은건 사용하면 안된다.(이미 등록되있음)
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(firstMiddleware),
  // getDefaultMiddleware에 Thunk라던가 여러 미들웨어가 등록되 있음
  // devTools: true (기본값 true, 사용할지 말지 결정)
  // enhancers: (defaultEnhancers) => defaultEnhancers.prepend(offline)
});

module.exports = store;
