/*eslint-disable */
const { ReactiveEffect, setActiveEffect, getActiveEffect, getReactiveMap } = require('./reactive');
const { queueJob } = require('./scheduler');

function track() {}

function trigger() {}

class ComputedRefImpl {
  __value__ = null;
  __getter = null;
  __is_ref__ = true;
  deps = null;

  constructor(getter) {
    this.__getter = getter;
    const job = () => {
      const newV = this.__getter();
      console.log(this.__getter._fn(), 'show this.__getter()._fn()');
      const oldV = this.__value__;
      this.__value__ = newV;
      console.log({ newV, oldV }, 'in computed job');
      if (newV !== oldV) triggerRefValue(this, newV, oldV);
    };

    const __scheduler = () => {
      job();
      // queueJob(job)
    };
    const reactiveEffect = new ReactiveEffect(this.__getter, __scheduler);
    const value = reactiveEffect.run();
    this.__value__ = value;
  }

  get value() {
    trackRefValue(this);
    return this.__value__;
  }
}

function trackRefValue(ref) {
  const activeEffect = getActiveEffect();
  // 需要判断去重吗？
  if (activeEffect) ref.deps = ref.deps ? [...ref.deps, activeEffect] : [activeEffect];
}

function triggerRefValue(ref, newV, oldV) {
  const deps = ref.deps;
  deps &&
    deps.length !== 0 &&
    deps.forEach((dep) => {
      dep && dep.scheduler(newV, oldV);
    });
}

function computed(getter) {
  return new ComputedRefImpl(getter);
}

// eslint-disable-next-line no-restricted-globals
module.exports = {
  computed,
  trackRefValue,
  triggerRefValue,
};
