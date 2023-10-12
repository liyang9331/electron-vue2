<template>
  <div class="fileUploadDialog">
    <el-dialog v-model="centerDialogVisible" :title="'上传文件---' + title" width="60%" :close-on-click-modal="false"
      :before-close="close">
      <div>
        <el-steps :active="stepNum" align-center>
          <el-step v-for="item in stepsList" :key="item" :title="item.title"></el-step>
        </el-steps>
        <!-- 文件上传 -->
        <div v-show="stepNum == 0" class="selectFile">
          <div class="label">文件类型</div>
          <el-select v-model="fileObj.fileType" placeholder="请选择" style="width: 100%" size="large"
            @change="fileTypeChange()">
            <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div class="upload-box">
            <el-upload class="upload-demo" :http-request="handleUploadForm" :before-upload="handBeforeUpload"
              :accept="fileType" drag action="" multiple :show-file-list="false">
              <img style="width: 85px; height: 80px; margin-bottom: 40px" src="@/assets/images/shanchuan.png" alt="" />
              <span class="upload_text" @click="onUpload">点击上传</span>
            </el-upload>
          </div>
          <div style="font-weight: 400; color: #1f263e; line-height: 22px">
            文件名： {{ fileObj.filePath }}
          </div>
        </div>
        <!-- 数据设置 -->
        <div v-show="stepNum == 1" class="dataSet">
          <div class="content">
            <div class="inputBox" v-if="fileObj.fileType == 'xls'">
              <span class="label">表头所在行</span>
              <el-input style="width: 70%" v-model="dataSetObj.headerRowNum" />
            </div>
            <div class="inputBox" v-if="fileObj.fileType == 'xls'">
              <span class="label">数据所在行</span>
              <el-input style="width: 70%; margin-right: 10px" v-model="dataSetObj.dataRowNum" />
              <el-button type="primary" @click="updateExcelData">查询</el-button>
            </div>
            <el-tag style="width: 100%; padding: 12px; margin-bottom: 10px" type="danger">如果要计算逆坡则需要选择高程</el-tag>
            <ul class="config">
              <li class="first">
                <div class="li-left bg">字段描述</div>
                <div class="li-right bg">对应字段</div>
              </li>
              <li v-for="item in fieldList" :key="item.name">
                <div class="li-left">{{ item.name }}</div>
                <div class="li-right">
                  <el-select v-model="from[item.key]" class="m-2" placeholder="请选择" style="width: 100%" filterable>
                    <el-option v-for="item in options" :key="item" :label="item" :value="item" />
                  </el-select>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 数据结果 -->
        <div class="result" v-show="stepNum == 2">
          <img v-if="true" style="width: 64px; height: 64px" src="@/assets/images/tongguo.png" alt="" />
          <img v-else style="width: 64px; height: 64px" src="@/assets/images/weitongguo.png" alt="" />
          <p style="
              font-size: 20px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.85);
              line-height: 28px;
            ">
            数据格式正确
          </p>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="stepNum != 0" @click="previousStep">上一步</el-button>
          <el-button v-if="stepNum != 2" type="primary" @click="nextStep">下一步</el-button>
          <el-button v-if="stepNum == 2" type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { DataInspection } from "@/js/dataInspection/dataInspection.js";
