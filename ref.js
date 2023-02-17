/*eslint-disable */
const { trackRefValue, triggerRefValue } = require('./computed')

class RefImpl {
  __is_ref__ = true
  deps = null
  __value__

  constructor(source) {
    this.__value__ = source
  }

  get value() {
    trackRefValue(this)
    // console.log('track');
    return this.__value__
  }

  set value(v) {
    // console.log('before trigger');
    // console.log('after trigger');
    const oldValue = this.__value__
    this.__value__ = v
    if (v !== oldValue) {
      // 前后值不一样才trigger
      triggerRefValue(this, v, oldValue)
    }
  }
}

function ref(source) {
  return new RefImpl(source)
}

module.exports = {
  ref
}
