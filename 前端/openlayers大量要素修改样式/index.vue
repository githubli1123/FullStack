<template>
  <div class="main-container">
    <div class="left-side">
      <panel-item title="图层">
        <el-tree
          class="mytree"
          ref="treeRef"
          :props="props"
          :data="treeData"
          show-checkbox
          default-expand-all
          @check-change="handleCheckChange"
          node-key="id"
        />
      </panel-item>
    </div>
    <div class="right-side">
      <panel-item title="图例" style="width: 150px" v-if="showMarkFlag">
        <div
          class="mark-item"
          v-for="(item, index, key) in treeData[6].children[0].color"
        >
          <div
            class="mark-color"
            :style="{
              background: item,
            }"
          ></div>
          <div class="mark-text">{{ index }}</div>
        </div>
      </panel-item>
    </div>

    <!-- 管网基础属性弹窗 -->
    <el-dialog
      class="mydialog"
      draggable
      :fullscreen="fullScreen"
      :title="title"
      v-model="dialogShow"
      width="800px"
      @close="handleClose"
      node-key="id"
      append-to-body
    >
      <template #header>
        <span role="heading" class="el-dialog__title">{{ title }}</span>
        <button
          aria-label="el.dialog.fullscreen"
          class="el-dialog__headerbtn fullscreen-btn"
          type="button"
          @click="handelChangeFullScreen"
        >
          <el-icon class="el-dialog__close"><FullScreen /></el-icon>
        </button>
      </template>
      <el-tabs v-if="tabFlag" v-model="activeName" type="card" class="mytabs">
        <el-tab-pane label="基础属性" name="p1">
          <el-descriptions :column="1" border class="mydescriptions">
            <a v-if="!activeType">
              <el-descriptions-item label="井名称">{{
                tableData.name
              }}</el-descriptions-item>
              <el-descriptions-item label="地表高程">{{
                (tableData.surelev || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="井底高程">{{
                (tableData.elev || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="深度">{{
                (tableData.depth || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="类别">{{
                tableData.category
              }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{
                tableData.type
              }}</el-descriptions-item>
              <el-descriptions-item label="形状">{{
                tableData.form
              }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{
                tableData.remark
              }}</el-descriptions-item>
            </a>
            <a v-else>
              <el-descriptions-item label="管线编号">{{
                tableData.name
              }}</el-descriptions-item>
              <el-descriptions-item label="进水节点">{{
                tableData.inletnode
              }}</el-descriptions-item>
              <el-descriptions-item label="出水节点">{{
                tableData.outletnode
              }}</el-descriptions-item>
              <el-descriptions-item label="管始端底高程">{{
                (tableData.inletelev || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="管末端底高程">{{
                (tableData.outletelev || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="起始井深">{{
                (tableData.indepth || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="末端井深">{{
                (tableData.ondepth || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="管径1">{{
                (tableData.geom1 || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="管径2">{{
                (tableData.geom2 || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="长度">{{
                (tableData.length || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="进水偏移">{{
                (tableData.inoffset || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="出水偏移">{{
                (tableData.outoffset || 0) + "m"
              }}</el-descriptions-item>
              <el-descriptions-item label="形状">{{
                tableData.cshape
              }}</el-descriptions-item>
              <el-descriptions-item label="类别">{{
                tableData.category
              }}</el-descriptions-item>
              <el-descriptions-item label="材质">{{
                tableData.material
              }}</el-descriptions-item>
              <el-descriptions-item label="埋设方式">{{
                tableData.form
              }}</el-descriptions-item>
            </a>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="结构属性" name="p2" class="mydescriptions">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="井壁破裂">
              {{ tableData.PL || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="管口衔接脱开">
              {{ tableData.TK || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="井底不完整">
              {{ tableData.JB || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="井底渗漏">
              {{ tableData.SL || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="井内有无网兜">
              {{ tableData.WD || "" }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="功能属性" name="p3" class="mydescriptions">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="井底淤泥沉积">
              {{ tableData.YJ || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="井内固体废物">
              {{ tableData.FW || "" }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="工艺属性" name="p4" class="mydescriptions">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="水深（含淤泥）">
              {{ tableData.WaterDepth || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="淤泥深">
              {{ tableData.SludgDepth || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="气味">
              {{ tableData.Odour || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="透明度">
              {{ tableData.Transparency || "" }}
            </el-descriptions-item>
            <el-descriptions-item label="流向情况">
              {{ tableData.FlowDir || "" }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-else v-model="activeName" type="card" class="mytabs">
        <el-tab-pane label="监测数据" name="p1">
          <div class="chart-tab" ref="chartRef" v-loading="loading"></div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import useLoadingStore from "@/store/modules/loading";
import PanelItem from "@/components/PanelItem";
import { FullScreen } from "@element-plus/icons-vue";

import * as echarts from "echarts";

import {
  getLayer,
  getRainLineList,
  getSewageLineList,
} from "@/api/layer/index";

//图标
import pipeimg1 from "/public/image/water1.png";
import pipeimg2 from "/public/image/water2.png";
import pipeimg from "/public/image/arrow2.png";
import rainWellimg from "/public/image/rain_white.svg";
// import rainWellimg from "/public/image/rain_yellow.svg";
import rainOutimg from "/public/image/rain-outfall.png";
import sewageWellimg from "/public/image/sewage_white.svg";
// import sewageWellimg from "/public/image/sewage_cyan.svg";
import sewageWorkimg from "/public/image/sewage.png";
import sewagePumpimg from "/public/image/sewage_blue.svg";
import waterlevelmonitorimg from "/public/image/water-level.png";
import waterqualitymonitorimg from "/public/image/water-quality.png";
import watervolumemonitorimg from "/public/image/water-volume.png";
import watergatemonitorimg from "/public/image/water-station.png";
import watercameramonitorimg from "/public/image/camera.png";
import waterstationimg from "/public/image/station.png";
import hydrategateimg from "/public/image/hydrategate.png";
import arrow from "/public/image/arrow_water.png";
import { nextTick, onActivated, onDeactivated, onUnmounted } from "vue";

import TooltipDiv from "./tooltip.js";

import GeoJSON from "ol/format/GeoJSON.js";
import WebGLVectorLayer from "ol/layer/WebGLVector.js";
import VectorSource from "ol/source/Vector.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
// import Style from "ol/style/Style";
//全局加载事件
const useLoading = useLoadingStore();
const activeLoader = ref(0); //loader计数器

const dialogShow = ref(false); //管网基础属性/监测数据弹窗
const tabFlag = ref(true); //切换基础属性/监测数据

const showMarkFlag = ref(false); //土地利用显示图例

const title = ref("");

const chartRef = ref(null); //监测数据折线图
let myChart = null;
const loading = ref(true);

const fullScreen = ref(false);
const tableData = ref({});

const activeName = ref("p1"); //属性弹窗
const activeType = ref(false); //true管子，false井

const offset = ref(0); //偏移--管道动态特效
//样式变量--偏移
const styleVariables = ref({
  dashOffset: 0,
  highlightFeatures: [], //需要高亮的管子列表
});
//样式变量--hover
const styleVariables2 = ref({
  selectedId: -1,
});

const highlightedLineFeatures = ref([]);
const highlightedNodeFeatures = ref([]);

const treeData = [
  {
    label: "水系",
    id: 0,
    name: "stream",
    type: "polygon",
    disabled: true,
    propertyName: "main",
    style: [
      {
        filter: ["==", ["var", "selectedId"], ["id"]],
        style: {
          "fill-color": "rgba(0, 250, 0, 0.7)",
        },
      },
      {
        else: true,
        style: {
          "fill-color": [
            "match",
            ["get", "main"],
            "水系",
            "rgba(124, 220, 254, 0.7)",
            "重点水系",
            "rgba(0, 0, 255, 0.7)",
            "rgba(255, 255, 255, 0.7)",
          ],
        },
      },
    ],
    zIndex: 1,
  },
  {
    label: "分区",
    id: 1,
    name: "zone",
    type: "polygon",
    disabled: true,
    style: {
      "stroke-color": "white",
      "stroke-width": 1,
      "fill-color": "rgba(0, 0, 0, 0)",
    },
    zIndex: 0,
  },
  {
    label: "闸泵",
    id: 2,
    name: "floodgate",
    type: "point",
    style: {
      "icon-src": watergatemonitorimg,
      "icon-width": 25,
      "icon-height": 25,
    },
    zIndex: 5,
  },
  {
    label: "雨水管网",
    id: 3,
    children: [
      {
        label: "雨水井",
        id: "3-1",
        name: "rainpipenode",
        type: "point",
        style: {
          "icon-src": rainWellimg,
          "icon-width": 18,
          "icon-height": 18,
          "icon-color": "rgba(255, 215, 0, 1)",
        },
        zIndex: 8,
      },
      {
        label: "雨水管",
        id: "3-2",
        name: "rainpipeline",
        type: "polyline",
        style: [
          {
            style: {
              "stroke-width": 15,
              "stroke-color": [
                "case",
                [
                  "in",
                  ["get", "name"],
                  ["literal", ["var", "highlightFeatures"]],
                ],
                "rgba(255,255,0,0.8)",
                "rgba(97, 121, 238, 0.8)",
              ],
            },
          },
          {
            style: {
              "stroke-width": 5,
              "stroke-color": "rgba(9, 240, 253, 1)",
              "stroke-line-dash": [0, 20],
              "stroke-line-dash-offset": ["var", "dashOffset"],
            },
          },
        ],
        zIndex: 4,
      },
      {
        label: "雨水排口",
        id: "3-3",
        name: "rainoutfall",
        type: "point",
        style: {
          "icon-src": rainOutimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
    ],
  },
  {
    label: "污水管网",
    id: 4,
    children: [
      {
        label: "污水井",
        id: "4-1",
        name: "sewagepipenode",
        type: "point",
        style: {
          "icon-src": sewageWellimg,
          "icon-width": 18,
          "icon-height": 18,
          "icon-color": "rgba(38, 124, 208, 1)",
        },
        zIndex: 8,
      },
      {
        label: "污水管",
        id: "4-2",
        name: "sewagepipeline",
        type: "polyline",
        style: [
          {
            style: {
              "stroke-width": 15,
              // "stroke-color": "rgba(135, 240, 137, 0.8)",
              "stroke-color": [
                "match",
                ["get", "highlighted"],
                "true",
                "rgba(255, 255, 255, 1)",
                "false",
                "rgba(135, 240, 137, 0.8)",
                "rgba(135, 240, 137, 0.8)",
              ],
            },
          },
          {
            style: {
              "stroke-width": 5,
              "stroke-color": "rgba(48, 160, 175, 1)",
              "stroke-line-dash": [0, 20],
              "stroke-line-dash-offset": ["var", "dashOffset"],
            },
          },
          // {
          //   style: {
          //     "stroke-width": 10,
          //     "stroke-pattern-src": arrow,
          //     "stroke-pattern-spacing": ["var", "dashOffset"],
          //     "stroke-pattern-color": "rgba(36, 116, 195, 1)",
          //   },
          // },
        ],
        zIndex: 4,
      },
      {
        label: "污水泵站",
        id: "4-3",
        name: "sewagepump",
        type: "point",
        style: {
          "icon-src": sewageWellimg,
          "icon-width": 25,
          "icon-height": 25,
          "icon-color": "rgba(238, 133, 25, 1)",
        },
        zIndex: 9,
      },
      {
        label: "污水处理厂",
        id: "4-4",
        name: "sewageworks",
        type: "polygon",
        style: {
          "stroke-color": "white",
          "stroke-width": 1,
          "fill-color": "rgba(65, 184, 131, 0.7)",
        },
        zIndex: 3,
      },
    ],
  },
  {
    label: "河道",
    id: 5,
    children: [
      {
        label: "流量监测点",
        id: "5-1",
        name: "monitorflow",
        type: "point",
        style: {
          "icon-src": watervolumemonitorimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
      {
        label: "水位监测点",
        id: "5-2",
        name: "monitorwaterlevel",
        type: "point",
        style: {
          "icon-src": waterlevelmonitorimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
      {
        label: "水质监测点",
        id: "5-3",
        name: "monitorwaterquality",
        type: "point",
        style: {
          "icon-src": waterqualitymonitorimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
      {
        label: "排口监测点",
        id: "5-4",
        name: "monitor_outfall",
        type: "point",
        style: {
          "icon-src": watercameramonitorimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
      {
        label: "补水闸门",
        id: "5-7",
        name: "hydrategate",
        type: "point",
        style: {
          "icon-src": hydrategateimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
      {
        label: "补水泵站",
        id: "5-5",
        name: "hydratepump",
        type: "point",
        style: {
          "icon-src": waterstationimg,
          "icon-width": 25,
          "icon-height": 25,
        },
        zIndex: 9,
      },
      {
        label: "补水路线",
        id: "5-6",
        name: "hydrateroute",
        type: "polyline",
        style: {
          "fill-color": "rgba(0, 0, 238, 0.8)",
        },
        zIndex: 4,
      },
    ],
  },
  {
    label: "流域背景",
    id: 6,
    children: [
      {
        label: "土地利用",
        id: "6-1",
        name: "landuse",
        type: "polygon",
        propertyName: "landuse",
        style: {
          "fill-color": [
            "match",
            ["get", "landuse"],
            "交通用地",
            "rgba(104, 104, 104, 0.7)",
            "农业用地",
            "rgba(255, 255, 0, 0.7)",
            "城镇",
            "rgba(255, 0, 197, 0.7)",
            "工业用地",
            "rgba(197, 0, 255, 0.7)",
            "村庄",
            "rgba(255, 85, 0, 0.7)",
            "林地",
            "rgba(63, 130, 0, 0.7)",
            "水面",
            "rgba(0, 197, 255, 0.7)",
            "裸地",
            "rgba(230, 152, 0, 0.7)",
            "采矿用地",
            "rgba(168, 0, 0, 0.7)",
            "rgba(255, 255, 255, 0.7)",
          ],
        },
        color: {
          交通用地: "rgba(104, 104, 104, 0.7)",
          农业用地: "rgba(255, 255, 0, 0.7)",
          城镇: "rgba(255, 0, 197, 0.7)",
          工业用地: "rgba(197, 0, 255, 0.7)",
          村庄: "rgba(255, 85, 0, 0.7)",
          林地: "rgba(63, 130, 0, 0.7)",
          水面: "rgba(0, 197, 255, 0.7)",
          裸地: "rgba(230, 152, 0, 0.7)",
          采矿用地: "rgba(168, 0, 0, 0.7)",
        },
        zIndex: 5,
      },
      {
        label: "坡度",
        id: "6-2",
        name: "slope",
        type: "polygon",
        propertyName: "slopeclass",
        style: {
          "fill-color": [
            "match",
            ["get", "slopeclass"],
            "1",
            "rgba(85, 255, 0, 0.7)",
            "2",
            "rgba(255, 255, 0, 0.7)",
            "3",
            "rgba(255, 0, 0, 0.7)",
            "rgba(255, 255, 255, 0.7)",
          ],
        },
        color: {
          1: "rgba(85, 255, 0, 0.7)",
          2: "rgba(255, 255, 0, 0.7)",
          3: "rgba(255, 0, 0, 0.7)",
        },
        zIndex: 5,
      },
    ],
  },
];
const treeRef = ref(null);

const layerList = ref([]);

const props = {
  label: "label",
  children: "children",
  disabled: "disabled",
};

const selectedEntity = ref(null); //鼠标移动悬浮目标

function handleCheckChange(nodeData, checked) {
  if (!nodeData.name) {
    return;
  }
  showMarkFlag.value = false;
  if (checked) {
    if (!nodeData.children) {
      if (nodeData.name.includes("rain")) {
        // treeRef.value.setChecked(4, false, true);
        treeRef.value.setChecked(5, false, true);
        treeRef.value.setChecked(6, false, true);
      } else if (nodeData.name.includes("sewage")) {
        // treeRef.value.setChecked(3, false, true);
        treeRef.value.setChecked(5, false, true);
        treeRef.value.setChecked(6, false, true);
      } else if (nodeData.name.includes("monitor")) {
        treeRef.value.setChecked(3, false, true);
        treeRef.value.setChecked(4, false, true);
        treeRef.value.setChecked(6, false, true);
      } else if (nodeData.name == "landuse") {
        treeRef.value.setChecked(3, false, true);
        treeRef.value.setChecked(4, false, true);
        treeRef.value.setChecked(5, false, true);
        treeRef.value.setChecked("6-2", false, true);
        showMarkFlag.value = true;
      } else if (nodeData.name == "slope") {
        treeRef.value.setChecked(3, false, true);
        treeRef.value.setChecked(4, false, true);
        treeRef.value.setChecked(5, false, true);
        treeRef.value.setChecked("6-1", false, true);
      }
      let temp = layerList.value.find((v) => v.name == nodeData.name);
      if (temp) {
        temp.layer.setVisible(true);
        temp.show = true;
      } else {
        loadGeojson(nodeData, nodeData.type);
      }
    }
  } else {
    let temp = layerList.value.find((v) => v.name == nodeData.name);
    if (temp) {
      temp.layer.setVisible(false);
      temp.show = false;
    }
    // viewer.dataSources.remove(temp);
  }
}

//加载图层
function loadGeojson(layerData, flag) {
  useLoading.setLoading(true);
  activeLoader.value++;
  getLayer(layerData.name).then((res) => {
    const features = new GeoJSON().readFeatures(res);
    features.forEach((feature) => {
      feature.set("layerName", layerData.name); // 使用set方法注入属性
      feature.set("highlighted", false); // 使用set方法注入属性
    });
    const vectorSource = new VectorSource({ features });

    if (layerData.name.includes("pipenode")) {
      const webglLayer = new WebGLVectorLayer({
        source: vectorSource,
        style: layerData.style,
        zIndex: layerData.zIndex,
      });
      layerList.value.push({
        name: layerData.name,
        type: layerData.type,
        flowing: false,
        trigger: true,
        hover: false,
        show: true,
        layer: webglLayer,
      });
      OLMap.addLayer(webglLayer);
    } else if (layerData.name.includes("pipeline")) {
      const webglLayer = new WebGLVectorLayer({
        source: vectorSource,
        style: layerData.style,
        variables: { ...styleVariables.value },
        zIndex: layerData.zIndex,
        // properties: {
        //   highlighted: false,
        // },
      });
      layerList.value.push({
        name: layerData.name,
        type: layerData.type,
        flowing: true,
        trigger: true,
        hover: true,
        show: true,
        layer: webglLayer,
      });
      OLMap.addLayer(webglLayer);
    } else {
      const webglLayer = new WebGLVectorLayer({
        source: vectorSource,
        style: layerData.style,
        zIndex: layerData.zIndex,
        variables:
          layerData.name == "stream" ? { ...styleVariables2.value } : {},
      });
      if (layerData.name == "stream") {
        layerList.value.push({
          name: layerData.name,
          type: layerData.type,
          flowing: false,
          trigger: false,
          hover: true,
          show: true,
          layer: webglLayer,
        });
      } else {
        layerList.value.push({
          name: layerData.name,
          type: layerData.type,
          flowing: false,
          trigger: false,
          hover: false,
          show: true,
          layer: webglLayer,
        });
      }

      OLMap.addLayer(webglLayer);
    }
    if (--activeLoader.value === 0) {
      useLoading.setLoading(false);
    }
  });
}
function animateFlow() {
  offset.value = offset.value >= 20 ? 0 : (offset.value += 0.3);
  styleVariables.value.dashOffset = -offset.value;
  layerList.value.forEach((v) => {
    if (v.flowing) {
      v.layer.updateStyleVariables(styleVariables.value);
    }
  });
  OLMap.render();
  requestAnimationFrame(animateFlow);
}
//关闭弹窗和全屏
function handleClose() {
  activeName.value = "p1";
  viewer.selectedEntity = undefined;
}
function handelChangeFullScreen() {
  fullScreen.value = !fullScreen.value;
  nextTick(() => {
    if (!tabFlag.value && myChart) {
      myChart.resize();
    }
  });
}

//加载数据折线图
function initChart(id) {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    myChart = echarts.init(chartRef.value);
    let option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    };

    option && myChart.setOption(option);
  }, 500);
}

//点击事件
function clickFeatureInfo(evt) {
  console.log(evt);
  if (evt) {
    //数据监测
    if (entity.entityCollection.owner.name.includes("monitor")) {
      tableData.value = {};
      entity.properties._propertyNames.forEach((v) => {
        tableData.value[v] = entity.properties[v]._value;
      });
      title.value = tableData.value.Remark;

      //切换数据监测
      tabFlag.value = false;
      dialogShow.value = true;
      initChart(tableData.value.Id);
    } else if (entity.id.includes("node") || entity.id.includes("pipe")) {
      //基础属性
      tableData.value = {};
      entity.properties._propertyNames.forEach((v) => {
        tableData.value[v] = entity.properties[v]._value;
      });
      title.value = entity.name;
      if (entity.billboard) {
        activeType.value = false;
      } else if (entity.polyline) {
        activeType.value = true;
      } else if (entity.polygon) {
        //todo
      }
      //切换基础属性
      tabFlag.value = true;
      dialogShow.value = true;
    }
  }
}
//悬浮事件
function hoverFeatureInfo(pixel) {
  if (selectedEntity.value !== null) {
    selectedEntity.value = null;
  }
  const feature = OLMap.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });

  if (!feature) {
    TooltipDiv.hide();
    styleVariables2.value.selectedId = -1;
    let targetLayer = layerList.value.find((v) => v.name == "stream");
    targetLayer.layer.updateStyleVariables({ ...styleVariables2.value });
    return;
  }
  selectedEntity.value = feature;

  console.log(selectedEntity.value);
  //水系图层高亮+悬浮窗
  if (feature.get("layerName") == "stream") {
    const id = feature.getId();
    if (id !== styleVariables2.value.selectedId) {
      styleVariables2.value.selectedId = id;
      let targetLayer = layerList.value.find((v) => v.name == "stream");
      targetLayer.layer.updateStyleVariables({ ...styleVariables2.value });
    }
    // console.log(pixel);
    let tooltipinfo;
    // 悬浮展示信息
    tooltipinfo =
      (selectedEntity.value.get("name") == " "
        ? "未知"
        : selectedEntity.value.get("name")) +
      "    " +
      (selectedEntity.value.get("length") == " "
        ? 0
        : selectedEntity.value.get("length")) +
      "m";
    if (tooltipinfo) {
      TooltipDiv.show(pixel, `<div class="con">${tooltipinfo}</div>`);
    }
    // console.log(
    //   selectedEntity.value.get("name"),
    //   selectedEntity.value.get("length")
    // );
  } else if (feature.get("layerName") == "sewagepipeline") {
    getSewageLineList({
      outletNode: feature.get("outletnode"),
    }).then((res) => {});
  } else if (feature.get("layerName") == "rainpipeline") {
    getRainLineList({
      outletNode: feature.get("outletnode"),
    }).then((res) => {});
  }
}
function handleFeatureHover(pixel) {
  // // 清除上一次选中的要素
  // if (selectedEntity.value) {
  //   selectedEntity.value = null;
  // }

  // 获取当前悬浮的要素
  const hoveredFeature = OLMap.forEachFeatureAtPixel(
    pixel,
    (feature) => feature
  );

  if (!hoveredFeature) {
    clearHoverEffects();
    return;
  }
  if (!selectedEntity.value) {
    selectedEntity.value = hoveredFeature;
  }
  const layerName = hoveredFeature.get("layerName");

  // 根据不同图层类型处理交互
  switch (layerName) {
    case "stream":
      selectedEntity.value = hoveredFeature;
      processStreamFeature(hoveredFeature, pixel);
      break;
    case "sewagepipeline":
      if (
        selectedEntity.value &&
        selectedEntity.value.getId() !== hoveredFeature.getId()
      ) {
        selectedEntity.value = hoveredFeature;
        // console.log(hoveredFeature);

        fetchPipelineData(hoveredFeature, "sewage");
      }
      break;
    case "rainpipeline":
      if (
        selectedEntity.value &&
        selectedEntity.value.getId() !== hoveredFeature.getId()
      ) {
        selectedEntity.value = hoveredFeature;
        fetchPipelineData(hoveredFeature, "rain");
      }
      break;
  }
}

/**
 * 处理水系图层交互highlightFeatures
 */
function processStreamFeature(feature, pixel) {
  const featureId = feature.getId();

  // 更新高亮样式（避免不必要的重绘）
  if (featureId !== styleVariables2.value.selectedId) {
    styleVariables2.value.selectedId = featureId;
    const streamLayer = layerList.value.find(
      (layer) => layer.name === "stream"
    );
    streamLayer?.layer?.updateStyleVariables({ ...styleVariables2.value });
  }

  // 构建悬浮提示信息
  const name = feature.get("name")?.trim() || "未知";
  const length = feature.get("length") || 0;
  const tooltipContent = `<div class="tooltip-content">${name} ${length}m</div>`;

  TooltipDiv.show(pixel, tooltipContent);
}

/**
 * 获取管道数据
 */
function fetchPipelineData(feature, type) {
  const params = { outletNode: feature.get("outletnode") };
  const fetchMethod = type === "sewage" ? getSewageLineList : getRainLineList;
  fetchMethod(params).then((res) => {
    // console.log(res.data);
    styleVariables.value.highlightFeatures = res.data.Pipelines;
    let tempLineLayer = layerList.value.find(
      (v) => v.name == (type === "sewage" ? "sewagepipeline" : "rainpipeline")
    );
    let tempWellLayer = layerList.value.find(
      (v) => v.name == (type === "sewage" ? "sewagepipenode" : "rainpipenode")
    );
    let targetFeatures = tempLineLayer.layer.getSource().getFeatures();
    targetFeatures.forEach((v) => {
      if (res.data.Pipelines.includes(v.get("name"))) {
        v.set("highlighted", "true");
        highlightedLineFeatures.value.push(v);
      } else {
        v.set("highlighted", "false");
      }
    });
    if (tempWellLayer && tempWellLayer.show) {
      let targetFeatures2 = tempWellLayer.layer.getSource().getFeatures();
      targetFeatures2.forEach((v) => {
        if (res.data.Nodes.includes(v.get("name"))) {
          v.set("highlighted", "true");
          highlightedNodeFeatures.value.push(v);
        } else {
          v.set("highlighted", "false");
        }
      });
    }
    // tempLineLayer.layer.getSource().changed();
    // tempLineLayer.layer.updateStyleVariables({
    //   highlightFeatures: res.data.Pipelines,
    // });
    // tempLineLayer.layer.setStyle([
    //   {
    //     style: {
    //       "stroke-width": 15,
    //       // "stroke-color": "rgba(135, 240, 137, 0.8)",
    //       "stroke-color": [
    //         "case",
    //         [
    //           "in",
    //           ["get", "name"],
    //           ["literal", styleVariables.value.highlightFeatures],
    //         ],
    //         "rgba(255, 255, 255, 1)",
    //         "rgba(135, 240, 137, 0.8)",
    //       ],
    //     },
    //   },
    //   {
    //     style: {
    //       "stroke-width": 5,
    //       "stroke-color": "rgba(48, 160, 175, 1)",
    //       "stroke-line-dash": [0, 20],
    //       "stroke-line-dash-offset": ["var", "dashOffset"],
    //     },
    //   },
    // ]);
    // debugger;
    // OLMap.render();
  });
}

/**
 * 清除悬浮效果
 */
function clearHoverEffects() {
  if (styleVariables2.value.selectedId !== -1) {
    TooltipDiv.hide();
    styleVariables2.value.selectedId = -1;
    const streamLayer = layerList.value.find(
      (layer) => layer.name === "stream"
    );
    streamLayer?.layer?.updateStyleVariables({ ...styleVariables2.value });
  }

  if (styleVariables.value.highlightFeatures.length > 0) {
    highlightedLineFeatures.value.forEach((v) => {
      v.set("highlighted", "false");
    });
    highlightedLineFeatures.value = [];

    highlightedNodeFeatures.value.forEach((v) => {
      v.set("highlighted", "false");
    });
    highlightedNodeFeatures.value = [];
    styleVariables.value.highlightFeatures = [];
  }
}

onMounted(() => {
  treeRef.value.setCheckedKeys([0, 1]);
  // nextTick(() => {
  //   loadWFS();
  // });
  nextTick(() => {
    animateFlow();
  });
  // 初始化Tooltip
  TooltipDiv.initTool();
});
onActivated(() => {
  // console.log("active!");
  nextTick(() => {
    //开启图层
    // let checkedNodes = treeRef.value.getCheckedNodes(true);
    // checkedNodes.forEach((v) => {
    //   let temp = layerList.value.find((el) => el.name == v.name);
    //   if (temp) temp.layer.setVisible(true);
    // });
    //点击选择事件
    OLMap.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      // hoverFeatureInfo(evt.pixel);
      handleFeatureHover(evt.pixel);
    });

    OLMap.on("click", function (evt) {
      // clickFeatureInfo(evt);
    });
  });
});
onDeactivated(() => {
  return;

  // console.log("deactive!");
  viewer.selectedEntityChanged.removeEventListener(clickEvent);
  viewer.selectedEntity = undefined;
  hoverEvent.value.removeEvent();

  viewer.dataSources._dataSources.forEach((v) => {
    v.show = false;
  });
});

onUnmounted(() => {
  // console.log("unmounted!");

  //注销事件
  viewer.selectedEntityChanged.removeEventListener(clickEvent);
  viewer.selectedEntity = undefined;
  event.removeEvent();

  viewer.dataSources._dataSources.forEach((v) => {
    v.show = false;
  });
});
</script>

<style scoped lang="scss">
.main-container {
  height: 100%;
  width: 100%;
  .left-side {
    width: 200px;
    pointer-events: all;
    position: relative;
    left: 20px;
    top: 20px;
  }
  .right-side {
    pointer-events: all;
    position: fixed;
    right: 20px;
    bottom: 20px;
    .mark-item {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
      padding-left: 20px;
      user-select: none;
      .mark-color {
        width: 30px;
        height: 20px;
        border-radius: 3px;
      }
    }
  }
}
.chart-tab {
  width: 100%;
  height: 40vh;
}
.is-fullscreen {
  .chart-tab {
    width: 100%;
    height: 85vh;
  }
}
.fullscreen-btn {
  right: 54px;
}
</style>
