Modify accounts-guest to not depend on accounts-password. Instead,
on the server call:
```javascript
Accounts.registerLoginHandler("guest", function (options) {
  // TODO: If already logged in, return undefined
  // TODO: If !options.guest, return undefined
  // TODO: generate username
  var newUserId = Accounts.insertUserDoc(options, {
    username: generated_name
  });
  return { userId: newUserId };
});
```

And on the client call:

```javascript
Accounts.callLoginMethod({
  methodName: 'login', // This is the default
  methodArguments: [{ guest: true }],
  userCallback: function (error, result) {}
});
```