import { ElMessage } from "element-ui";
import { mapState, mapMutations } from "vuex";
import { coordinateTransformation, checkLonLat } from "@/utils/index";
import { startLoading, endLoading } from "@/utils/loading";
import { assetsType } from "@/utils/asetsType";
import myWorker from "@/js/check/worker/file.worker";
import parseFileWorker from "@/js/check/worker/parseFile.worker.js";
import fs from "fs";
import path from "path";
export default {
  name: "fileUploadDialog",
  components: {},
  computed: {
    ...mapState("fileUpload", [
      "uploadedFilesList",
      "fileInfor",
      "pipeLineData",
    ]),
  },
  props: {
    centerDialogVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    dialogInfor: {
      type: Object,
      required: true,
    },
    projectionValue: {
      required: true,
    },

    distX: {
      type: String,
    },
    distY: {
      type: String,
    }
  },
  created () { },
  data () {
    return {
      fileType: ".xls,.xlsx",
      stepsList: [
        {
          title: "文件上传",
        },
        {
          title: "数据设置",
        },
        {
          title: "上传确认",
        },
      ],
      stepNum: 0, // 步骤条的进度
      fileTypeList: [
        {
          value: "xls",
          label: "xls",
        },
        {
          value: "shp",
          label: "shp",
        },
      ],
      fieldList: [],
      from: {},
      options: [],
      dataInspection: null,
      fileObj: {
        fileType: "xls",
        fileName: "",
        filePath: "",
      }, // 文件信息
      dataSetObj: {
        headerRowNum: 1,
        dataRowNum: 2,
      },
      dataArray: [], // 管点数据
      loading: false,
      works: null,
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapMutations("fileUpload", ["setStateItem"]),
    init () {
      this.dataInspection = new DataInspection();
      let typeName = this.dialogInfor.assetsName.trim();
      this.fieldList = assetsType[typeName];
      this.fieldList.forEach((item) => {
        this.from[item.key] = "";
      });
    },
    fileTypeChange () {
      if (this.fileObj.fileType == "xls") {
        this.fileType = ".xls,.xlsx";
      } else if (this.fileObj.fileType == "shp") {
        this.fileType = ".zip";
      }
    },
    // 上传文件前进行判断
    handBeforeUpload (file) {
      let arr = this.uploadedFilesList.map((item) => item.file_name);
      let str = arr.indexOf(file.name);
      if (str != -1) {
        ElMessage.error("该文件已选择上传");
        return false;
      }
      return true;
    },
    // 上传文件
    handleUploadForm (data) {
      this.fileObj.fileName = data.file.name;
      this.fileObj.filePath = data.file.path;
      ElMessage.success("文件导入成功");
    },

    // // 查询文件的表头和表数据
    // async onSearchFile(cb) {
    //   if (this.fileObj.fileType == "xls") {
    //     if (this.dialogInfor.type == "point") {
    //       // 点
    //       let res = await this.dataInspection.setPoint(
    //           this.fileObj.filePath,
    //           this.dataSetObj.headerRowNum,
    //           this.dataSetObj.dataRowNum
    //       );
    //       cb && cb(res);
    //     } else {
    //       // 管线
    //       let res = await this.dataInspection.setLine(
    //           this.fileObj.filePath,
    //           this.dataSetObj.headerRowNum,
    //           this.dataSetObj.dataRowNum
    //       );
    //       cb && cb(res);
    //     }
    //   }
    // },
    // 更换数据的字段信息
    changeDataField (arrList) {
      let obj = { ...this.from };
      let arr = [];
      for (let k in obj) {
        let value = obj[k]; //将原来的value赋值给一个变量
        obj[value] = k; // 为cluster_info赋新key，不能直接使用cluster_info = {obj[k] : k},会报语法错误
        delete obj[k]; // 删除原来的属性
      }
      arr = arrList.map((item) => {
        return this.setEmpty(item, obj);
      });
      return arr;
    },
    setEmpty (data, keyMap) {
      let objs = Object.keys(data).reduce((newData, key) => {
        let newKey = keyMap[key] || key;
        newData[newKey] = data[key];
        if (key.includes("标识码") && this.dialogInfor.type == "point") {
          newData["assetsId"] = data[key];
        }
        return newData;
      }, {});
      return objs;
    },
    // 解析shp文件
    analysisShpFile () {

      // Shapefile.js  中文乱码 https://www.shuzhiduo.com/A/gGdXe6bvz4/  需要修改源代码
      startLoading("body", "shp文件解析中，请稍等...");
      this.dataInspection.analysisShp(this.fileObj.filePath, (data) => {
        let dataTempArr = [];
        if (data && data.features && data.features.length > 0) {
          let properties = data.features[0].properties;
          if (data.features[0].geometry.type == "LineString") {
            //说明是管线  初略的判断一下
            let contentx = false;
            let contenty = false;
            for (let k in properties) {
              if (k.toLowerCase().indexOf("x") > -1) {
                contentx = true;
              } else if (k.toLowerCase().indexOf("y") > -1) {
                contenty = true;
              }
            }
            if (!contentx || !contenty) {
              //没有X Y值
              for (let item of data.features) {
                if (!item || !item.geometry) {
                  continue
                }
                let startXY = item.geometry.coordinates[0];
                let endXY = item.geometry.coordinates[1];
                item.properties.startX = startXY[0];
                item.properties.starty = startXY[1];
                item.properties.endX = endXY[0];
                item.properties.endy = endXY[1];

                dataTempArr.push(item.properties);
              }
            } else {
              for (let item of data.features) {
                dataTempArr.push(item.properties);
              }
            }
          } else if (data.features[0].geometry.type == "Point") {
            //说明是管点  初略的判断一下
            let contentx = false;
            let contenty = false;
            for (let k in properties) {
              if (k.toLowerCase().indexOf("x") > -1) {
                contentx = true;
              } else if (k.toLowerCase().indexOf("y") > -1) {
                contenty = true;
              }
            }

            if (!contentx || !contenty) {
              //没有X Y值
              for (let item of data.features) {
                item.properties.X = item.geometry.coordinates[0];
                item.properties.Y = item.geometry.coordinates[1];
                dataTempArr.push(item.properties);
              }
            } else {
              for (let item of data.features) {
                dataTempArr.push(item.properties);
              }
            }
          }
          let keys = [];
          for (let item in data.features[0].properties) {
            keys.push(item);
          }
          this.dataArray = dataTempArr;
          this.options = keys;
          this.setDefault(this.options);
        }
        this.setStateItem({
          key: "shpData",
          value: data,
        });
        endLoading();
        this.stepNum = 1;
      });
    },
    // 给下拉框设置默认值
    setDefault (arr) {
      arr.forEach((item) => {
        for (let key in this.from) {
          if (
            key.includes(item.split("(")[0].trim()) ||
            key.includes(item.split("（")[0].trim()) ||
            item.includes(key)
          ) {
            this.from[key] = item;
          }
        }
        let str = item.toUpperCase();
        if (this.dialogInfor.type == "point") {
          if (str.toLowerCase().trim().includes("x")) {
            if (!this.from.xCoordinate) {
              this.from.xCoordinate = item;
            }
          } else if (str.toLowerCase().trim().includes("y")) {
            if (!this.from.yCoordinate) {
              this.from.yCoordinate = item;
            }
          } else if (
            str.includes("标识码") ||
            str.toLowerCase().includes("code")
          ) {
            if (!this.from.assetsId) {
              this.from.assetsId = item;
            }
          }
        } else if (this.dialogInfor.type == "line") {
          if (str.toLowerCase().includes("x1") && !str.toLowerCase().includes("fcsx1")) {
            if (!this.from.xCoordinate) {
              this.from.xCoordinate = item;
            }
          } else if (str.toLowerCase().includes("y1")) {
            if (!this.from.yCoordinate) {
              this.from.yCoordinate = item;
            }
          } else if (str.toLowerCase().includes("x2")) {
            if (!this.from.xCoordinate2) {
              this.from.xCoordinate2 = item;
            }
          } else if (str.toLowerCase().includes("y2")) {
            if (!this.from.yCoordinate2) {
              this.from.yCoordinate2 = item;
            }
          } else if (
            (str.includes("起始") && str.includes("标识码")) ||
            (str.includes("起点") && str.includes("标识码"))
          ) {
            if (!this.from.assetsId) {
              this.from.assetsId = item;
            }
          } else if (
            (str.includes("终止") && str.includes("标识码")) ||
            (str.includes("终点") && str.includes("标识码"))
          ) {
            if (!this.from.assetsId2) {
              this.from.assetsId2 = item;
            }
          }
        }
      });
    },
    // 判断必填项是否有值
    judgeRequired () {
      let arr = [];
      arr = this.fieldList.filter((item) => {
        return item.required;
      });
      return arr.every((item) => {
        return this.from[item.key];
      });
    },
    close () {
      this.$emit("fileUploadDialogClose");
    },
    // 上一步
    previousStep () {
      if (this.stepNum == 1) {
        this.stepNum = 0;
      } else if (this.stepNum == 2) {
        this.stepNum = 1;
      }
    },

    //重新设置表头数据
    updateExcelData () {
      if (!this.fileObj.filePath) {
        ElMessage.error("请先上传文件");
        return;
      }
      console.log(1111111111111111);

      let works = new parseFileWorker();
      startLoading("body", "文件数据解析中，请稍等...");
      if (this.fileObj.fileType == "shp") {
        this.analysisShpFile();
      } else {
        console.log(1111111111111111);

        works.postMessage({
          filePath: this.fileObj.filePath,
          headerRowNum: this.dataSetObj.headerRowNum,
          dataRowNum: this.dataSetObj.dataRowNum,
          data: fs.readFileSync(path.join(this.fileObj.filePath)),
        }); // 2 给works发送参数
        works.onmessage = (event) => {
          // 6. 接收works的数据并处理操作
          this.options = [...event.data.header];
          this.dataArray = [...event.data.results];
          this.setDefault(this.options);
          endLoading();
          this.stepNum = 1;
          works.terminate(); // 7 关闭works主线程
        };
      }
    },

    // 下一步
    nextStep () {
      try {
        if (this.stepNum == 0) {
          if (!this.fileObj.filePath) {
            ElMessage.error("请先上传文件");
            return;
          }
          let works = new parseFileWorker();
          startLoading("body", "文件数据解析中，请稍等...");

          if (this.fileObj.fileType == "shp") {
            this.analysisShpFile();
          } else {
            works.postMessage({
              filePath: this.fileObj.filePath,
              headerRowNum: this.dataSetObj.headerRowNum,
              dataRowNum: this.dataSetObj.dataRowNum,
              data: fs.readFileSync(path.join(this.fileObj.filePath)),
            }); // 2 给works发送参数
            works.onmessage = (event) => {
              // 6. 接收works的数据并处理操作
              this.options = [...event.data.header];
              this.dataArray = [...event.data.results];
              console.log(JSON.stringify(this.dataArray))

              this.setDefault(this.options);
              endLoading();
              this.stepNum = 1;
              works.terminate(); // 7 关闭works主线程
            };
          }
        } else if (this.stepNum == 1) {
          // 判断必填项是否有值
          if (this.judgeRequired()) {
            if (this.dialogInfor.type == "point") {
              this.dataArray = this.changeDataField(this.dataArray);
            } else {
              this.dataArray = this.changeDataField(this.dataArray);
            }
            this.stepNum = 2;
          } else {
            ElMessage.error("字段信息缺失");
          }
        }
      } catch (e) {
        console.error(e);
        endLoading();
      }
    },
    getSaveData (arr) {
      let obj = {};
      obj.dataType = this.dialogInfor.type;
      obj.file_name = this.fileObj.fileName;
      obj.file_path = this.fileObj.filePath;
      obj.file_type = this.fileObj.fileType;
      obj.data_type = this.dialogInfor.type;
      obj.title_index = this.dataSetObj.headerRowNum;
      obj.data_index = this.dataSetObj.dataRowNum;
      obj.fieldDescription = this.from;
      obj.fileHeaderList = [...this.options];
      obj.fileDataList = arr;
      this.setStateItem({
        key: "fileInfor",
        value: obj,
      });
    },
    // 确认按钮
    confirm () {
      let works = new myWorker();
      startLoading("body", "数据转换中，请稍等...");
      try {
        if (this.fileObj.fileType == "xls") {
          works.postMessage({
            list: JSON.stringify(this.dataArray),
            projectionValue: this.projectionValue,
            distObj: {
              distX: this.distX,
              distY: this.distY
            },
            dataType: this.dialogInfor.type,
            iconText: this.dialogInfor.iconText,
            iconName: this.dialogInfor.assetsName,
            lineColor: this.dialogInfor.lineColor,
            fileName: this.fileObj.fileName,
            data_index: this.dataSetObj.dataRowNum,
          }); // 2 给works发送参数
          works.onmessage = (event) => {
            // 6. 接收works的数据并处理操作
            if (event && event.data) {
              this.getSaveData(event.data);
              let obj = {};
              let arr = [...this.uploadedFilesList];
              obj = {
                ...this.fileInfor,
                assets_type: this.dialogInfor.assetsName,
              };
              arr.push(obj);

              this.setStateItem({
                key: "uploadedFilesList",
                value: arr,
              });
            } else {
              ElMessage.error("数据处理失败，请检查配置选择参数是否正确.");
            }
            endLoading();
            this.close();
            works.terminate(); // 7 关闭works主线程
          };
        } else {
          works.postMessage({
            list: JSON.stringify(this.dataArray),
            dataType: this.dialogInfor.type,
            iconText: this.dialogInfor.iconText,
            iconName: this.dialogInfor.assetsName,
            fileName: this.fileObj.fileName,
            data_index: this.dataSetObj.dataRowNum,
            lineColor: this.dialogInfor.lineColor,
          }); // 2 给works发送参数
          works.onmessage = (event) => {
            //   // 6. 接收works的数据并处理操作
            if (event && event.data) {
              this.getSaveData(event.data);
              let obj = {};
              let arr = [...this.uploadedFilesList];
              // this.getSaveData(this.dataArray);
              obj = {
                ...this.fileInfor,
                assets_type: this.dialogInfor.assetsName,
              };
              arr.push(obj);
              console.log("初始化数据");
              // console.log(arr)
              this.setStateItem({
                key: "uploadedFilesList",
                value: arr,
              });
            } else {
              ElMessage.error("数据处理失败，请检查配置选择参数是否正确.");
            }
            endLoading();
            this.close();
            works.terminate(); // 7 关闭works主线程
          };
        }
      } catch (e) {
        ElMessage.error("数据处理失败，请检查配置选择参数是否正确。");

        endLoading();
        // this.close();
        works.terminate(); // 7 关闭works主线程
        console.log(
          "数据读取处理转换（4326/4490）发生错误,需要检查是否选择对了 原数据坐标系"
        );
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    margin-top: 8% !important;
  }

  .el-dialog__body {
    min-height: 400px;
  }

  .el-upload-dragger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 220px;
    background: rgba(1, 144, 227, 0.06);
    border-radius: 2px;
    border-color: $color_theme;
  }

  .example-showcase .el-loading-mask {
    z-index: 99999;
  }
}

.selectFile {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .label {
    margin-bottom: 10px;
  }

  .upload-box {
    margin-top: 20px;
    width: 100%;
    height: 216px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;

    .upload-demo {
      width: 100%;
      height: 100%;
    }

    .upload_text {
      cursor: pointer;
      color: $color_theme;
      border-radius: 2px;
      border: 1px solid $color_theme;
      padding: 6px 14px;
    }
  }
}

.dataSet {
  margin-top: 20px;
  padding: 0 40px;
}

.content {
  .inputBox {
    display: flex;
    white-space: nowrap;
    align-items: center;
    margin-bottom: 10px;

    .label {
      padding-right: 10px;
    }
  }

  .config {
    border: 1px solid #eee;
    height: 350px;
    overflow: auto;

    li {
      display: flex;
      line-height: 40px;

      .li-left {
        flex: 2;
        overflow: auto;
        padding-left: 10px;
      }

      .li-right {
        flex: 3;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
      }
    }

    .first {
      div {
        font-weight: 500;
        color: rgba(31, 38, 62, 0.5);
        line-height: 22px;
        padding: 6px 14px;
      }

      .bg {
        background: #f1f1f1;
      }
    }
  }
}

.result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 18%;

  p {
    margin-top: 20px;
  }
}
</style>
