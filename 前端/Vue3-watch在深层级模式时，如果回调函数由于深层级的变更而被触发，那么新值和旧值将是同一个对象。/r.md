```
const order = ["tissue", "sample_type", "rank", "taxa", "hla_class", "hla_allele"];
const form = ref({
  tissue: {
    options: [] as any[],
    selected: "",
    disabled: false,
    isdone: false,
  },
  sample_type: {
    options: [] as any[],
    selected: "",
    disabled: true,
    isdone: false,
  },
  rank: {
    options: [] as any[],
    selected: "",
    disabled: true,
    isdone: false,
  },
  taxa: {
    options: [] as any[],
    selected: "",
    disabled: true,
    isdone: false,
  },
  hla_class: {
    options: [] as any[],
    selected: "",
    disabled: true,
    isdone: false,
  },
  hla_allele: {
    options: [] as any[],
    selected: "",
    disabled: true,
    isdone: false,
  },
});
const exampleSelected: any = {
  tissue: "Colorectal",
  sample_type: "Tumor",
  rank: "Genus",
  taxa: "Fusobacterium",
  hla_class: "HLA-I",
  hla_allele: "HLA-A*02:01",
};
// 保存初始克隆对象
let oldSnapshot = cloneDeep(form.value);
function diff(newVal: any, oldVal: any) {
  debugger;
  let key = undefined;
  for (let i = 0; i < order.length; i++) {
    let k = order[i] as keyof typeof form.value;
    if (newVal[k]["selected"] !== oldSnapshot[k]["selected"]) {
      key = k;
      break;
    }
  }
  oldSnapshot = cloneDeep(newVal);
  return key;
}
// Vue3-watch在深层级模式时，如果回调函数由于深层级的变更而被触发，那么新值和旧值将是同一个对象。
watch(
  () => form.value,
  (newVal: any) => {
    const key = diff(newVal, oldSnapshot);
    if (!key || key === "") return;
    const index = order.indexOf(key);
    for (let i = 0; i <= index; i++) {
      let k = order[i] as keyof typeof form.value;
      form.value[k]["disabled"] = false;
      form.value[k]["isdone"] = true;
    }
    // @ts-ignore
    form.value[order[index + 1]]["disabled"] = false;
    for (let i = index + 2; i < order.length; i++) {
      let k = order[i] as keyof typeof form.value;
      form.value[k]["disabled"] = true;
      form.value[k]["selected"] = "";
      form.value[k]["isdone"] = false;
    }
  },
  { deep: true }
);
```

