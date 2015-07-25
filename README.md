Ripsaw
======

Ripsaw is a simple events system. Its purpose is to help the author learn event
patterns. Its design was inspired by the Backbone events, though it emphasizes
simplicity over performance.

Usage
-----

The module is intended to be used as a mixin with a singleton or a constructor
to provide event methods. Before execution each method checks its arguments to
insure they are appropriate. If not, it fails quitly and returns `this` just
like normal for chainable calls.

Testing
-------

Insure devDependencies are installed, currently useing mocha and chai.
Use `npm test` to run tests.

