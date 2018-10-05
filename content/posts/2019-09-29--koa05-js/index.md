---
title: Koa.JS 5장 Postman, RestAPI
subTitle: Koa.JS
category: "KoaJS"
cover: logo.jpg
---

## Koa.JS RestAPI Postman 테스트
이전 [4장](/koa04-js)에서 RestAPI를 이어서 작성하겠습니다.  
그리고 추가적으로 HTTP 메소드 테스트를 위한 Postman도 설치하겠습니다.

우선 API 기능을 정확히 구현하기 위해 `koa-bodyparser` 모듈을 설치하겠습니다.
이 모듈은 post, put, patch 등의 Request의 Body에 json 형식으로 데이터를 삽입하면
이를 서버에서 사용할 수 있게끔 파싱해 주는 역할을 합니다.

`C:\test> yarn add koa-bodyparser`

```js
- ~/index.js

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser'); // 추가

...(생략)

// Routes Setting
router.use('/route', route.router());

app.use(bodyParser());  // 추가

// Router 적용 전에 koa-bodyparser 적용

...(생략)
```


> <a href="https://www.getpostman.com/products" target="_blank">PostMan</a> : 
HTTP 메소드 요청을 테스트 하기 위한 프로그램(Mac, Window, Linux)

![Postman1](./postman1.png)
`Download the App`을 클릭하여 다운로드, 설치를 하시면 됩니다.  
기존에 사용했던 코드를 약간 수정하여 post 요청을 한 번 해보겠습니다.

```js
- ~/route/memos/index.js

...(생략)

// Routes Setting
memos.get('/', memoTest);
memos.get('/:id', memoTest);

memos.post('/', memoTest);  // 추가

module.exports = memos;
```

Postman을 실행합니다.
![Postman2](./postman2.png)

아래와 같이 Method는 `POST`로, 옆의 주소는 아래와 같이 하신 후에 `SEND` 버튼을 누르면
![Postman3](./postman3.png)

```json
{
  "method": "POST",
  "path": "/route/memos",
  "params": {}
}
```
위와 같이 응답이 돌아옵니다. 나머지 RestAPI도 작성하여 테스트 해봅시다.

```js
- ~/route/memos/index.js

...(생략)

// Routes Setting
memos.get('/', memoTest);
memos.get('/:id', memoTest);
memos.post('/', memoTest);

// 추가
memos.put('/:id', memoTest);
memos.patch('/:id', memoTest);
memos.delete('/:id', memoTest);

module.exports = memos;
```

이후 포스트 맨에서 동일하게 테스트를 합니다.

![Postman4](./postman4.png)
![Postman5](./postman5.png)
![Postman6](./postman6.png)

이상없이 잘 작동하는 것 같습니다!

### 라우트 처리 함수 분리
라우트 작성 시 방금 작성한 한 파일에 라우트 처리 함수를 전부 집어넣게 되면 라우터 설정을 확인하기도
힘들 뿐더러 작성하다가 혼동이 오는 경우가 있습니다. 따라서 컨트롤러 파일을 분리해주면 좋습니다.  
컨트롤러 파일을 생성한 후 아래와 같이 작성합니다.

```js
- ~/route/memos/controller/controller.js

const memos = [
  {
    id: 1,
    title: '제목',
    author: '작성자',
    body: '내용'
  }
];

let memoNum = 1;
```

데이터베이스를 적용하기 전이기 때문에 javascript의 배열 기능으로 작성해 보기 위하여 위와 같이
작성하였고 `memos` 배열 안에 순번인 **id**, 제목 **title**, 작성자 **author**, 내용 **body**를
객체 형식으로 넣었고, 이후 순번인 **id**의 번호를 자동으로 올리기 위해 변수 memoNum을 1로 초기화 해주었습니다.  
이어서 모듈화 시킨 route를 불러들일 이름을 정하여 `~/route/index.js` 파일을 수정하여 줍니다.

```js
- ~/route/memos/index.js

const Router = require('koa-router');
const memosController = require('./controller/controller');

const memos = new Router();

memos.get('/', memosController.list);
memos.get('/:id', memosController.read);
memos.post('/', memosController.write);
memos.put('/:id', memosController.update);
memos.patch('/:id', memosController.modify);

module.exports = memos;
```

### 컨트롤러 파일 작성
컨트롤러 파일(`controller.js`)에 export.호출명 = 으로 함수를 export 시켜서
`const memosController.호출명()` 으로 사용할 수 있습니다.  

#### 먼저 list(get) 컨트롤러를 추가하겠습니다.

```js
- ~/route/memos/controller/controller.js

...(생략)

// Get '/routes/memos' 추가
export.list = (ctx) => {
  ctx.body = memos;
}
```
![Ctrl](./ctrl1.png)

#### 다음으로 read(get) 컨트롤러를 추가해 보겠습니다.
read는 id에 따른 특정 데이터를 확인하는 메소드입니다.
```js
- ~/route/memos/controller/controller.js

...(생략)

// Get '/routes/memos/:id'
exports.read = (ctx) => {
  const { id } = ctx.params;
  const memo = memos.find(memo => memo.id.toString() === id);

  if (!memo) {
    ctx.status = 404;
    ctx.body = { message: '메모가 없습니다.' };
    return ;
  }

  ctx.body = memo;
}
```
![Ctrl](./ctrl2.png)

