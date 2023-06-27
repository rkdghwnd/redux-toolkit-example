const { createSlice } = require("@reduxjs/toolkit");
const { addPost } = require("../actions/post");

const initialState = {
  list: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  // reducers, extraReducers 에는 immer가 적용되어 있다.
  // action에 대한 데이터는 무조건 payload로 통일되어있다.
  // 주의 : state를 통째로 바꾸는 경우(state = 123) immer의 불변성이 깨진다
  // 해결법 : state를 바꿨으면 끝에 return state 를 해줘야 한다.

  // extraReducers에 addCase 쓰는 이유 : 메서드 정의하는 방식으로 작성하면
  // 타입스크립트 사용시 타입추론이 힘들다.

  // 메서드 정의하는 방식
  // extraReducers : {
  //   [addPost.peding](state,action) {
  //     state = 123
  //   },
  //   [addPost.filfilled](state, actopm) {
  //     state.data.push(action.payload);
  //   },
  //   [addPost.rejected](state, action) {
  //   }
  // }

  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(addPost.pending, (state, action) => {})
      .addCase(addPost.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {})
      .addMatcher(
        (action) => {
          return action.type.includes("/pending");
          // 뒤에 pending이 붙은 것들은 뒤의 콜백에서 처리
          // 공통적인 상태변화를 한번에 처리할 수 있는 패턴
          // 예시
          // swtich() {
          //   CASE 'add_pending':
          //   CASE 'update_pending':
          //     state.isLoading = true;
          //     break;
          // }
          // 이러한 방식으로 처리하는 것과 같다.
        },
        (state, action) => {
          state.isLoading = true;
        }
      )
      .addDefaultCase((state, action) => {
        // switch문의 default에 해당하는 케이스
      }),
});

module.exports = postSlice;
