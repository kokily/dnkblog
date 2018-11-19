---
title: 리액트로 블로그 만들기 - 14
subTitle: React-Blog(API 연동)
category: "Blog Making"
cover: logo.png
---

## API 연동 (feat. axios 라이브러리)
Backend API와 연동하기 위해 *axios* 라이브러리를 설치하고 api파일을 생성하여
함수를 넣겠습니다.

```js
$ yarn add axios
```

그리고 프론트엔드(리액트 앱)에서 백엔드(KoaJS)로 API를 요청할 수 있게 프록시를
리액트 앱에 세팅합니다.

```js
- frontend/package.json

...(생략)
"proxy": "http://localhost:4000"
...(생략)
```

자 이제 글 작성 API 함수부터 만들어 봅시다.

***

### writePost 함수 생성
```js
- frontend/src/api/api.js

import axios from 'axios';

export const writePost = ({ title, body }) => axios.post('/api/posts', { title, body });
```

이제 작성한 이 함수를 액션화할 겁니다. 우선 매우 칩시다!

```js
- frontend/src/store/modules/editor.js

...(생략)
import { pender } from 'redux-pender';

import * as api from 'api/api';

// 액션 타입
...(생략)
const WRITE_POST = 'editor/WRITE_POST';

// 액션 생성자
...(생략)
export const writePost = createAction(WRITE_POST, api.writePost);

// 상태 초기화
const initialState = Map({
  ...(생략)
  postId: null
});

// 리듀서
export default handleActions({
  ...(생략)
  },
  ...pender({
    type: WRITE_POST,
    onSuccess: (state, action) => {
      const { _id } = action.payload.data;
      return state.set('postId', _id);
    }
  })
}, initialState);
```

에디터 모듈에 WRITE_POST 액션을 생성하고 API 요청이 성공하면 서버에서 *_id* 값을
받아 와 에디터 리덕스 모듈의 postId 상태에 넣습니다.

***

### EditorHeaderContainer 생성
일단 또 칩니다!

```js
- frontend/src/containers/editor/EditorHeaderContainer.js

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EditorHeader } from 'components/editor';
import * as editorActions from 'store/modules/editor';

class EditorHeaderContainer extends Component {
  componentDidMount() {
    const { EditorActions } = this.props;
    EditorActions.initialize();
  }

  handleBack = () => {
    const { history } = this.props;
    history.Back();
  }

  handleSubmit = async () => {
    const { title, markdown, EditorActions, history } = this.props;
    const post = { title, body: markdown };

    try {
      await EditorActions.writePost(post);
      history.push(`/post/${this.props.postId}`);
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    const { handleBack, handleSubmit } = this;

    return (
      <EditorHeader
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );
  }
}

export default connect(
  (state) => ({
    title: state.editor.get('title'),
    markdown: state.editor.get('markdown'),
    postId: state.editor.get('postId')
  }),
  (dispatch) => ({
    EditorActions: bindActionCreators(editorActions, dispatch)
  })
)(withRouter(EditorHeaderContainer));
```

EditorHeader 컨테이너를 만들어서 *뒤로가기* 와 *글작성* 버튼을 활성화합니다.  
그리고 **EditorPage** 에 이 컨테이너를 포함합니다. 헤더 컴포넌트를 대체하면
됩니다.

```js
- frontend/src/pages/Editorpage.js

import React, { Component } from 'react';

import { EditorTemplate } from 'components/editor';

import EditorHeaderContainer from 'containers/editor/EditorHeaderContainer';
import EditorPaneContainer from 'containers/editor/EditorPaneContainer';
import EditorPreviewContainer from 'containers/editor/EditorPreviewContainer';

class Editorpage extends Component {
  render() {
    return (
      <EditorTemplate
        header={<EditorHeaderContainer />}
        editor={<EditorPaneContainer />}
        preview={<EditorPreviewContainer />}
      />
    );
  }
}

export default Editorpage;
```

이제 작성하기 기능 구현이 끝났습니다. 하지만 포스트 내용을 보여주는 기능이
미작성이므로 작성된 페이지가 나오지 않습니다.

다음 포스트에서 특정 포스트(id)를 보여주는 페이지를 구현하겠습니다.