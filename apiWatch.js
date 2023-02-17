/*eslint-disable */
const { ReactiveEffect, getActiveEffect } = require('./reactive');
const { queueJob } = require('./scheduler');

const watch = (source, cb) => {
  const getter = () => {
    if (Array.isArray(source)) {
      return source.map((i) => i);
    } else if (typeof source === 'function') {
      const ret = source();
      // console.log('getter called', ret);
      return ret;
    } else if (source.__reactive__) {
      traverse(source);
      return source;
    } else if (source.__is_ref__) {
      return source.value;
    }
  };
  let newValue, oldValue;
  function job() {
    oldValue = newValue;
    newValue = reactiveEffect.run();
    console.log({ newValue, oldValue }, 'in job');
    if (newValue !== oldValue) cb(newValue, oldValue);
  }
  job.allowRecurse = true;
  const scheduler = () => {
    console.log('in scheduler');
    queueJob(job);
  };
  const reactiveEffect = new ReactiveEffect(getter, scheduler);

  newValue = reactiveEffect.run();
  console.log(newValue, 'shwo newValue after first run in apiWatch');
};

function traverse(source) {
  const isObj = (value) => Object.prototype.toString.call(value) === Object.prototype.toString.call({});
  if (isObj(source)) {
    for (let v in source) {
      traverse(v);
    }
  }
}

module.exports = {
  watch,
};
