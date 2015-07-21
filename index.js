/**
 * events.js
 *
 * Comments : Provides methods for event handling. Not meant to be used directly
 *
 */

var slice = Array.prototype.slice
var toString = Object.prototype.toString

/**
 * Provides methods for event handling. Not meant to be used directly.
 *
 * @mixin
 */
var events = {
  /**
   * @param {string} name
   * @param {function} cb
   * @param {obj} ctx
   */
  on: function (name, cb, ctx) {
    if ((typeof name !== 'string') &&
        (toString.call(cb) !== '[object Function]')) {
      return this
    }
    var channels = this._channels || (this._channels = {})
    if (!channels.hasOwnProperty(name)) { channels[name] = [] }
    channels[name].push({cb: cb, ctx: ctx || this})
    return this
  },
  /**
   * @param {string} name
   * @param {function} cb
   */
  off: function (name, cb) {
    if ((typeof name !== 'string') &&
        (toString.call(cb) !== '[object Function]')) {
      return this
    }
    var i, len, channel, channels
    channels = this._channels || (this._channels = {})
    channel = (channels.hasOwnProperty(name)) ? channels[name] : null
    if (channel) {
      for (i = 0, len = channel.length; i < len; i++) {
        if (channel[i].cb === cb) {
          channel.splice(i, 1)
        }
      }
    }
    return this
  },
  /**
   * @param {string} name
   * @param {function} cb
   * @param {obj} ctx
   */
  once: function (name, cb, ctx) {
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
  },
  /**
   * @param {string} name
   */
  trigger: function (name) {
    if (typeof name !== 'string') {
      return this
    }
    var i, len, args, copy, channel, channels
    args = slice.call(arguments, 1)
    channels = this._channels || (this._channels = {})
    channel = (channels.hasOwnProperty(name)) ? channels[name] : null
    if (channel) {
      copy = channel.slice()
      for (i = 0, len = copy.length; i < len; i++) {
        copy[i].cb.apply(copy[i].cxt, args)
      }
    }
    return this
  },
  /**
   * @param {object} obj
   * @param {string} name
   * @param {function} cb
   * @param {object} cxt
   */
  listen: function (obj, name, cb, cxt) {
    if ((typeof name !== 'string') &&
        (toString.call(cb) !== '[object Function]') &&
        (toString.call(obj) !== '[object Object]' && !(obj.hasOwnProperty('on')))) {
      return this
    }
    obj.on(name, cb, cxt)
    return this
  },
  /**
   * @param {object} obj
   * @param {string} name
   * @param {function} cb
   */
  stopListening: function (obj, name, cb) {
    if ((typeof name !== 'string') &&
        (toString.call(cb) !== '[object Function]') &&
        (toString.call(obj) !== '[object Object]' && !(obj.hasOwnProperty('off')))) {
      return this
    }
    obj.off(name, cb)
    return this
  },
  /**
   * @param {object} obj
   * @param {string} name
   * @param {function} cb
   * @param {object} ctx
   */
  listenOnce: function (obj, name, cb, ctx) {
    if ((typeof name !== 'string') &&
        (toString.call(cb) !== '[object Function]') &&
        (toString.call(obj) !== '[object Object]' &&
         !(obj.hasOwnProperty('listen')))) {
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
}

module.exports = events
