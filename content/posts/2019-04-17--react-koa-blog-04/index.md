---
title: MobX 블로그 - 4(백엔드-4)
subTitle: Mobx-Blog(백엔드-3)
category: "Blog Making"
cover: logo.jpg
---

## User 스키마 모델 생성
이전 포스트에서 말했듯이 오늘은 `User` 모델을 만들고 모델 메소드를 같이 만들겠습니다.

```js
- file: /mobx-blog/server/models/User.js

import mongoose from 'mongoose'
import crypto from 'crypto'

// JWT 토큰생성 함수
import { generateToken } from 'jwt/token'

const User = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})
```

일단은 가벼웁게 모델을 만들고 저번에 만들어둔 JWT 미들웨어의 `generateToken`을 가져옵니다.

비밀번호 해싱 처리를 위해 **crypto** 모듈을 사용할 거구요(crypto는 node.js 기본 내장입니다)

이어서 비밀번호 해싱 처리 함수를 추가합니다.

```js
- file: /mobx-blog/server/models/User.js
(...이어서)

function hash (password) {
  return crypto.createHmac(
    'sha256',
    process.env.SECRET_KEY
  ).update(password).digest('hex')
}
```

프로젝트 생성시에 만들어 두었던 `.env` 파일에서 **SECRET_KEY**를 가져와서 비밀번호를 해싱처리하죠!

이어서 사용자 모델 메소드를 만들건데요. `mongoose` 모델에서 사용하는 메소드는 아래와 같슴다.

> statics: CRUD 하는 메소드와 같이 모델 변수에서 전역으로 사용  
> methods: document를 CRUD 하여 나타낸 객체를 연산할 때 사용

```js
- file: /mobx-blog/server/models/User.js
(...이어서)

// Email 주소로 사용자 검색
User.statics.findByEmail = function (email) {
  return this.findOne({ email }).exec()
}

// 사용자 등록 메소드
User.statics.register = function ({ username, email, password }) {
  const user = new this({
    username, email,
    password: hash(password)
  })
  return user.save()
}

// 비밀번호 비교 메소드
User.methods.validatePassword = function (password) {
  const contrast = hash(password)

  return this.password === contrast
}

// jwt payload로 토큰 발행
User.methods.generateToken = function () {
  const payload = {
    _id: this._id,
    email: this.email
  }
  return generateToken(payload, 'User')
}

export default mongoose.model('User', User)
```

보시다시피 비밀번호 해싱 함수를 사용하여 사용자를 생성하도록 했고 비밀번호 비교시에도 기존의 비밀번호와 입력된 비밀번호를 다시 해싱처리 하여 비교하도록 함수를 만들었습니다.

이후 토큰 발행시 쿠키에 담을 토큰에 `User` 모델의 **_id, email** 값을 담아주도록 할게요!

그럼 다음 포스트에서 이 모델과 JWT 미들웨어를 사용하여 사용자 계정 인증 API를 구성하겠습니다.