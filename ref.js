/*eslint-disable */
const { trackRefValue, triggerRefValue } = require('./computed');

class RefImpl {
  __is_ref__ = true;
  deps = null;
  __value__;

  constructor(source) {
    this.__value__ = source;
  }

  get value() {
    trackRefValue(this);
    // console.log('track');
    return this.__value__;
  }

  set value(v) {
    triggerRefValue(this, v, this.__value__);
    // console.log('trigger');
    this.__value__ = v;
  }
}

function ref(source) {
  return new RefImpl(source);
}

module.exports = {
  ref,
};
