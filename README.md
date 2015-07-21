Ripsaw
======

Ripsaw is a simple events system. Its purpose is to help the author learn event
patterns. Its design was inspired by the event system used by Backbone. Though its
design emphasizes simplicity over performance.

Usage
-----

The module is intended to be used as a mixin with a singleton object or a constructor
to provide event methods. Before execution each method checks its arguments to insure
they are appropriate. Either way it returns 'this' to allow chainable calls.

Testing
-------

I am currently constructing a set of simple tests for each method.
