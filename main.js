/*eslint-disable */
const env = {
  my: './myVue.js',
  vue: '../../packages/vue/dist/vue.cjs'
}

{
  let { watch, reactive, computed, ref, s } = require(env.my)
  console.log(s)

  s = 3
  console.log(s)

  // const womenCount = ref(40)

  // const bigCalc = computed(() => {
  //   let count = 0
  //   for (let i = 0; i < 100000; ++i) {
  //     count += womenCount.value
  //   }
  //   return count
  // })

  // watch(bigCalc, (n, old) => {
  //   womenCount.value++
  //   console.log(n, old, '+++++++++++++++++++++++')
  // })
  // womenCount.value++
}

// {
//   const count = ref(0)
//   const fn = () => count.value + '++'
//   const ss = computed(fn)
//   watch(ss, n => {
//     console.log(n, '+++++++++++++++++++++++')
//   })
//   count.value = 10
//   count.value = 0
// }

// {
//   const count = reactive({ value: 0 })
//   const p1 = computed(() => count.value + 1)

//   watch(p1, v => {
//     console.log('count change', v)
//   })
//   count.value = 10
//   count.value = 0
// }

{
}

{
}

{
}

/**
 * 要注册的回调函数都是放在activeEffect里，供需要的使用
 */

/**
 * 响应式数据帮助一个数据的属性在被修改时，能够回调事先所指定的函数。
 * 如何成为一个响应式数据？
 * 访问我时，把事先指定的函数收集起来，将它和我及我的属性关联起来。
 * 修改我的属性时，找到我的属性关联的函数并执行。
 *
 * 访问和修改可以通过Proxy代理来处理。get和set分别劫持访问和修改属性。
 * 函数的收集和关联可以通过，一个weakMap对象，存储key为响应式对象，存储value为一个“key为响应式对象属性名称，value为函数集合的Map对象”来处理。
 */
