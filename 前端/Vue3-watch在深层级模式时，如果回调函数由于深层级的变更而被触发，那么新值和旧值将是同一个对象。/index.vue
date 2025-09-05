<template>
  <div class="search-container">
    <div class="row">
      <!-- 第一行左边的搜索卡片 -->
      <div class="card float-up">
        <div class="header">
          <div class="icon"></div>
          Search
          <gotohelp anchor="search" />
        </div>
        <div class="body">
          <div class="form">
            <div class="form-item">
              <div class="label"><b class="required">* </b>Tissue :</div>
              <el-select
                v-model="form.tissue.selected"
                filterable
                remote
                reserve-keyword
                placeholder=""
                remote-show-suffix
                style="width: 75%"
                :disabled="form.tissue.disabled"
              >
                <el-option
                  v-for="item in form.tissue.options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div :class="form.tissue.isdone ? 'done' : 'notdone'"></div>
            </div>
            <div class="form-item">
              <div class="label"><b class="required">* </b>Sample Type :</div>
              <el-select
                v-model="form.sample_type.selected"
                filterable
                remote
                reserve-keyword
                placeholder=""
                remote-show-suffix
                style="width: 75%"
                :disabled="form.sample_type.disabled"
              >
                <el-option
                  v-for="item in form.sample_type.options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div :class="form.sample_type.isdone ? 'done' : 'notdone'"></div>
            </div>
            <div class="form-item">
              <div class="label"><b class="required">* </b>Level :</div>
              <el-select
                v-model="form.rank.selected"
                filterable
                remote
                reserve-keyword
                placeholder=""
                remote-show-suffix
                style="width: 75%"
                :disabled="form.rank.disabled"
              >
                <el-option
                  v-for="item in form.rank.options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div :class="form.rank.isdone ? 'done' : 'notdone'"></div>
            </div>
            <div class="form-item">
              <div class="label"><b class="required">* </b>Taxa :</div>
              <el-select
                v-model="form.taxa.selected"
                filterable
                remote
                reserve-keyword
                placeholder=""
                remote-show-suffix
                style="width: 75%"
                :disabled="form.taxa.disabled"
              >
                <el-option
                  v-for="item in form.taxa.options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div :class="form.taxa.isdone ? 'done' : 'notdone'"></div>
              <!-- <el-select-v2
                v-model="taxa_selected"
                filterable
                :options="taxa"
                placeholder="Please enter a keyword"
                style="width: 75%"
              >
                <template #default="{ item }">
                  <span style="margin-right: 8px; color: black">{{ item }}</span>
                </template>
</el-select-v2> -->
            </div>
            <div class="form-item">
              <div class="label"><b class="required">* </b>HLA Class :</div>
              <el-select
                v-model="form.hla_class.selected"
                filterable
                remote
                reserve-keyword
                placeholder=""
                remote-show-suffix
                style="width: 75%"
                :disabled="form.hla_class.disabled"
              >
                <el-option
                  v-for="item in form.hla_class.options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div :class="form.hla_class.isdone ? 'done' : 'notdone'"></div>
            </div>
            <div class="form-item">
              <div class="label"><b class="required">* </b>HLA Allele :</div>
              <el-select
                v-model="form.hla_allele.selected"
                filterable
                remote
                reserve-keyword
                placeholder=""
                remote-show-suffix
                style="width: 75%"
                :disabled="form.hla_allele.disabled"
              >
                <el-option
                  v-for="item in form.hla_allele.options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div :class="form.hla_allele.isdone ? 'done' : 'notdone'"></div>
            </div>
          </div>
          <div class="btns">
            <button class="btn" @click="submit()">Submit</button>
            <button class="btn" @click="reset()">Example</button>
            <!-- <button class="btn">submit</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch, watchEffect } from "vue";
import router from "@/router";
import { getData } from "@/api/modules/getData";
import gotohelp from "@/components/gotohelp/index.vue";
import { cloneDeep } from "lodash-es";

