
A single page application to encourage habits that might lead to a longer, healthier life.

*This is very much under construction!*

=== Running Tests ===

One time only:

```sh
$ cd ./tests/cucumber
$ npm install
$ tsc
```

If you aren't using an IDE that automatically transpiles Typescript to Javascript, then
you'll need to do it manually whenever you change a Typescript file:

```sh
$ cd ./tests/cucumber
$ tsc
```

Hopefully, none of the above will be needed once Meteor's Velocity testing framework matures.
