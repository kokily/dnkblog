---
title: MobX 블로그 - 1(백엔드-1)
subTitle: Mobx-Blog(백엔드-1)
category: "Blog Making"
cover: logo.png
---

## MobX 블로그 제작
이전 블로그를 만들다가 오타도 많고 에러도 많고 일도 많아지고(... 핑ㅋ계ㅋ)...  

하여 다시 블로그를 만들건데 이번엔 그동안 새로 공부한 지식(?)으로 만들어 보려고 합니다.
근데... 이 블로그는 제 소개 페이지에도 쓰여 있듯이 저 혼자 공부하기 위해 만든 것이고
저는 개발자가 아닌......(ㅜㅜ)  
어쨌든! 이번에 만들어 볼 블로그는 아래와 같은 것들로 해보겠슴다

***

## 사용할 기술 및 모듈
> 백엔드 : KoaJS, MongoDB  
> 프론트엔드 : ReactJS, Scss, MobX

참고로 백엔드와 프론트엔드를 동시에 돌릴 때 각각 폴더에서 **yarn start**를 돌려서 하려니
참 귀찮은데요(ㅋㅋ)  
이번에는 `concurrently`라는 모듈을 사용하여 개발모드일 때 편아~~~안하게 해보겠습니다

***

## 프로젝트 시작
```js
 $ mkdir mobx-blog && cd mobx-blog
 $ yarn init --yes
```

저 `mobx-blog` 폴더 안에 `server`, `client` 폴더를 만들고 두 폴더를 동시에 `concurrently` 모듈로 실행할 겁니다

먼저 `concurrently` 모듈을 먼저 설치합니다(개발모드로)

```js
 $ yarn add concurrently --dev
```

그리고 `package.json`을 수정해야죠?

```js
- package.json

{
  "name": "mobx-blog",
  "version": "1.0.0",
  "devDependencies": {
    "concurrently": "^4.1.0"
  },
  "scripts": {
    "server": "cd server && yarn start",
    "client": "cd client && yarn start",
    "dev": "concurrently --kill-others-on-fail \"yarn server\" \"yarn client\""
  }
}
```

위와 같이 수정 후 루트 폴더에서 `yarn dev`를 실행하면 서버와 클라이언트가 같이 실행됩니다~  
참~ 편하죠!!!

다음 포스트에서 Koa 프로젝트 기본 설정을 할게요~!