<template>
  <div>
    <h1>选择对应的数据</h1>
    <el-button type="primary" @click="openSelectFile('point')">选择管点</el-button>
    <el-button type="primary" @click="openSelectFile('line')">选择管线</el-button>
    <el-button type="primary" @click="openSelectFile('shp')">选择shp文件</el-button>
    <el-button type="primary" @click="cleanData()">清除数据</el-button>
    <el-button type="primary" @click="mathData()">开始计算</el-button>
    <el-table :data="tableData" border>
      <el-table-column prop="field_name" label="字段名称" width="180" />
      <el-table-column prop="field_type" label="字段类型" width="180" />
      <el-table-column prop="field_remarks" label="备注" width="200" />
      <el-table-column label="数据类型" width="120" align="center">
        <template #default="{ row }">
          {{ getDataTypeLabel(row.data_type)["label"] }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" align="center" />
      <el-table-column label="过期提示" width="120" align="center">
        <template #default="{ row }">
          {{
            row.data_type === "date" && row.time_prompt_status === 1
            ? "已启用"
            : ""
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h1>管点位地址:{{ pointFile }}</h1>
    <h1>管线地址:{{ lineFile }}</h1>
    <h1>
      未关联的点位
      <el-button style="margin-left: 30px" type="primary" size="small"
        @click="downloadFile(warnData.pointNotLine, '未关联的点位')">下载</el-button>
    </h1>
    <div>数量：{{ warnData.pointNotLine.length }}个</div>
    <div>
      {{ warnData.pointNotLineStr }}
    </div>
    <h1>
      管线未找到管点
      <el-button style="margin-left: 30px" type="primary" size="small"
        @click="downloadFile(warnData.LineNotPoint, '管线未找到管点')">下载</el-button>
    </h1>
    <div>
      {{ warnData.LineNotPoint.length }}
    </div>
    <h1>管线坐标与关联点位相差较大(>50米)</h1>
    <div>
      {{ warnData.notNear.length }}
    </div>
    <h1>管线长度超过2000米)</h1>
    <div>
      {{ warnData.notNearCmath.length }}
    </div>

    <el-dialog v-model="dialogFormVisible" title="新增字段">
      <el-form v-loading="dialogFormLoading" :model="form">
        <el-form-item label="字段名称" :label-width="formLabelWidth">
          <el-input v-model="form.field_name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="字段说明" :label-width="formLabelWidth">
          <el-input v-model="form.field_remarks" autocomplete="off" placeholder="对字段进行说明" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="form.sort" :step="1" :min="0" step-strictly />
        </el-form-item>
        <el-form-item label="数据类型" :label-width="formLabelWidth">
          <el-select v-model="form.data_type" placeholder="请选择" @change="dataTypeChangeHandle">
            <el-option v-for="item in dataType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.data_type === 'date'" label="日期过期提示" :label-width="formLabelWidth">
          <el-switch v-model="form.time_prompt_status" inline-prompt :active-value="1" :inactive-value="0" active-text="开"
            inactive-text="关" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hiddenDialogForm">取 消</el-button>
          <el-button :loading="dialogFormLoading" type="primary" @click="addHandle">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-ui";
import db from "@/utils/db";
const fs = require("fs");
import { ipcRenderer } from "electron";
const { dialog } = require("electron");
import { Check } from "@/js/check/check.js";
import { exportExcelFile } from "../../utils/index";

//子进程
// const {dialog} = require("electron").remote;
export default {
  name: "Tables",
  props: {},
  data () {
    return {
      dialogFormVisible: false,
      dialogFormLoading: false,
      formLabelWidth: "120px",
      tableName: "store_info",
      formType: "add",
      instFilePics: [],
      check: null,
      form: {
        field_name: "",
        field_type: "text",
        field_remarks: "",
        sort: 0,
        data_type: "input",
        time_prompt_status: 0, // 日期过期提示
      },
      fieldType: [
        { name: "文本类型", value: "text" },
        { name: "数字整型", value: "integer" },
        { name: "数字浮点型（有小数点）", value: "blob" },
      ],
      tableData: [],
      dataType: [
        { label: "字符文本", value: "input", field_type: "text" },
        { label: "数字", value: "number", field_type: "integer" },
        { label: "日期", value: "date", field_type: "text" },
        { label: "时间", value: "time", field_type: "text" },
        { label: "图像", value: "image", field_type: "text" },
      ],
      lineFile: null,
      pointFile: null,
      warnData: {
        pointNotLine: [],
        pointNotLineStr: "",
        LineNotPoint: [],
        notNear: [],
        notNearCmath: [],
      },
    };
  },
  created () {
    this.getList();
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.check = new Check();
      this.check.setMathCallback((obj) => {
        this.warnData = obj;
      });
      ipcRenderer.on("openSelectFileSelect", (event, files) => {
        let filePaths = files.filePaths;
        if (files.type == "point") {
          this.pointFile = filePaths[0];
          this.check.setPoint(filePaths);
        } else if (files.type == "line") {
          this.lineFile = filePaths[0];
          this.check.setLine(filePaths);
        } else if (files.type == "shp") {
          this.check.analysisShp(filePaths);
        }
        console.log(files); //输出选择的文件yarn add xlsx
      });
    },
    // 下载文件的方法
    downloadFile (data, filename) {
      if (data.length === 0) return;
      exportExcelFile(filename, data);
    },
    openSelectFile (type) {
      let data = {};
      data.type = type;
      ipcRenderer.send("openSelectFile", data);
    },

    cleanData () {
      this.lineFile = null;
      this.pointFile = null;
      this.check.cleanData();
    },

    mathData () {
      this.check.mathData();
    },
    // 读取文件为base64数据
    readImageToBase64 () {
      // item是个path
      fs.readFile(item, function (err, data) {
        if (err) {
          // console.log(err);
        } else {
          // base64图片编码字符串
          imgSrcList.push("data:image/jpg;base64," + data.toString("base64"));
        }
      });
    },
    getDataTypeLabel (val) {
      for (var i in this.dataType) {
        if (this.dataType[i].value === val) {
          return this.dataType[i];
        }
      }
    },
    dataTypeChangeHandle (val) {
      this.form.field_type = this.getDataTypeLabel(val)["field_type"];
    },
    getList () {
      var sqlStr = `select * from fields where table_name='${this.tableName}' order by sort DESC;`;
      db.select(sqlStr).then(
        (res) => {
          var newData = [];
          for (var i in res) {
            if (res[i].is_key !== 1) {
              newData.push(res[i]);
            }
          }
          this.tableData = newData;
          console.log(res);
        },
        (err) => {
          console.log("error：", err);
        }
      );
    },
    showEdit (row) {
      this.formType = "edit";
      this.showDialog();
      this.getFind(row.id);
    },
    getFind (id) {
      var sqlStr = `select * from fields where id=${id};`;
      db.select(sqlStr).then(
        (res) => {
          if (res.length > 0) {
            console.log(res);
            this.form = res[0];
          }
        },
        (err) => {
          console.log("error：", err);
        }
      );
    },
    showDialogForm () {
      this.formType = "add";
      this.showDialog();
    },
    showDialog () {
      this.form = {
        field_name: "",
        field_type: "",
        field_remarks: "",
        time_prompt_status: 0,
      };
      this.dialogFormLoading = false;
      this.dialogFormVisible = true;
    },
    hiddenDialogForm () {
      this.dialogFormLoading = false;
      this.dialogFormVisible = false;
    },
    delHandle (row) {
      db.db.serialize(() => {
        // var alSql = `ALTER TABLE ${row.tableName} DROP COLUMN ${row.field_name};`
        db.select("PRAGMA  table_info('" + row.table_name + "');").then(
          (res) => {
            if (res) {
              var fields = [];
              for (var k = 0; k < res.length; ++k) {
                // 判断自定义结构表中的字段是否在表中已生成
                if (row.field_name !== res[k].name) {
                  fields.push(res[k].name);
                }
              }
              var fieldStr = fields.join(",");
              var currentTime = parseInt(new Date().getTime() / 1000);
              var tempTableName = `temp_new_${row.table_name}_${currentTime}`;
              var tempTableNameOld = `temp_old_${row.table_name}_${currentTime}`;
              // 复制表
              var sql = `create table ${tempTableName} as SELECT ${fieldStr} FROM ${row.table_name} where 1 = 1`;
              db.db.run(sql, (err) => {
                if (err) {
                  console.log(err, 1);
                  ElMessage.error("删除失败1");
                } else {
                  // 删除原表
                  // db.db.run(`drop table ${row.table_name};`, (err) => {
                  // 原表改名字
                  db.db.run(
                    `alter table ${row.table_name} rename to ${tempTableNameOld};`,
                    (err) => {
                      if (err) {
                        console.log(err, 2);
                        ElMessage.error("删除失败2");
                      } else {
                        // 修改复制表的表名为原表名
                        db.db.run(
                          `alter table ${tempTableName} rename to ${row.table_name};`,
                          (err) => {
                            if (err) {
                              console.log(err, 3);
                              ElMessage.error("删除失败3");
                            } else {
                              // 删除结构表中的数据字段
                              db.db.run(
                                `DELETE FROM fields WHERE table_name='${row.table_name}' AND field_name='${row.field_name}'`,
                                (err) => {
                                  if (err) {
                                    console.log(err, 4);
                                    ElMessage.error("删除失败4");
                                  } else {
                                    this.hiddenDialogForm();
                                    this.getList();
                                    ElMessage.success({
                                      message: "操作成功",
                                      type: "success",
                                    });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        );
      });
    },
    addHandle () {
      if (this.formType === "add") {
        this.addTable(this.tableName, this.form);
      } else if (this.formType === "edit") {
        this.editHandle(this.form.id, this.form);
      }
    },
    editHandle (id, data) {
      var fields = "";
      for (var key in data) {
        if (key === "id") {
          continue;
        }
        if (data.field_type === "integer") {
          fields += `,${key}=${data[key]}`;
        } else if (data.field_type === "text") {
          fields += `,${key}='${data[key]}'`;
        }
      }
      if (fields === "") {
        return;
      }
      fields = fields.slice(1);
      db.db.serialize(() => {
        db.db.run(`update fields set ${fields} where id=${id} `, (err) => {
          if (err) {
            console.log(err, 1);
            ElMessage.error("更新数据失败");
          } else {
            ElMessage.success("完成");
            this.$emit("success", true);
            this.hiddenDialogForm();
            this.getList();
          }
        });
      });
    },
    addTable (tableName, fieldInfo) {
      db.select("PRAGMA  table_info('" + tableName + "');").then((res) => {
        if (res) {
          var yes = false;
          for (var k = 0; k < res.length; ++k) {
            // 判断自定义结构表中的字段是否在表中已生成
            if (fieldInfo.field_name === res[k].name) {
              yes = true;
              ElMessage.error("字段已存在");
              break;
            }
          }
          // 表中没有生成字段则创建字段
          if (yes === false) {
            var insertData = [];
            fieldInfo["table_name"] = tableName;
            var fields = "";
            var fieldsZWF = "";
            for (var key in fieldInfo) {
              insertData.push(fieldInfo[key]);
              fields += `,${key}`;
              fieldsZWF += `,?`;
            }
            if (insertData.length > 0) {
              fields = fields.slice(1);
              fieldsZWF = fieldsZWF.slice(1);
            }
            // var insertData = [
            //   tableName,
            //   fieldInfo.field_name,
            //   fieldInfo.field_type,
            //   fieldInfo.field_remarks,
            //   fieldInfo.sort,
            //   fieldInfo.data_type
            // ]
            db.db.serialize(() => {
              db.db.run(
                `INSERT INTO fields (${fields}) VALUES (${fieldsZWF})`,
                insertData,
                (err) => {
                  if (err) {
                    console.log(err, 1);
                    ElMessage.error("创建失败1");
                  } else {
                    var alSql =
                      "ALTER TABLE " +
                      tableName +
                      " ADD " +
                      fieldInfo.field_name +
                      " " +
                      fieldInfo.field_type +
                      ";";
                    db.db.run(alSql, (err2) => {
                      if (err2 != null) {
                        console.log(err2, 2);
                        ElMessage.error("创建失败2");
                        db.db.run(
                          `delete from fields where table_name='${tableName}' and field_name='${fieldInfo.field_name}'`
                        );
                      } else {
                        ElMessage.success({
                          message: "创建成功",
                          type: "success",
                        });
                        this.hiddenDialogForm();
                        this.getList();
                      }
                    });
                  }
                }
              );
            });
          }
        }
      });

      // // 根据表名获取表结构
      // var getTableFields = (tableName) => {
      //   return new Promise((resolve, _reject) => {
      //     const fieldStr = "PRAGMA  table_info('" + tableName + "');"
      //     console.log(fieldStr)
      //     db.db.queryData(fieldStr, (fieldDatas) => {
      //       resolve(fieldDatas)
      //     })
      //   })
      // }
      // getTableFields(tableName).then((res2) => {
      //   var yes = false
      //   for (var k = 0; k < res2.length; ++k) {
      //     // 判断自定义结构表中的字段是否在表中已生成
      //     if (fieldInfo.field_name === res2[k].name) {
      //       yes = true
      //       break
      //     }
      //   }
      //   // 表中没有生成字段则创建字段
      //   if (yes === false) {
      //     var alSql = 'ALTER TABLE ' + tableName + ' ADD ' + fieldInfo.field_name + ' ' + fieldInfo.field_type + ';'
      //     createTable(alSql).then((res) => {
      //       if (res === true) {
      //         ElMessage.success({
      //           message: '创建成功',
      //           type: 'success'
      //         })
      //         this.hiddenDialogForm()
      //       } else {
      //         ElMessage.error('创建失败')
      //       }
      //     })
      //   }
      // })
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
