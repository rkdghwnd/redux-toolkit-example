const { createAsyncThunk } = require("@reduxjs/toolkit");

// redux devtools에서 meta > requestId 로 액션끼리의 짝을 찾을 수 있다.
// meta > arg : 디스패치할때 들어오는 데이터
// payload : 비동기 액션 실행의 결과로 나오는 데이터

const delay = (time, value) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });

// creatAsyncThunk(액션이름, async (데이터, ThunkAPI) => {})
exports.addPost = createAsyncThunk("post/add", async (data, thunkAPI) => {
  // 액션생성함수의 역할 + saga와 같은 미들웨어의 역할(원래 thunk의 역할)
  // redux-toolkit에서는 비동기적인 실행만 actions에 만들면된다.
  // 동기적인 실행은 slice에서 직접가져와서 실행
  // thunk를 활용하는 미들웨어의 비동기가 포함된 로직을 여기서 작성한다.

  // pending fulfilled, rejected
  // loading, success, failure

  // throw new Error("로그인 실패"); -> rejected 발생
  // 콜백 정상적으로 실행 -> fulfilled 발생
  // 콜백이 실행중 -> pending 발생

  // 원래 미들웨어에서는 dispatch로 request, success, failure를
  // try catch로 나누고 구현했지만, 여기서는 할 필요 없음(알아서 해줌)

  // createAsyncThunk 에서는 try catch 비추천
  // 이유 : 에러메시지가 발생을 안함
  // 에러가 나면 rejected 상태로 가서 에러메시지가 뜨는데
  // rejected 되기 전에 try catch를 하면 rejected가 안돼서 에러메시지가 발생을 안함
  // 실패하든 성공하든 fulfilled로 가는 문제가 발생
  return await delay(500, data);
});
