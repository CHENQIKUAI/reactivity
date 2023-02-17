/*eslint-disable */
const { ReactiveEffect, getActiveEffect } = require('./reactive')

function track() {}

function trigger() {}

class ComputedRefImpl {
  __value__ = null
  __getter = null
  __is_ref__ = true
  deps = null
  _dirty = false

  constructor(getter) {
    this.__getter = getter
    this.reactiveEffect = new ReactiveEffect(this.__getter, () => {
      console.log('in computed scheduler')
      triggerRefValue(this)
    })
  }

  get value() {
    trackRefValue(this)
    const value = this.reactiveEffect.run()
    this.__value__ = value
    return this.__value__
  }
}

function trackRefValue(ref) {
  const activeEffect = getActiveEffect()
  // 需要判断去重吗？
  // 试试去重？
  if (activeEffect) {
    ref.deps = ref.deps
      ? new Set([...ref.deps, activeEffect])
      : new Set([activeEffect])
  }
}

function triggerRefValue(ref, newV, oldV) {
  const deps = ref.deps
  deps &&
    deps.length !== 0 &&
    deps.forEach(dep => {
      dep && dep.scheduler(newV, oldV)
    })
}

function computed(getter) {
  return new ComputedRefImpl(getter)
}

// eslint-disable-next-line no-restricted-globals
module.exports = {
  computed,
  trackRefValue,
  triggerRefValue
}
