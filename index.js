/**
 * events.js
 *
 * Comments : 
 * 
 */

var slice = Array.prototype.slice
var toString = Object.prototype.toString

exports.on = function (name, cb, ctx) {
  try {
    var channels = this._channels || (this._channels = {})
    if (!channels.hasOwnProperty(name)) {
      channels[name] = []
    }
    channels[name].push({cb: cb, ctx: ctx || this})
  } catch (e) {
    handleError('on', e, {name: name, cb: cb})
  }
  return this  
}

exports.off = function (name, cb, ctx) {
  try {
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
  } catch (e) {
    handleError('off', e, {name: name, cb: cb})
  }
  return this
}

exports.once = function (name, cb, ctx) {
  try {
    var off = this.off.bind(this)
    var modified = function () {
      cb.apply(this, arguments)
      off(name, modified)
    }
    this.on(name, modified, ctx)
  } catch (e) {
    handleError('once', e, {name: name, cb: cb})
  }
  return this
}

exports.trigger = function (name) {
  try {
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
  } catch (e) {
    handleError('trigger', e, {name: name})
  }
  return this
}

exports.listen = function (obj, name, cb, cxt) {
  try {
    obj.on(name, cb, cxt)
  } catch (e) {
    handleError('listen', e, {obj: obj, name: name, cb: cb})
  }
  return this
}

exports.stopListening = function (obj, name, cb) {
  try {
    obj.off(name, cb)
  } catch (e) {
    handleError('stopListening', e, {obj: obj, name: name, cb: cb})
  }
  return this
}

exports.listenOnce = function (obj, name, cb, ctx) {
  try {
    var stopListening = this.stopListening.bind(this)
    var modified = function () {
      cb.apply(this, arguments)
      stopListening(obj, name, modified)
    }
    this.listen(obj, name, modified, ctx)
  } catch (e) {
    handleError('listenOnce', e, {obj: obj, name: name, cb: cb})
  }
  return this
}

function handleError (methodName, error, args) {
  var key
  for (key in args) {
    switch (key) {
    case 'name':
      if (typeof args['name'] !== 'string') {
        console.log('events#' + methodName +
                    ' received a channel name which is not a string')
      }
      break
    case 'cb':
      if (toString.call(args['cb']) !== '[object Function]') {
        console.log('events#' + methodName +
                    ' received a callback which is not a function')
      }
      break
    case 'obj':
      if (toString.call(args['obj']) !== '[object Object]' &&
          !args['obj'].hasOwnProperty(methodName)) {
        console.log('events#' + methodName +
                    ' received a obj argument which is not of events')
      }
      break
    }
    console.log(error)
  }
}
