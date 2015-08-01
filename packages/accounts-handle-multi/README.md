# accounts-handle-multi
============

Sanely handles users that login using multiple services.

## Features
- When a logged in user tries to login using
  credentials that don't belong to an existing user, add those credentials to
  the logged in user, so they can be used for future logins.
- When a logged in user tries to login using
  credentials that do belong to an existing user, switch to the user with those
  credentials (and remove any "guest" user that is abandoned as a result).
- Should work with any login service (accounts-password, acccounts-google, etc.)
- Should work with accounts-ui and other similar packages.
- Does not monkey patch Meteor core.

## Installation
```sh
TODO: meteor add brettle:accounts-handle-multi
```

## FAQ

- What is a "guest" user?
  - A user whose user record contains only the service "resume". That means that
    the user's can only login from the computer/browser they are currently using.
    For some apps, it can be useful to start all new visitors as guest users
    that they can then supplement with other login services when they want.

- What is an "abandoned" guest user?
  - A guest user that can't login anymore. This occurs when a non-guest user
    goes to a new browser/computer and visits the app. Initially, he will be a
    new guest user. When he logs in using his credentials, the token stored
    in his browser that would have allowed him to automatically login as the guest
    user is overwritten with the token that allows him to automatically login as
    himself. As a result, he can't become that guest user anymore, and there is
    typically no point in keeping it around, so we delete it.

## TODO

- Allow the default behavior to be replaced or supplemented.
  Maybe a `AccountsHandleMulti.handleMultipleLogin(func)` and
  `AccountsHandleMulti.onGuestAbandoned(func)`
