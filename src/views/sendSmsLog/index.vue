<template>
  <div class="table">
    <div>
      <el-form ref="queryForm" :inline="true" :rules="rulesForm" :model="queryForm" size="medium">
        <el-form-item label="ID" prop="id">
          <el-input v-model="queryForm.id" placeholder="请输入ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="msgRecver">
          <el-input v-model="queryForm.msgRecver" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择" clearable style="width: 150px;">
            <el-option key="" label="全部" value=""></el-option>
            <el-option key="01" label="处理成功" value="01"></el-option>
            <el-option key="99" label="处理失败" value="99"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="chaxun">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search('queryForm')">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-box">
      <el-button type="primary" size="small" @click.native="toAddInfo">新增</el-button>
    </div>
    <el-table border align="center" :data="tableData" style="width: 100%" ref="multipleTable" v-loading="loading"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="msgRecver" label="手机号码"></el-table-column>
      <el-table-column prop="content" label="短信内容"></el-table-column>
      <el-table-column prop="tlrNo" label="操作人"></el-table-column>
      <el-table-column prop="instNo" label="操作机构"></el-table-column>
      <el-table-column prop="serialNo" label="流水号"></el-table-column>
      <el-table-column prop="seatNo" label="台席号"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="serviceId" label="服务标识"></el-table-column>
      <el-table-column prop="customInfo" label="自定义内容" width="170"></el-table-column>
      <el-table-column prop="createTimeStr" label="创建时间" width="170"></el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="warning" icon="el-icon-edit"
                     @click="toHandleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete"
                     @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="paginations.page_index"
        :page-size="paginations.page_size"
        :layout="paginations.layout"
        :total="paginations.total">
      </el-pagination>
    </div>
    <!---------------------------------------- 新增修改表单的 Dialog   start-->
    <el-dialog :title="addDialogForm.titles" :visible.sync="addDialogFormVisible" width="60%"
               :close-on-click-modal="closeFlag">
      <el-form :model="addDialogForm" :rules="addDialogFormRules" ref="addDialogForm" label-position="right"
               label-width="80px">
        <!--  隐藏input   修改时用-->
        <!--<el-input v-model="addDialogForm.id" v-if="1>2"></el-input>-->
        <el-form-item label="ID" prop="id">
          <el-input v-model="addDialogForm.id" placeholder="请输入ID" clearable style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="msgRecver">
          <el-input v-model="addDialogForm.msgRecver" placeholder="请输入手机号码" clearable style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addDialogForm.content" placeholder="请输入内容" clearable style="width: 280px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="addInfo('addDialogForm')">确定</el-button>
      </div>
    </el-dialog>
    <!---------------------------------------- 新增修改表单的 Dialog   end-->
  </div>
</template>