// ------------------------------------ 强制用户按顺序填写表单 -------------------------------------------
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
function submit() {
  // Colorectal-Cancer_Genus_Fusobacterium_HLA-I_HLA-A02-01
  let query: any = {};
  for (let key in form.value) {
    let k = key as keyof typeof form.value;
    if (
      form.value[k]["selected"] !== "" &&
      form.value[k]["selected"] !== undefined &&
      form.value[k]["selected"] !== null &&
      typeof form.value[k]["selected"] !== "object"
    )
      query[key] = form.value[k]["selected"];
  }
  // 给 path 填充参数
  const href = router.resolve({
    path: `/search/searchResult`,
    query: query,
  }).href;
  //打开新的页面 到 href 这个页面
  window.open(href, "_blank");
}
function reset() {
  for (let key in form.value) {
    let k = key as keyof typeof form.value;
    form.value[k]["selected"] = exampleSelected[key];
  }
}
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
getData("/search/search_tree/tissue.json").then((res: any) => {
  let options = res;
  form.value.tissue.options = options;
});
// Colorectal-Cancer_Genus_Fusobacterium_HLA-I_HLA-A02-01
const tissue: any = ref([]);
const tissue_selected = ref(""); //Colorectal
// const tissue_selected = ref("Colorectal-Cancer");
const sample_type: any = ref([]);
const sample_type_selected = ref(""); // Tumor
const rank: any = ref([]);
const rank_selected = ref(""); //Genus
// const rank_selected = ref("Genus");
const taxa: any = ref([]);
let taxaRes: any = [];
const taxa_selected = ref(""); //Fusobacterium
// const taxa_selected = ref("Fusobacterium");
const hla_class: any = ref([]);
const hla_class_selected = ref(""); //HLA-I
// const hla_class_selected = ref("HLA-I");
const hla_allele: any = ref([]);
let hla_alleleRes: any = [];
const hla_allele_selected = ref(""); //HLA-A*02:01
// const hla_allele_selected = ref("HLA-A*02:01");
const submitForm_: any = computed(() => {
  return {
    tissue: tissue_selected.value,
    sample_type: sample_type_selected.value,
    rank: rank_selected.value,
    taxa: taxa_selected.value,
    hla_class: hla_class_selected.value,
    hla_allele: hla_allele_selected.value,
  };
});
let onFillingKey = "tissue";
function isDisabled(key: any) {
  if (key === onFillingKey) {
    return true;
  }
  return false;
}
// 按照 order 来依次解开 select 的 disable
// watch(submitForm, (newVal: any, oldVal: any) => {
//   const diffKey = diff(newVal, oldVal);
//   if (diffKey) {
//     // 找到 diffKey 在 order 中的位置
//     const index = order.indexOf(diffKey);
//     onFillingKey = order[index + 1];
//   }
// });

// 将下面的函数变成响应式
function isDone(value: any) {
  function isdone(value: any) {
    if (!value) {
      return false;
    }
    // 去除空格
    if (value.trim() === "") {
      return false;
    }
    return true;
  }
  return {
    done: isdone(value),
    notdone: !isdone(value),
  };
}
watchEffect(() => {});

