---
title: ReactJS 로컬서버로 개발하기
subTitle: NPM(outdated!)
category: "ReactJS"
cover: logo.jpg
---

## ReactJS 로컬서버 개발

이틀 전에 html 파일에 자바스크립트 삽입으로 리액트를 사용하는 방법을
알아보았다. 오늘은 NPM을 이용하여 ReactJS를 로컬 개발서버로 사용하는 방법을
포스팅하려 한다. NodeJS 환경에서 React를 사용하는 방법이다. 이를 위해
NodeJS와 NPM이 설치되어 있어야 한다.

[NodeJS 다운로드](https://nodejs.org/dist/v8.11.4/node-v8.11.4-x64.msi)
*(윈도우 용이며 리눅스나 맥 유저는 [이곳](https://nodejs.org)을 방문하여
설치하면 된다.)*

NodeJS를 다 설치하면 터미널 창을 띄운다(윈도우는 cmd)
설치 후 NPM을 업데이트 한다.
```
C:\> npm install -g npm
```
NPM을 -g(글로벌) 모드로 설치한다는 의미
이후 리액트 구성을 위한 글로벌 패키지를 설치한다.

```
C:\> npm install -g webpack webpack-dev-server babel
```
글로벌 패키지는 총 3종류를 설치한다.

> **webpack**
  Module Bundler로서 의존성을 가진 모듈(조각)들을 하나로 합쳐준다.

> **webpack-dev-server**
  웹팩에서 지원하는 개발서버로 hot-loader를 통해 코드 수정시 자동으로
  리로드 시켜주는 기능

> **babel**
  ECMAScript6를 지원하지 않는 환경에서 사용할 수 있게 해줌

### React Project 생성
윈도우 기준으로 커맨드 창에서 생성해보자.
```
C:\> md hello-react
C:\> cd hello-react
C:\hello-react> npm init
```
hello-react라는 폴더를 생성, 폴더 안에 들어가서 "npm init" 명령어를
입력하여 새로운 프로젝트를 생성하면 폴더 안에 `package.json` 파일이
생성된다.

이제 이 프로젝트에서 사용할 모듈들을 설치할 건데 명령어를 실행하면
해당 폴더에 `node_modules` 라는 폴더가 생성되며 이 안에 우리가 설치하는
패키지 모듈들을 포함하기 위해 --save 옵션으로 설치를 한다.
```
C:\hello-react> npm install --save react react-dom
```

다음은 babel에서 사용할 플러그인을 설치한다. 개발환경에서 사용할 것이므로
설치 옵션은 --save-dev 로 한다.
```
C:\hello-react> npm install --save-dev babel-core babel-loader babel-preset-es2015
C:\hello-react> npm install --save-dev babel-preset-react webpack webpack-dev-server
```

설치가 완료되면 `node_modules` 폴더에 들어가보자. 방금 설치한 모듈들이 주르르륵 나올 것이다.
이제 루트 폴더에 있는 `package.json` 파일의 스크립트(실행 문구)를 수정해주자.
```
"scripts": {
  "start": "webpack-dev-server --hot --host localhost"
},
```

그리고 저장.. 아까 설치한 webpack-dev-server를 사용하여 개발서버를 오픈하는데
webpack으로 *개발서버로 hot load 기능*을 지원한다. 쉽게 생각하여 파일을 수정하여
저장을 누르게 되면 새로 고침할 필요가 없이 바로 브라우저에 반영이 된다는 이야기다.

### webpack 설정
프로젝트 루트 폴더에 webpack.config.js 파일을 생성하여 아래와 같이 코딩한다.
자세한 사항은 생략한다! (나중에 기술할 예정)
```
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    port: 3000,
    contentBase: __dirname + '/public'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
```

이후 리액트 구동을 위한 기본 적인 파일 구조를 작성한다. 위 webpack 설정과 같이
폴더를 맞추어 작성하면 된다. 아래 파일을 프로젝트 루트 위치에 생성한다.
> ./public/index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello, React!!</title>
  </head>
  <body>
    <div id="root"></div>
    
    <script src="bundle.js"></script>
  </body>
</html>
```

> ./src/index.js
웹팩에서 설정한 entry 파일이다. 아래와 같이 작성하자.
```
import React from 'react';
import ReactDOM from 'react-dom';

/*
  React, ReactDOM을 로드
  import는 javascript ES6에 새로 도입된 키워드로 기존
  require('')와 동일한 역할을 함(babel 세팅)
*/

/* App 라는 리액트 컴포넌트를 생성 */
class App extends React.Component {
  render() {
    return (
      <h1>Hello, React!!</h1>
    );
  };
}

/* ReactDOM을 사용하여 App 컴포넌트를 특정 id(#root)로 렌더링 */
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

이후 커맨드 창에서
```
C:\> npm start
```
라고 입력하면 된다.

## 본 포스팅은 outdated 되었습니다. 참고만 하시면 됩니다!