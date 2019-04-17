---
title: MobX 블로그-3(JWT 미들웨어)
subTitle: Mobx-Blog(백엔드-3)
category: "Blog Making"
cover: logo.jpg
---

## JWT 미들웨어
우선 계정인증에 사용할 JWT 미들웨어를 먼저 만들겠슴다.

```js
- file: /mobx-blog/server/jwt/jwt_token.js

import jwt from 'jsonwebtoken'

/**
 * JWT 토큰 만들기
 * @param {any} payload
 * @returns {string} token
*/
function generateToken (payload) {
  return new Promise((resolve, reject) => {
    // jwt.sign(토큰에 들어갈 데이터, 비밀키, 옵션, 콜백함수)
    jwt.sign(payload, process.env.JWT_SECRET, {
      // 만료는 7일
      expiresIn: '7d'
    }, (error, token) => {
      if (error) reject(error)
      resolve(token)
    })
  })
}
```

jwt.sign 함수의 인자는 아래와 같습니다.

* 1번: 토큰에 들어갈 데이터
* 2번: 비밀키
* 3번: 옵션
* 4번: 콜백함수

자세한 내용은 [jwt.io](https://jwt.io/)를 방문하시면 됩니다!  
우선 만료는 7일로 설정했구요. 처음 프로젝트 구성 당시 만든 `nodemon.json`안의
`JWT_SECRET`을 비밀키 값으로 넣어줬습니다.

이어서 생성된 토큰 해석함수 및 서버에서 사용할 미들웨어를 생성합니다.

```js
- file: /mobx-blog/server/jwt/jwt_token.js
(...이어서)

function decodeToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error)
      resolve(decoded)
    })
  })
}

exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token')

  if (!token) return next()

  try {
    const decoded = await decodeToken(token)

    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      const { _id, email } = decoded
      const newToken = await generateToken({ _id, email }, 'User')

      ctx.cookies.set('access_token', newToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
    }

    ctx.request.user = decoded
  } catch (err) {
    ctx.request.user = null
  }

  return next()
}

exports.generateToken = generateToken
```

쿠키 정보에서 `access_token`을 가져오고 토큰이 없을 시 아래로 내려갑니다!


그리고 미들웨어에서 보시면 iat 가 나오는데 이는 토큰 발급 시간을 뜻합니다.  
즉 만료일이 1일 남았을 시 토큰을 재 발행하는 것을 의미하죠!

또한 토큰에 담을 정보, 즉 **payload**는 아래와 같습니다.

* iss: 토큰 발급자
* sub: 토큰 제목
* aud: 토큰 대상자
* exp: 토큰 만료 시간
* nbf: Not Before 토큰의 활성날짜
* iat: 토큰 발급시간
* jti: jwt 고유 식별자

다음 포스트에서 이 미들웨어를 서버에 적용하고 사용자 모델을 만들어 계정 인증 절차를 할게요~! 뿅~!!