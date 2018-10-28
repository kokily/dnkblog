---
title: 리액트로 블로그 만들기 - 1
subTitle: React-Blog(백엔드-1)
category: "Blog Making"
cover: logo.jpg
---

# 리액트 블로그 만들기
리액트와 백엔드를 구축하여 간단한 블로그를 만들어 보려 합니다.  
전에 말씀드렸듯이 제 블로그는 개발자 블로그가 아닌 일반 직장인이 책과 구글링을 통해
혼자 기록을 남기면서 공부를 하기 위함이고, 책은 주로 *Velopert(김민준)*님의 책을 참고,
인터넷 영상은 *노마드코더*의 도움을 받아 제작하는 포스트임을 밝힙니다.  

***

## 사용할 기술 및 모듈
> 백엔드 : KoaJS, MongoDB  
> 프론트엔드 : ReactJS, Sass, Redux

위와 같이 모듈을 사용할 것이고 프론트엔드의 기본 틀을 만들어 놓고나서 백엔드를 제작, 후에
API를 연동하겠습니다. 이번 포스트까지는 KoaJS로 RestAPI를 제작할 것이고 이 후 요즘 유행하는
**GraphQL, Apollo, ReactJS**를 이용하여 블로그를 만들어 볼 계획입니다.

***

## 프로젝트 시작
```js
- 폴더 및 파일명은 동일하지 않아도 됩니다.

 $ mkdir React-Blog && cd React-Blog
 $ yarn init
```

이후 엔터 두다다다다다다!! 딱히 기록하기 귀찮아서 그런 건 **절대** 아님다..

아 참고로.. (참고까지는 아니지만 ㅋㅋ) 얼마전에 좀 싼 맥북을 구매하여 개발은 맥북으로
기존 노트북은 게임에만 활용하고 있어서 이번 부터는 맥으로 코딩합니다.  
그렇다고 뭐 크게 달라지는 건 없습니다.

![맥북](./macbook.jpg)

```js
- 모듈을 설치합니다.

 $ yarn add koa koa-router koa-bodyparser dotenv joi mongoose
 $ yarn add babel-cli babel-preset-env babel-preset-stage-3 cross-env --dev
 $ yarn global add nodemon
```

babel은 `import {} from ...` 구문을 사용하려고 설치합니다. 귀찮으시면 그냥
`const {} = ...`로 하시고 그냥 안 하셔도 상관 없어용

우선 바벨 적용을 위해 루트 경로에 *.babelrc* 파일을 생성하여 아래와 같이 작성합니다.

```js
- .babelrc

{
  "presets": [
    "env", "stage-3"
  ]
}
```

서버 가동시 편리함을 위해 아래와 같이 *package.json* 파일에 스크립트를 추가해 줍니다.

```js
- package.json

(...) 생략
  "scripts": {
    "start": "NODE_PATH=src nodemon --exec babel-node index.js"
  }
(...) 생략
```

이러면 파일이 수정될 때마다 자동으로 서버가 재 시작되며 파일 경로 설정 시 *src/*를 기본으로
인식하게 되어 코딩이 다소! 편리해 집니다.

> 주의!! 윈도우에서는 *NODE_PATH* 앞에 *cross-env*를 붙여야 합니다.

아까 설치한 **dotenv** 모듈을 사용하여 환경설정 파일을 생성하겠습니다.

```js
- .env

port=4000
MONGO_URI=mongodb://localhost/blog
```

몽고 DB는 기본적으로 설치가 되어 있다고 가정하겠습니다. MongoDB 커뮤니티 서버로 가동하시면 됩니다.

***

## 서버 코딩
기존의 KoaJS 서버를 뼈대로 작성하겠습니다. 서버 기본 코딩은 무시하겠습니다.

```js
- index.js

require('dotenv').config();

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

const app = new Koa();
const router = new Router();

// 비구조화 할당 문으로 process.env 내부 값에 대한 레퍼런스 작성
const {
  PORT: port=4000,
  MONGO_URI: mongoURI
} = process.env;

// 몽고 DB 프라미스 사용을 위한 글로벌 선언
mongoose.Promise = global.Promise;

// 몽고 DB 접속
mongoose.connect(mongoURI, { useNewUrlParser: true })
  .then(() => { console.log('몽고 DB 접속 완료'); })
  .catch((err) => { console.error(err); });

// BodyParser 미들웨어 사용
app.use(bodyParser());

// 라우터 사용 선언
app.use(router.routes()).use(router.allowedMethods());

// 서버 가동
app.listen(port, () => { console.log(`Koa 서버 작동 중 : ${port} 포트`); });
```

그리고 **yarn start**

```js
yarn run v1.10.1
$ NODE_PATH=src nodemon --exec babel-node index.js
[nodemon] 1.18.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `babel-node index.js`
Koa 서버 작동 중 : 4000 포트
몽고 DB 접속 완료
```

우선 KoaJS 서버와 몽고DB는 정상적으로 가동됩니다. 이제 다음 포스트에서 라우터를 적용하여
실제 사용할 경로들과 라우팅 시 사용될 함수들을 만들겠습니다~