// 请求下拉框列表
getData("/search/search.json").then((res: any) => {
  let json = res;
  tissue.value = json.tissue; //json.tissue;
  sample_type.value = json.sample_type;
  rank.value = json.rank;
  taxaRes = json.taxa;
  hla_class.value = json.hla_class;
  hla_alleleRes = json.hla_allele;
});
watch(rank_selected, (newVal: any, oldVal) => {
  taxa_selected.value = "";
  taxa.value = taxaRes[newVal];
});
watch(hla_class_selected, (newVal: any, oldVal) => {
  hla_allele_selected.value = "";
  // let arrs: any = hla_alleleRes.value[newVal];
  hla_allele.value = hla_alleleRes[newVal];
});
const defaultOptions: any = {
  tissue: "Colorectal",
  sample_type: "Tumor",
  rank: "Genus",
  taxa: "Fusobacterium",
  hla_class: "HLA-I",
  hla_allele: "HLA-A*02:01",
};
// function submit_() {
//   // Colorectal-Cancer_Genus_Fusobacterium_HLA-I_HLA-A02-01
//   console.log(submitForm);
//   let query: any = {};
//   for (let key in defaultOptions) {
//     query[key] = defaultOptions[key];
//   }
//   for (let key in submitForm.value) {
//     if (
//       submitForm.value[key] !== "" &&
//       submitForm.value[key] !== undefined &&
//       submitForm.value[key] !== null &&
//       typeof submitForm.value[key] !== "object"
//     )
//       query[key] = submitForm.value[key];
//   }
//   // 给 path 填充参数
//   const href = router.resolve({
//     path: `/search/searchResult`,
//     query: query,
//   }).href;
//   //打开新的页面 到 href 这个页面
//   window.open(href, "_blank");
// }
// function reset_() {
//   tissue_selected.value = "";
//   sample_type_selected.value = "";
//   rank_selected.value = "";
//   taxa_selected.value = "";
//   hla_class_selected.value = "";
//   hla_allele_selected.value = "";
// }
</script>

<style scoped>
.search-container {
  margin-left: 12vw;
  margin-right: 12vw;
  margin-top: 2vh;
  /* font-family: PangMenZhengDao; */
  min-height: 88vh;
}

.rounded-corner {
  border-radius: 10px;
  background-color: #fff;
}

.float-up {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
}

/* row1 */
.row {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}

.card {
  display: flex;
  flex-direction: column;
  width: 65%;
  background-color: #ffffff;
  /* border-radius: 2px; */

  .header {
    font-size: 1.4rem;
    font-weight: 800;
    background-color: #316198;
    color: #ffffff;
    text-align: left;
    align-items: center;
    padding-left: 2vw;
    padding-top: 2vh;
    padding-bottom: 2vh;
    display: flex;

    .icon {
      background-image: url("../../assets/images/2rearch-blue.png");
      background-size: 4vh 4vh;
      width: 4vh;
      height: 4vh;
      margin-right: 1vw;
    }
  }

  .body {
    padding: 30px 100px 50px 100px;
    /* font-size: 1vh;
      font-weight: 400; 
      text-align: justify;
      line-height: 2.7vh;
      display: flex; */

    .form {
      width: 100%;
      /* margin-bottom: 1vh; */
      display: flex;
      flex-direction: column;

      .form-item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        /* 水平 */
        align-items: center;
        /*  垂直 */
        margin-bottom: 2vh;
      }

      .required {
        color: red;
      }

      .label {
        width: 25%;
        font-size: 1rem;
        font-weight: 600;
        color: #32325d;
      }

      .notdone {
        background-image: url(../../assets/images/notdone.svg);
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        margin-left: 10px;
      }

      .done {
        background-image: url(../../assets/images/done.svg);
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        margin-left: 10px;
      }

      .search-input {
        height: 3vh;
        width: 75%;

        border-radius: 5px;
        border: 1px solid #ced4da;
      }

      .search-input:focus {
        /* border: 1px solid #c6e4e3; */
        outline: 2px solid rgba(0, 123, 255, 0.435);
        /* border-color: #80bdff; */
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      .search-input:focus::placeholder {
        color: #adb5bd;
      }
    }

    .btns {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: right;
    }

    .btn {
      width: 15%;
      height: 4.5vh;
      margin-top: 20px;
      margin-left: 20px;
      border-radius: 3px;
      border: 1px solid #ced4da;
      background-color: rgba(49, 97, 152, 1);
      color: aliceblue;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .btn:hover {
      /* 向上偏移2px */
      /* transform: translateY(-1px); */
      /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
       */
      /* 颜色 */
      background-color: rgba(74, 161, 204, 0.8);
    }

    .btn:active {
      /* 向下偏移2px */
      transform: translateY(1px);
      /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
    }

    .btn:focus {
      outline: none;
    }

    .btn:disabled {
      background: #ced4da;
      color: #adb5bd;
    }

    .btn:disabled:hover {
      transform: translateY(0);
    }
  }
}
</style>
