---
title: 리액트로 블로그 만들기 - 16
subTitle: React-Blog(API 연동-3)
category: "Blog Making"
cover: logo.jpg
---

### postList 함수 생성
포스트 목록은 웹 사이트의 기본 루트에서 보여지게 할 것이고 백엔드에서 계산했듯이 한 페이지에 최근 작성된
포스트를 10개까지 보여주도록 하겠습니다. 그리고 페이지네이션으로 페이지를 이동할 것이므로 파라미터로 *page*를
설정하겠습니다!

**postList** 함수의 파라미터로 *page* 를 추가한 후에 page 객체값을 URL 쿼리로 변환하여 API 의 주소 뒤에
붙여 줍니다. 이를 위해 라이브러리를 하나 설치할게요.

```js
버전 6이상부터는 구형 웹 브라우저와 호환이 안되므로 @5를 붙여주세요

$ yarn add query-string@5
```

이제 이 쿼리스트링을 이용해서 API 함수를 만듭니다.

```js
- frontend/src/api/api.js

import axios from 'axios';
import queryString from 'query-string';

export const writePost = ({ title, body }) => axios.post('/api/posts', { title, body });
export const readPost = (id) => axios.get(`/api/posts/${id}`);
export const postList = (page) => axios.get(`/api/posts/?${queryString.stringify(page)}`);
```

객체를 쿼리 문자열로 변환하기 위해 *queryString.stringify()* 함수를 사용합니다.

이제 list 모듈을 작성합니다.

```js
- frontend/src/store/modules/list.js

import { createAction, handleActions } from 'redux-actions';
import { Map, fromJS, List } from 'immutable';
import { pender } from 'redux-pender';

import * as api from 'api/api';

// 액션 타입
const POST_LIST = 'list/POST_LIST';

// 액션 생성자
export const postList = createAction(POST_LIST, api.postList, meta => meta);

// 상태 초기화
const initialState = Map({
  posts: List(),
  lastPage: null
});

// 리듀서
export default handleActions({
  ...pender({
    type: POST_LIST,
    onSuccess: (state, action) => {
      const { data: posts } = action.payload;
      const lastPage = action.payload.headers['last-page'];

      return state.set('posts', fromJS(posts)).set('lastPage', parseInt(lastPage, 10))
    }
  })
}, initialState);
```

postList 는 포스트의 리스트 데이터가 있는 *posts* 값과 *lastPage* 값을 넣습니다.

백엔드 코드에서 Last-Page 라는 Custom HTTP Header를 넣었는데 axios는 소문자로 헤더를 읽어오기 때문에
*last-page* 로 로드합니다. 그리고 문자열로 로드하기 때문에 숫자로 변환합니다.

이제 이 모듈을 이용해서 리스트 컨테이너를 만듭니다.

```js
- frontend/src/containers/post/PostListContainer.js

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { PostList, Pagination } from 'components/post';

import * as listActions from 'store/modules/list';

class PostListContainer extends Component {
  postList = () => {
    const { page, ListActions } = this.props;

    ListActions.postList({ page });
  }

  componentDidMount() {
    this.postList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.page !== this.props.page) {
      this.postList();
      document.documentElement.scrollTop = 0;
    }
  }

  render() {
    const { loading, posts, page, lastPage } = this.props;

    if (loading) return null;

    return (
      <div>
        <PostList posts={posts} />
        <Pagination page={page} lastPage={lastPage} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    lastPage: state.list.get('lastPage'),
    posts: state.list.get('posts'),
    loading: state.pender.pending['list/POST_LIST']
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch)
  })
)(PostListContainer);
```

이 컨테이너는 *포스트 리스트*와 *페이지네이션* 컴포넌트를 포함하며 **page**값이 변할 때 리스트를 새로 불러옵니다.
그럼 리스트 페이지에서 로드하여 수정합니다.

```js
- frontend/src/pages/Homepage.js

import React from 'react';

import { PageTemplate } from 'components/common';
import PostListContainer from 'containers/post/PostListContainer';

const Homepage = ({ match }) => {
  const { page = 1 } = match.params;

  return (
    <PageTemplate>
      <PostListContainer page={parseInt(page, 10)} />
    </PageTemplate>
  );
};

export default Homepage;
```

포스트 리스트 컴포넌트와 페이지네이션 컴포넌트를 컨테이너에서 포함해서 *page* 값을 파라미터에서
읽어와서 전달합니다. *page* 가 존재하지 않을 시 기본 값을 1로 설정합니다.

이제 포스트 리스트 컴포넌트에서 실제 데이터를 렌더링할 차례입니다. 여기서부터는 다음 포스트에서
작성할게요~!