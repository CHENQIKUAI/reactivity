/*eslint-disable */
const { queueJob } = require('./scheduler')
let activeEffect = null

const setActiveEffect = v => {
  activeEffect = v
}

const getActiveEffect = () => activeEffect

class ReactiveEffect {
  constructor(fn, scheduler) {
    this.fn = fn
    this.scheduler = scheduler
  }
  run() {
    try {
      activeEffect = this
      console.log(!!activeEffect, 'before');
      return this.fn()
    } finally {
      console.log(!!activeEffect, 'after');
      activeEffect = null
    }
  }
}

const reactiveMap = new WeakMap()
function getReactiveMap() {
  return reactiveMap
}

function reactive(data) {
  data.__reactive__ = true
  return new Proxy(data, {
    get(target, p, receiver) {
      if (p === '__reactive__') {
        return data[p]
      }
      if (activeEffect) {
        if (!reactiveMap.has(data)) {
          const dataMap = new Map()
          const deps = new Set()
          deps.add(activeEffect)
          dataMap.set(p, deps)
          reactiveMap.set(data, dataMap)
        } else {
          const dataMap = reactiveMap.get(data)
          const deps = dataMap.get(p)
          if (!deps) {
            dataMap.set(p, new Set([activeEffect]))
          } else {
            deps.add(activeEffect)
            dataMap.set(p, deps)
          }
        }
      }

      return data[p]
    },
    set(target, p, newValue) {
      const oldValue = data[p]
      data[p] = newValue
      if (oldValue !== newValue) {
        // 前后值不一样才trigger
        const dataMap = reactiveMap.get(data)
        if (dataMap) {
          const deps = dataMap.get(p)
          const s = new Set()
          if (deps)
            deps.forEach(
              i => i && i.scheduler && i.scheduler(newValue, oldValue)
            )
          const deps2 = dataMap.get('__iterator__') || []
          deps2.forEach(i => i && i.scheduler && i.scheduler(target))
        }
      }
    },
    ownKeys(target) {
      const isObj = value =>
        Object.prototype.toString.call(value) ===
        Object.prototype.toString.call({})
      if (activeEffect) {
        if (isObj(target)) {
          const dataMap = reactiveMap.get(target)
          if (!dataMap) {
            const dataMap = new Map()
            reactiveMap.set(target, dataMap)
            dataMap.set('__iterator__', new Set([activeEffect]))
          } else {
            const deps = dataMap.get('__iterator__') || []
            deps.add(activeEffect)
            dataMap.set('__iterator__', deps)
          }
        } else if (Array.isArray(target)) {
        }
      }

      return Reflect.ownKeys(target)
    }
  })
}

module.exports = {
  ReactiveEffect,
  reactive,
  setActiveEffect,
  getActiveEffect,
  getReactiveMap
}
