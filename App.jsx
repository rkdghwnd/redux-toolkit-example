import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit"; // reselect
// selector를 최적화 하는 createSelector(컴포넌트 윗단에서 최적화를 시킴)

const { logIn } = require("./actions/user");
const userSlice = require("./reducers/userSlice");

const priceSelector = (state) => state.user.prices;
// 기존에는 리렌더링 될대마다 reduce 연산 실행
// => selector로 전달된 값(상태 prices)이 바뀔때만 연산 실행
// -> 리렌더링시 불필요한 연산을 줄일 수 있다.
const sumPriceSelector = createSelector(priceSelector, (prices) =>
  prices.reduce((a, c) => a + c, 0)
);
// useMemo와 createSelector 사용하는 것은 취향차이 라고 한다.
// 그러면 useMemo와 같이 비용에 대한 trade off가 발생하는것은 동일한가?

// QnA
// 1. 변수나 함수를 컴포넌트 밖으로 빼도 되는 경우는 어떤 경우인가요?
// 답변 : 순수함수는 빼도 된다.(동일 인풋 동일 아웃풋, 함수 외부의 변수를 직접 참조하지 않는 함수)
//        ex) dispatch나 액션생성함수를 다루는 onClick 핸들러는
//            외부함수를 직접 참조하는 것이기 때문에 순수함수가 아님
//            정 사용하고 싶으면 매개변수로 받아서 사용해야 함

//        const는 값이 바뀌지 않아 밖으로 빼도 되는데
//        let은 컴포넌트 내부에서 작성해야 한다.
//        let은 값이 바뀔수 있기 때문에 외부로 빼면
//        의도하지 않은 결과가 나올 수 있다.(컴포넌트 변화에 따라 다시 연산하지 않기 때문에)
//        만약 let을 전역에서 사용하면 static 변수처럼 사용하는 경우일 것이다.

// 2. 컴포넌트 내부에 createSelector 작성하면 안되나요?
// 답변 : 안빼도 사용하는데는 문제 없는데
//        다른 컴포넌트에서 재사용을 못한다.

//        *주의! selector를 '그대로' 여러 컴포넌트에서 재사용하면 안된다.
//        의도하지 않은 동작이 나올 수 있기 때문에
//        재사용을 하고 싶으면 'selector를 생성하는 함수'를 만들어서 재사용 해야 한다.
//        https://github.com/reduxjs/reselect#motication-for-memoized-selectors
//        Can I share a selector across multiple component instances? 검색

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { list } = useSelector((state) => state.post);
  // const prices = useSelector((state) => state.user.prices);
  const createSelectorTotalPrices = useSelector(sumPriceSelector);

  const onClick = useCallback(() => {
    dispatch(
      logIn({
        id: "zerocho",
        password: "비밀번호",
      })
    );
  }, []);

  const onLogout = useCallback(() => {
    // 동기적인 reducer 실행은 slice에서 직접 가져온다.
    dispatch(userSlice.actions.logOut());
  }, []);

  // const totalPrice = useMemo(() => {
  //   console.log("memo");
  // 100만번 연산이라 가정
  // useMemo를 통해 리렌더링 될때마다 100만번 연산하는 것이 아니라
  // prices가 바뀔때마다만 100만번 연산
  // trade off(상충하는 관계)가 있음
  // (리렌더링 될때마다 prices 감지하는 비용) vs (reduce 연산하는 비용)
  // 어떤것이 효율적인지 고려한다음 사용해야 한다.
  //   prices.reduce((a, c) => a + c, 0);
  // }, [prices]);

  return (
    <div>
      {user.isLoggingIn ? (
        <div>로그인 중</div>
      ) : user.data ? (
        <div>{user.data.nickname}</div>
      ) : (
        "로그인 해주세요."
      )}
      {!user.data ? (
        <button onClick={onClick}>로그인</button>
      ) : (
        <button onClick={onLogout}>로그아웃</button>
      )}
      <div>
        {/* 값이 바뀔때마다 항상 리렌더링
        <b>{prices.reduce((a, c) => a + c, 0)}원</b>  */}
        {/* useMemo 적용
        리렌더링이 되도 prices가 바뀌지 않으면 값 재사용(memoization)
        <b>{totalPrice}</b>  */}
        <b>{createSelectorTotalPrices}</b>
      </div>
    </div>
  );
};

export default App;
