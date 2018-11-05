---
title: 리액트로 블로그 만들기 - 11
subTitle: React-Blog(프론트엔드-7)
category: "Blog Making"
cover: logo.png
---

## Redux 설정
우선 모듈부터 설치합니다.

```js
$ yarn add redux redux-actions react-redux redux-pender immutable
```

이후 상태 관리*(state)*를 할 모듈들을 만듭니다.  
- login: 로그인(모달)의 상태 관리
- list: 블로그 포스트의 리스트 상태 관리
- post: 포스트 상세보기의 상태 관리
- editor: 에디터의 상태 관리

이 네가지 파일은 기본 틀이 일단 똑같기 때문에 동일하게 생성하여 주고 인덱스 파일을 만들어줍니다.

```js
- src/store/modules/login.js  list.js, post.js, editor.js

import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender';

// 액션 타입

// 액션 생성자

// 상태 초기화
const initialState = Map({

});

// 리듀서
export default handleActions({

}, initialState)
```

```js
- src/store/modules/index.js

export { default as login } from './login';
export { default as list } from './list';
export { default as post } from './post';
export { default as editor } from './editor';
export { penderReducer as pender } from 'redux-pender';
```

이렇게 모듈을 만든 후 스토어를 생성하는 설정 파일을 만들겠습니다.  
이 설정 파일에서는 combineReducers로 모든 모듈을 합칠 겁니다.

```js
- src/store/configure.js

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import penderMiddleware from 'redux-pender';

import * as modules from './modules';

const Reducers = combineReducers(modules);
const Middlewares = [penderMiddleware()];

// 개발 모드에서 리덕스 개발툴 사용
const isDev = process.env.NODE_ENV === 'development';
const devTools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devTools || compose;

const configure = (preloadedState) => createStore(Reducers, preloadedState, composeEnhancers(
  applyMiddleware(...Middlewares)
));

export default configure;
```

개발모드일 때 *Redux Devtools*를 사용하기 위한 세팅을 하였고, preloadedState는 나중에 SSR(서버사이드렌더링)을
작성할 때 사용할 초기 State 입니다.

이제 스토어 함수를 만들었으니 **Provider**로 라우터를 감싸줍니다.

```js
- src/client/Root.js

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configure from 'store/configure';
import App from 'shared/App';

const store = configure();

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

export default Root;
```

자 이제 리덕스를 사용할 준비가 다 되었습니다.  
그럼 먼저 에디터의 상태 관리를 작성해 볼까요??

***

### Editor State
먼저 에디터 모듈을 만들겠습니다. 모듈의 *editor.js* 파일을 아래와 같이 수정합니다.

```js
- src/store/modules/editor.js

import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender';

// 액션 타입
const INITIALIZE = 'editor/INITIALIZE';
const CHANGE_INPUT = 'editor/CHANGE_INPUT';

// 액션 생성자
export const initialize = createAction(INITIALIZE);
export const changeInput = createAction(CHANGE_INPUT);

// 상태 초기화
const initialState = Map({
  title: '',
  markdown: ''
});

// 리듀서
export default handleActions({
  [INITIALIZE]: (state, action) => initialState,
  [CHANGE_INPUT]: (state, action) => {
    const { name, value } = action.payload;
    return state.set(name, value);
  }
}, initialState)
```

위와 같이 INITALIZE, CHANGE_INPUT 액션을 만들었습니다.  
그럼 이제 이 모듈을 사용하는 컨테이너를 만들어서 그 안에 에디터를 넣어 상태 관리를 하도록 합니다.

```js
- src/containers/editor/EditorPaneContainer.js

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as editorActions from 'store/modules/editor';

import { EditorPane } from 'components/editor';

class EditorPaneContainer extends Component {
  handleChangeInput = ({ name, value }) => {
    const { EditorActions } = this.props;
    
    EditorActions.changeInput({ name, value });
  };

  render() {
    const { title, markdown } = this.props;
    const { handleChangeInput } = this;

    return (
      <EditorPane
        title={title}
        markdown={markdown}
        onChangeInput={handleChangeInput}
      />
    );
  }
}

export default connect(
  (state) => ({
    title: state.editor.get('title'),
    markdown: state.editor.get('markdown')
  }),
  (dispatch) => ({
    EditorActions: bindActionCreators(editorActions, dispatch)
  })
)(EditorPaneContainer);
```

title, markdown 상태를 연결하고 handleChangeInput 함수로 CHANGE_INPUT 액션을
수행하도록 합니다. 그리고 에디터 페이지에서 이 컨테이너를 불러옵니다.

***

그럼 다음 포스트에서 에디터 판을 수정하겠습니다.