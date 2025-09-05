





---



当你使用 **解构赋值**（destructuring）从一个由 `reactive()` 创建的响应式对象中提取属性时，**解构出来的变量会失去响应性**。

```
import { reactive, watch } from 'vue'

const state = reactive({
  name: 'Alice',
  age: 25
})

// 解构赋值
const { name, age } = state

// 修改原始 state
setTimeout(() => {
  state.name = 'Bob' // 响应式更新
}, 1000)

// 监听解构后的变量
watch(() => name, (newVal) => {
  console.log('name changed:', newVal) // ❌ 不会触发！
})
```

从而促使 Vue3 开发这两个 API ： `toRefs` 和 `toRef`

