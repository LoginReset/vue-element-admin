<template>
  <div class="components-container board">
    <el-button
      style="margin-left: 10px;margin-bottom: 30px"
      type="success"
      icon="el-icon-plus"
      @click="handleParentMenu">
      添加菜单
    </el-button>
    <!--    微信菜单主体-->
    <menuContent :key="1" :list="list" @on-change-list="changeList" @editMenu="handleUpdate"
                 @addChildMenu="handleChildMenu"/>
    <el-popconfirm @onConfirm="synch2wechat"
      title="确定将菜单同步到微信公众号吗？">
      <el-button
        slot="reference"
        style="margin-left: 10px;margin-top: 30px"
        type="primary"
        icon="el-icon-refresh">
        同步到微信
      </el-button>
    </el-popconfirm>
    <el-button
      style="margin-left: 10px;margin-top: 30px"
      type="success"
      icon="el-icon-upload"
      :loading="saveMenuLoading"
      @click="saveMenu">
      保存菜单
    </el-button>
    <!--form表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" placeholder="请输入菜单标题"/>
        </el-form-item>
        <el-form-item label="type" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio label="view">view</el-radio>
            <el-radio label="click">click</el-radio>
            <el-radio label="miniprogram">miniprogram</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type==='view'||temp.type==='miniprogram'" label="url" prop="url">
          <el-input v-model="temp.url" placeholder="请输入网页链接"/>
        </el-form-item>
        <el-form-item label="key" v-if="temp.type==='click'" prop="key">
          <el-input v-model="temp.key" placeholder="请输入菜单KEY值"/>
        </el-form-item>
        <el-form-item label="appid" v-if="temp.type==='miniprogram'" prop="appid">
          <el-input v-model="temp.appid" placeholder="请输入小程序的appid"/>
        </el-form-item>
        <el-form-item label="pagepath" v-if="temp.type==='miniprogram'" prop="pagepath">
          <el-input v-model="temp.pagepath" placeholder="请输入小程序的页面路径"/>
        </el-form-item>
        <!--        <el-form-item :label="$t('table.status')">-->
        <!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
        <!--            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item :label="$t('table.importance')">-->
        <!--          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item :label="$t('table.remark')">-->
        <!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" v-if="delMenuVisible" @click="delMenu">
          删除
        </el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import menuContent from './components/menu-content'

  export default {
    name: 'Menu',
    components: {
      menuContent
    },
    data() {
      return {
        group: 'mission',
        list: [{
          name: '父菜单1',
          uuid: 10,
          sub_button: [
            {name: '子菜单1', uuid: 1},
            {name: '子菜单2', uuid: 2},
            {name: '子菜单3', uuid: 3},
            {name: '子菜单4', uuid: 4}
          ]
        },
          {
            name: '父菜单2',
            uuid: 20,
            sub_button: [
              {name: '子菜单5', uuid: 5},
              {name: '子菜单6', uuid: 6},
              {name: '子菜单7', uuid: 7}
            ]
          },
          // {
          //   name: '父菜单3',
          //   uuid: 30,
          //   sub_button: [
          //     {name: '子菜单8', uuid: 8},
          //     {name: '子菜单9', uuid: 9},
          //     {name: '子菜单10', uuid: 10}
          //   ]
          // }
        ],
        //dialog参数
        temp: {
          name: "",
          type: "view",
          url: "",
          key: "",
          appid: "",
          pagepath: "",
        },
        handleMenu: [-1, -1],//[pIndex,cIndex],pIndex=-1为添加父菜单，cIndex=-1为添加子菜单
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          name: [{required: true, message: '请输入菜单标题', trigger: 'blur'}],
          url: [{required: true, message: '请输入网页链接', trigger: 'blur'}],
          key: [{required: true, message: '请输入菜单KEY值', trigger: 'blur'}],
          appid: [{required: true, message: '请输入小程序的appid', trigger: 'blur'}],
          pagepath: [{required: true, message: '请输入小程序的页面路径', trigger: 'blur'}],
        },
        delMenuVisible: false,//删除菜单按钮
        saveMenuLoading:false,//
      }
    },
    methods: {
      synch2wechat() {//同步到微信
        console.log(this.list)
      },
      resetTemp() {
        this.temp = {
          name: "",
          type: "view",
          url: "",
          key: "",
          appid: "",
          pagepath: "",
        }
      },
      handleParentMenu() {//显示添加主菜单form
        if (this.list.length >= 3) {
          this.$message({
            message: '主菜单不能大于三个',
            type: 'warning'
          });
          return;
        }
        this.handleMenu = [-1, -1];
        this.delMenuVisible = false;
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleChildMenu(pIndex) {//显示添加子菜单
        if (this.list[pIndex].sub_button.length >= 5) {
          this.$message({
            message: '子菜单不能大于五个',
            type: 'warning'
          });
          return;
        }
        this.handleMenu = [pIndex, -1];
        this.delMenuVisible = false;
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(pIndex, cIndex) {
        this.handleMenu = [pIndex, cIndex];
        this.delMenuVisible = true;
        let item;
        if (cIndex === -1) {//编辑主菜单
          item = this.list[pIndex];
        } else {
          item = this.list[pIndex].sub_button[cIndex];
        }
        this.temp.name = item.name;
        this.temp.type = item.type;
        this.temp.url = item.url;
        this.temp.key = item.key;
        this.temp.appid = item.appid;
        this.temp.pagepath = item.pagepath;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        });
        console.log(pIndex + "*" + cIndex);
      },
      delMenu() {//删除菜单
        console.log(this.handleMenu)
      },
      changeList(val) {
        this.list = val;
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp);
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp);
          }
        })
      },
      saveMenu() {//保存菜单
        console.log(1)
        this.saveMenuLoading=true;
        setTimeout(()=>{
          this.saveMenuLoading=false;
        },5000);

      }
    },
    computed: {
      typeUrl() {
        if (this.temp.type === "view" || this.temp.type === "miniprogram") {
          return this.temp.url;
        }
        return ""
      },
      typeKey() {
        if (this.temp.type === "click") {
          return this.temp.key;
        }
        return ""
      }
    }
  }
</script>

<style lang="scss">
  /*.board {*/
  /*width: 1000px;*/
  /*margin-left: 20px;*/
  /*display: flex;*/
  /*justify-content: space-around;*/
  /*flex-direction: row;*/
  /*align-items: flex-start;*/
  /*}*/

  /*.kanban {*/
  /*&.todo {*/
  /*.board-column-header {*/
  /*background: #4A9FF9;*/
  /*}*/
  /*}*/
  /*&.working {*/
  /*.board-column-header {*/
  /*background: #f9944a;*/
  /*}*/
  /*}*/
  /*&.done {*/
  /*.board-column-header {*/
  /*background: #2ac06d;*/
  /*}*/
  /*}*/
  /*}*/
</style>
