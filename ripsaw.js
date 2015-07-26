/**
 * ripsaw.js - An event system.
 */

var slice
var toString
var hOP

slice = Array.prototype.slice
toString = Object.prototype.toString
hOP = Object.prototype.hasOwnProperty

var ripsaw = {}

ripsaw.on = function (name, cb, ctx) {
  if ((typeof name !== 'string') &&
      (toString.call(cb) !== '[object Function]')) {
    return this
  }
  var channels = this._channels || (this._channels = {})
  if (!hOP.call(channels, name)) { channels[name] = [] }
  channels[name].push({cb: cb, ctx: ctx || this})
  return this
}

ripsaw.off = function (name, cb) {
  if ((typeof name !== 'string') &&
      (toString.call(cb) !== '[object Function]')) {
    return this
  }
  var i, len, channel, channels
  channels = this._channels || (this._channels = {})
  channel = (hOP.call(channels, name)) ? channels[name] : null
  if (channel) {
    for (i = 0, len = channel.length; i < len; i++) {
      if (channel[i].cb === cb) {
        channel.splice(i, 1)
      }
    }
  }
  return this
}

ripsaw.once = function (name, cb, ctx) {
  if ((typeof name !== 'string') &&
      (toString.call(cb) !== '[object Function]')) {
    return this
  }
  var off = this.off.bind(this)
  var modified = function () {
    cb.apply(this, arguments)
    off(name, modified)
  }
  this.on(name, modified, ctx)
  return this
}

/**
 * Create a copy of the channel array and iterate through it, applying each
 * callback within the context and providing the additional arguments
 * given to #trigger. The copy is created to avoid #once and #listenOnce from
 * messing up the index when they remove themselves from a channel.
 */
ripsaw.trigger = function (name) {
  if (typeof name !== 'string') {
    return this
  }
  var i, len, args, copy, channel, channels
  args = slice.call(arguments, 1)
  channels = this._channels || (this._channels = {})
  channel = (hOP.call(channels, name)) ? channels[name] : null
  if (channel) {
    copy = channel.slice()
    for (i = 0, len = copy.length; i < len; i++) {
      copy[i].cb.apply(copy[i].cxt, args)
    }
  }
  return this
}

ripsaw.listen = function (obj, name, cb, cxt) {
  if ((typeof name !== 'string') &&
      (toString.call(cb) !== '[object Function]') &&
      (toString.call(obj) !== '[object Object]' && !(hOP.call(obj, 'on')))) {
    return this
  }
  obj.on(name, cb, cxt)
  return this
}

ripsaw.stopListening = function (obj, name, cb) {
  if ((typeof name !== 'string') &&
      (toString.call(cb) !== '[object Function]') &&
      (toString.call(obj) !== '[object Object]' && !(hOP.call(obj, 'off')))) {
    return this
  }
  obj.off(name, cb)
  return this
}

ripsaw.listenOnce = function (obj, name, cb, ctx) {
  if ((typeof name !== 'string') &&
      (toString.call(cb) !== '[object Function]') &&
      (toString.call(obj) !== '[object Object]' &&
       !(hOP.call(obj, 'listen')))) {
    return this
  }
  var stopListening = this.stopListening.bind(this)
  var modified = function () {
    cb.apply(this, arguments)
    stopListening(obj, name, modified)
  }
  this.listen(obj, name, modified, ctx)
  return this
}

module.exports = ripsaw
