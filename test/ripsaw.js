var expect = require('chai').expect
var ripsaw = require('../ripsaw')

describe('Ripsaw', function () {

  var one
  var two
  var callback = function () { return null }

  beforeEach(function () {
    one = mixin({}, ripsaw)
    two = mixin({}, ripsaw)
  })

  describe('#on()', function () {
    it('should add an event to the channel', function () {
      one.on('foo', callback)
      expect(one._channels).to.have.property('foo')
        .with.length(1)
    })
    it('should be chainable', function () {
      expect(one.on('bar', callback)).to.equal(one)
    })
  })

  describe('#once()', function () {
    it('should excute then remove itself from the channel', function () {
      var control = false

      one.once('foo', function () { control = true })
      one.trigger('foo')
      expect(control).to.equal(true)

      control = false
      one.trigger('foo')
      expect(control).to.equal(false)
    })
    it('should be chainable', function () {
      expect(one.once('bar', callback)).to.equal(one)
    })
  })

  describe('#off()', function () {
    it('should remove an event from the channel', function () {
      one.on('foo', callback)
      expect(one._channels['foo']).to.have.length(1)
      one.off('foo', callback)
      expect(one._channels['foo']).to.have.length(0)
    })
    it('should be chainable', function () {
      expect(one.off('bar', callback)).to.equal(one)
    })
  })

  describe('#trigger()', function () {
    it('should excute the callbacks of an event', function () {
      var control = false
      one.on('foo', function () { control = true })
      one.trigger('foo')
      expect(control).to.equal(true)
    })
    it('should pass additional arguments to the callbacks', function () {
      var control = []
      one.on('foo', function (a, b) { control = [a, b] })
      one.trigger('foo', 'a', 'b')
      expect(control).to.be.a('array')
      expect(control).to.have.length(2)
      expect(control[1]).to.equal('b')
    })
    it('should be chainable', function () {
      expect(one.trigger('bar')).to.equal(one)
    })
  })

  describe('#listen()', function () {
    it('should add an event to a channel of another object', function () {
      one.listen(two, 'foo', callback)
      expect(two._channels['foo']).to.have.length(1)
    })
    it('should be executed when the listened to object triggers the event', function () {
      var control = false
      one.listen(two, 'foo', function () { control = true })
      two.trigger('foo')
      expect(control).to.equal(true)
    })
    it('should be chainable', function () {
      expect(one.listen(two, 'bar', callback)).to.equal(one)
    })
  })

  describe('#stopListening()', function () {
    it('should remove an event from the target object', function () {
      one.listen(two, 'foo', callback)
      expect(two._channels['foo']).to.have.length(1)
      one.stopListening(two, 'foo', callback)
      expect(two._channels['foo']).to.have.length(0)
    })
    it('should be chainable', function () {
      expect(one.stopListening(two, 'bar', callback)).to.equal(one)
    })
  })

  describe('#listenOnce()', function () {
    it('should execute and then remove itself from the target object', function () {
      var control = false
      var callback = function() { control = true }
      one.listenOnce(two, 'foo', callback)
      two.trigger('foo')
      expect(control).to.equal(true)
      control = false
      two.trigger('foo')
      expect(control).to.equal(false)
    })
    it('should be chainable', function () {
      expect(one.listenOnce(two, 'bar', callback)).to.equal(one)
    })
  })
})

function mixin (destination, source) {
  var key
  for (key in source) {
    if (source.hasOwnProperty(key) &&
        toString.call(source[key]) == '[object Function]') {
      destination[key] = source[key]
    }
  }
  return destination
}
