### setup

```cmd
npm init -y
npm i typescript -D
npx tsc --init
```

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

```json
{
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsc -w && node ./dist/index.js",
    "build": "tsc"
  },
}
```

```cmd
npm run serve
tsc -w & node ./dist/index.js
```
----

### referece:

```
https://console.cloud.google.com/  // google credentials
google oauth2 passport nodejs
How to Setup Node.js with TypeScript in 2023
TypeScript with Node.js
How To Use TypeScript With Express & Node
OAuth (Passport.js) Tutorial #3 - Settingup an Express App
Passport GoogleStrategy/FacebookStrategy “InternalOAuthError: Failed to obtain access token“ 解决方案
TypeError: req.session.regenerate is not a function using Passport

passport-oauth2/issues/59
```

### .env
```
GOOGLE_CLIENT_ID = xx
GOOGLE_CLIENT_SECRET = xx
HTTP_PROXY = xx
```
1. 中国区需要设置代理 参见 passport-oauth2/issues/59 / googleStrategy._oauth2.setAgent(agent)
2. google credentials 设置GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET

process.env
```
-- GOOGLE_CLIENT_ID
-- GOOGLE_CLIENT_SECRET
-- HTTP_PROXY
-- MONGODB_URI
-- SESSION_COOKIE_KEY
```

### cookie-session vs express-session

`express-session` 和 `cookie-session` 是两个不同的 Node.js 中间件，它们都用于处理会话（session），但是它们的工作方式有所不同。

1. `express-session`：这个中间件在服务器端存储会话数据，而在客户端的 cookie 中只存储一个会话 ID。当请求到达服务器时，服务器会使用 cookie 中的会话 ID 来检索会话数据。这意味着你可以在会话中存储大量数据，而不会影响到客户端的 cookie 大小。然而，这也意味着你需要在服务器端管理会话数据的存储，这可能会涉及到使用数据库。

2. `cookie-session`：这个中间件将所有会话数据都存储在客户端的 cookie 中。这意味着你不需要在服务器端存储任何会话数据，这可以简化你的应用程序。然而，由于浏览器对 cookie 大小有限制（通常为 4KB），所以你只能在会话中存储有限的数据。此外，虽然 `cookie-session` 会对存储在 cookie 中的数据进行签名，以防止被篡改，但是这些数据对客户端来说仍然是可见的，所以你不应该在会话中存储敏感信息。

总的来说，你应该根据你的应用程序的需求来选择使用哪一个中间件。如果你需要在会话中存储大量数据，或者你需要存储敏感信息，那么 `express-session` 可能是一个更好的选择。如果你的会话数据很小，并且你希望简化你的应用程序，那么 `cookie-session` 可能是一个更好的选择。

### challenge
中国区google、facebook、github需要代理设置 OAuth2实例上的_oauth2.setAgent(agent)
[ broken change ]passport 0.6+ bug req.session.regenerate is not a function 
```cmd
npm uninstall passport
npm install passport@0.5
```
or rewrite session.regenerate
https://stackoverflow.com/questions/72375564/typeerror-req-session-regenerate-is-not-a-function-using-passport
```js
// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})
```
error-reqlogout-requires-a-callback-function
https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
```js
app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
```

cookie-session 中间件会将 req.session 对象序列化并加密，然后将结果存储在客户端的 cookie 中。当客户端在后续的请求中发送这个 cookie 时，cookie-session 会自动对其进行解密，并将解密后的结果反序列化为 req.session 对象。  当你调用 req.logout() 时，Passport.js 会清除 req.user 和 req.session 中的用户信息。这意味着，当客户端下次带着旧的 cookie 发送请求时，服务器将无法从这个 cookie 中恢复出有效的用户会话，因为会话信息已经被清除了。这就是 req.logout() 如何实现注销功能的。  需要注意的是，虽然 req.logout() 会清除服务器端的会话信息，但它并不会自动清除客户端的 cookie。客户端的 cookie 只有在达到其设定的过期时间，或者被客户端明确删除后，才会被清除。因此，即使用户已经注销，客户端的 cookie 可能仍然存在，只是它包含的会话信息已经无效了。