#### 다음으로 write(post) 컨트롤러를 추가해 보겠습니다.
```js
- ~/route/memos/controller/controller.js

...(생략)

// Post '/route/memos' 실제 경로
exports.write = (ctx) => {
  const { title, author, body } = ctx.request.body;

  memoNum += 1;

  const memo = { id: memoNum, title, author, body };
  memos.push(memo);

  ctx.body = memo;
}
```
기존 순번(memoNum) 값에 1을 추가하면서 memos 객체 배열에 `id, title, author, body` 항목을
**push()** 함수로 추가합니다.  
post 테스트이기 때문에 Postman을 실행하여 아래 화면과 같이 작성합니다.

![Postman7](./postman7.png)
위와 같이 메소드는 **POST**, 주소는 **localhost:3000/route/memos**, 하단부의 **raw**를 선택하고
가장 우측의 **TEXT**를 **JSON(application/json)**으로 선택한 후에 json 형식으로 작성을 합니다.
이후 `Send` 버튼을 클릭하면

![Postman8](./postman8.png)

#### 다음은 update(post) 컨트롤러(통째로 교환)를 추가하겠습니다.
```js
- ~/route/memos/controller/controller.js

...(생략)

// PUT '/route/memos/:id'
exports.update = (ctx) => {
  const { id } = ctx.params;
  const order = memos.findIndex(memo => memo.id.toString() === id);

  if (order === -1) {
    ctx.status = 404;
    ctx.body = { message: '메모가 없습니다' };
    return ;
  }

  memos[order] = { id, ...ctx.request.body };

  ctx.body = memos[order];
};
```
put 메소드는 id에 따른 특정 데이터를 `통째로 교환`을 합니다. 파라미터로부터 id를 받아오고
해당 아이디가 memos 객체 배열에서 몇 번째 인지를 **order**에 담고 `memos[order]`를 통해
memos 객체 배열에서 order의 id를 가진 데이터를 찾아 `ctx.request.body`에 담긴 내용으로
새로운 객체 `memos[order]` 를 생성하여 ctx.body로 날려줍니다.  
설명이 다소 복잡하지만 한 줄씩 읽어보면 그리 어려운 내용은 아닙니다(제가 이해했으므로!! ㅋㅋ)  

포스트맨에서 확인 해 보겠습니다.

![Postman9](./postman9.png)
위와 같이 메소드는 **PUT**, 주소는 **localhost:3000/route/memos/1**로 한 뒤 json 데이터를
위와 같이 입력한 후에 `Send` 버튼을 누르면 <font color="red">빨간 네모</font>와 같이 적용됨을
알 수 있습니다.  
주소에서 id 값을 `1`로 주었기에 id가 `1`인 객체를 찾아서 각 항목들이 덮어 씌워짐이 확인됩니다.

#### 다음은 patch(post) 컨트롤러(항목별 수정)를 추가해 보겠습니다.
```js
- ~/route/memos/controller/controller.js

...(생략)

// PATCH '/route/memos/:id'
exports.modify = (ctx) => {
  const { id } = ctx.params;
  const order = memos.findIndex(memo => memo.id.toString() === id);

  if (order === -1) {
    ctx.status = 404;
    ctx.body = { message: '메모가 없습니다' };
    return;
  }

  memos[order] = {
    ...memos[order],
    ...ctx.request.body
  };

  ctx.body = memos[order];
}
```
put과 동일하게 patch도 id가 memos 객체 배열에서 몇 번 째인지 확인 한 후에 기존 값인
**memos[order]**에서 변경된 **ctx.request.body** 내용을 수정합니다.  
포스트맨에서 확인해보겠습니다.

![Postman10](./postman10.png)
위와 같이 메소드는 **PATCH**, 주소는 **localhost:3000/route/memos/1**로 한 뒤 json 데이터를
위처럼 `author` 항목만 입력하여 `Send` 버튼을 눌러 확인합니다.
<font color="red">빨간 네모</font>와 같이 `author` 항목만 변경된 것을 알 수 있습니다.

#### 다음은 delete(post) 컨트롤러(remove)를 추가하겠습니다.
```js
- ~/route/memos/controller/controller.js

...(생략)

// DELETE '/route/memos/:id'
exports.remove = (ctx) => {
  const { id } = ctx.params;
  const order = memos.findIndex(memo => memo.id.toString() === id);

  if (order === -1) {
    ctx.status = 404;
    ctx.body = { message: '메모가 없습니다' };
    return;
  }

  memos.splice(order, 1);
  ctx.status = 204;
}
```
delete도 동일하게 id가 memos 객체 배열에서 몇 번 째인지 확인 한 후에 order번째 데이터를
삭제합니다. 기존 내용을 삭제하기 애매하므로 2번 id를 추가하여 삭제하겠습니다.

![Ctrl3](./ctrl3.png)
이후 포스트맨에서 2번 id를 삭제해 보겠습니다.

![Postman11](./postman11.png)
`Send` 버튼을 누른 후 브라우저에서 확인해 보겠습니다.

![Ctrl4](./ctrl4.png)
쨔란! 삭제가 정상적으로 잘 되었습니다.

이것으로 이번 포스트를 마치겠습니다