<script>

  export default {
    name: 'SendSmsLog',
    data: function () {
      return {
        //查询表单正则验证
        rulesForm: {
          id: [
            {min: 1, max: 20, message: 'ID长度在 1 到 20个字符', trigger: 'blur'}
          ],
          msgRecver: [
            {min: 1, max: 11, message: '手机号码长度在 1 到 11个字符', trigger: 'blur'}
          ]
        },//新增的正则表单验证
        addDialogFormRules: {
          id: [
            {min: 1, max: 20, message: 'ID长度在 1 到 20个字符', trigger: 'blur'}
          ],
          msgRecver: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {min: 1, max: 11, message: '手机号码长度在 1 到 11个字符', trigger: 'blur'}
          ],
          content: [
            {min: 1, max: 100, message: '手机号码长度在 1 到 100个字符', trigger: 'blur'}
          ]

        },
        paginations: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 10,   // 1页显示多少条
          layout: "total,prev, pager, next,jumper"   // 翻页属性
        },
        closeFlag: false,
        edit: '',//区分是新增还是编辑
        addDialogForm: {},
        addDialogFormVisible: false,
        tableData: [],
        queryForm: {
          status: ''
        },
        loading: true,
        listUrl: "/bic/sendsmslog/findPageQuery",//查询
        queryUrlById: 'http://192.168.125.6:8080/bic/sendsmslog/findDetailById',//根据ID查询
        addUrl: "http://192.168.125.6:8080/bic/sendsmslog/save",//新增
        updateUrl:'http://192.168.125.6:8080/bic/sendsmslog/update',//修改
        delUrl: 'http://192.168.125.6:8080/bic/sendsmslog/delete',//删除
      }
    }, created() {
      this.getData();
    }, methods: {
      //表格多选框
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //上下分页
      handleCurrentChange(page) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            this.paginations.page_index = page;
            this.getData();
          } else {
            this.tableData = [];
            this.paginations.total = 0;
          }
        });
      },
      //获取查询表单参数
      getData() {
        console.log("listUrl:" + this.listUrl);
        let params = {
          'pageNo': this.paginations.page_index,
          'pageSize': this.paginations.page_size,
          'orderByColumn': 'create_time', //排序字段
          'orderByType': 'desc', //排序类型
          'id': this.queryForm.id,
          'msgRecver': this.queryForm.msgRecver,
          'status': this.queryForm.status,
        }
        console.log(params);
        this.queryListParams(this.listUrl, params);
      },
      queryListParams(url, params) {
        this.loading = true;
        console.log('参数', params)
        this.$request({
          url: '/bic/sendsmslog/findPageQuery',
          method: 'post',
          data: params
        }).then(res => {
          console.log('res查询', res)
           if (res.retCode == '1') {//1标识返回成功
            this.tableData = [];
            this.paginations.total = res.data.totalCount;//总条数
            this.paginations.page_size = res.data.pageSize;//每页显示数量
            this.paginations.page_index = res.data.pageNo;//当前页码
            this.tableData = res.data.items;//返回的数据
          } else {
            this.$message.error(res.retMessage);
          }
        });

        this.loading = false;
      },
      //点击查询按钮触发
      search(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.paginations.page_index = 1;
            this.getData();
          }
        });
      },
      toAddInfo() {//跳转至新增
        this.edit = '';
        this.addDialogFormVisible = true;
        this.addDialogForm = {
          titles: '新增'
        };
        this.closeFlag = false;
        if (this.$refs['addDialogForm'] !== undefined) {
          this.$refs['addDialogForm'].resetFields();
        }
      },
      addInfo(form) {//新增操作
        this.$refs[form].validate((valid) => {
          if (valid) {
            //不为空时走编辑逻辑
            if (this.edit != "") {
              this.handleUpdate(form);
            } else {
              //新增参数
              let params = {
                'id': this.addDialogForm.id,
                'msgRecver': this.addDialogForm.msgRecver,
                'content': this.addDialogForm.content,
                'status': '01',
              };
              console.log(params);
              this.$request({
                url: '/bic/sendsmslog/save',
                method: 'post',
                data: params
              }).then((res) => {
                if (res.retCode == '1') {
                  this.addDialogFormVisible = false;
                  this.queryForm = {status: ''};
                  this.getData();//新增完毕后调用查询接口
                } else {
                  this.$message.error(res.retMessage);
                }
              });
            }
          } else {
            this.$message.warning("请检查表单必输项!");
            return false;
          }
        });
      },
      toHandleEdit(index, row) {//跳转至编辑
        this.edit = 'edit';
        if (this.$refs['addDialogForm'] !== undefined) {
          this.$refs['addDialogForm'].resetFields();
        }
        let params = {
          'id': row.id
        };
        this.$request({
          url: '/bic/sendsmslog/findDetailById',
          method: 'post',
          data: params
        }).then((res) => {
          if (res.retCode == '1') {
            this.addDialogForm = {
              titles: '修改',
              id: res.data.id + "",
              msgRecver: res.data.msgRecver,
              content: res.data.content
            };
            this.addDialogFormVisible = true;
          } else {
            this.$message.error(res.retMessage);
          }
        }).catch(function (err) {
          console.log("加载失败!" + err);
        });
      },
      handleUpdate(form) {//修改
        this.$refs[form].validate((valid) => {
          if (valid) {
            //修改参数
            let params = {
              'id': this.addDialogForm.id,
              'msgRecver': this.addDialogForm.msgRecver,
              'content': this.addDialogForm.content,
            };
            console.log(params);
            this.$request({
              url: '/bic/sendsmslog/update',
              method: 'post',
              data: params
            }).then((res) => {
              if (res.retCode == '1') {
                this.addDialogFormVisible = false;
                this.getData();//修改完毕后调用查询接口
              } else {
                this.$message.error(res.retMessage);
              }
            });
          } else {
            this.$message.warning("请检查表单必输项!");
            return false;
          }
        })
      },
      handleDelete(index, row) {//删除
        //参数
        let params = {
          'id': row.id
        };
        console.log(params);
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(params);
          this.$request({
            url: '/bic/sendsmslog/delete',
            method: 'post',
            data: params
          }).then((res) => {
            if (res.retCode == '1') {
              this.$message.success("删除成功!");
              this.getData();
            } else {
              this.$message.error(res.retMessage);
            }
          });
        });
      }
    }
  }
</script>

<style>
  .handle-box {
    margin-bottom: 15px;
  }
  .pagination {
    margin-top: 10px;
  }
</style>
