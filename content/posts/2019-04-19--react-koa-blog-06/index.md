---
title: MobX 블로그 - 6(백엔드-6)
subTitle: Mobx-Blog(백엔드-6)
category: "Blog Making"
cover: logo.png
---

## RestAPI Login (로그인)
이번엔 사용자 로그인입니다. *email*과 *password*를 받아와서 `email` 을 확인하고 기존에 `User` 메소드로 만든 `validatePassword` 함수로 비교를 한 후 토큰 생성 -> 쿠키에 저장입니다!

우선 매우 치죠!

```js
- file: /mobx-blog/server/api/auth/auth.ctrl.js
(...생략)

// 로그인 (POST) API '/api/auth/login'
exports.login = async (ctx) => {
// 데이터 검증
  const data = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  const result = Joi.validate(ctx.request.body, data)

  if (result.error) {
    // 400: 잘못된 요청
    ctx.status = 400
    return
  }

  // email, password를 리퀘스트에서 받아옴
  const { email, password } = ctx.request.body

  let user = null

  try {
    user = await User.findByEmail(email)
  } catch (err) {
    ctx.throw(500, err)
  }

  // 사용자 해싱 비밀번호 비교(모델 메소드)
  if (!user || !user.validatePassword(password)) {
    // 403: 권한없음
    ctx.status = 403
    return
  }

  // 토큰 생성 및 쿠키에 저장
  let token = null

  try {
    token = await user.generateToken()
  } catch (err) {
    ctx.throw(500, err)
  }

  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
  })
  ctx.body = user
}

(...생략)
```

생각보다 간단합니다.

그리고 이보다 더 쉬운 로그아웃과 현 접속된 사용자 체크도 만들게요!

```js
- file: /mobx-blog/server/api/auth/auth.ctrl.js
(...생략)

// 로그아웃 (POST) API '/api/auth/logout'
exports.logout = async (ctx) => {
  ctx.cookies.set('access_token', null, {
    httpOnly: true,
    maxAge: 0
  })

  // 204: 컨텐츠 없음
  ctx.status = 204
}

// 사용자 접속 확인 (GET) API '/api/auth/check'
exports.check = (ctx) => {
  const { user } = ctx.request

  if (!user) {
    ctx.body = ''
    return
  }

  ctx.body = user
}

(...생략)
```

로그아웃은 쿠키에 저장된 `access_token`을 0으로 만들어버리고 토큰 값을 null로 하면 되며, 현 사용자 확인은 리퀘스트에서 user를 받아와 뿌리면 끝~!

이로써 회원가입, 로그인, 로그아웃 등의 JWT 인증은 끝입니다.

다음 포스트부터는 게시판을 만들게요~!