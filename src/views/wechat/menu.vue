<template>
  <div class="components-container board">
    <el-button
      style="margin-left: 10px;margin-bottom: 30px"
      type="success"
      icon="el-icon-plus"
      @click="handleParentMenu"
    >
      添加菜单
    </el-button>
    <!--    微信菜单主体-->

    <menuContent
      :key="1"
      :list="list"
      @on-change-list="changeList"
      @editMenu="handleUpdate"
      @addChildMenu="handleChildMenu"
    />
    <el-popconfirm
      title="确定将菜单同步到微信公众号吗？"
      @onConfirm="synch2wechat"
    >
      <el-button
        slot="reference"
        style="margin-left: 10px;margin-top: 30px"
        type="primary"
        icon="el-icon-refresh"
      >
        同步到微信
      </el-button>
    </el-popconfirm>
    <el-popconfirm
      title="确定将菜单保存吗？"
      @onConfirm="saveMenu"
    >
      <el-button
        slot="reference"
        style="margin-left: 10px;margin-top: 30px"
        type="success"
        icon="el-icon-upload"
        :loading="saveMenuLoading"
      >
        保存菜单
      </el-button>
    </el-popconfirm>
    <!--form表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:8%;">
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="type" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio label="view" @click.native.prevent="clickitem('view')">view</el-radio>
            <el-radio label="click" @click.native.prevent="clickitem('click')">click</el-radio>
            <el-radio label="miniprogram" @click.native.prevent="clickitem('miniprogram')">miniprogram</el-radio>
            <el-radio label="media_id" @click.native.prevent="clickitem('media_id')">media_id</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type==='view'||temp.type==='miniprogram'" label="url" prop="url">
          <el-input v-model="temp.url" placeholder="请输入网页链接以http://或https://开头" />
        </el-form-item>
        <el-form-item v-if="temp.type==='click'" label="key" prop="key">
          <el-input v-model="temp.key" placeholder="请输入菜单KEY值" />
        </el-form-item>
        <el-form-item v-if="temp.type==='miniprogram'" label="appid" prop="appid">
          <el-input v-model="temp.appid" placeholder="请输入小程序的appid" />
        </el-form-item>
        <el-form-item v-if="temp.type==='miniprogram'" label="pagepath" prop="pagepath">
          <el-input v-model="temp.pagepath" placeholder="请输入小程序的页面路径" />
        </el-form-item>
        <el-form-item v-if="temp.type==='media_id'" label="media_id" prop="media_id">
          <el-input v-model="temp.media_id" placeholder="请输入media_id" />
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
        <el-button v-if="delMenuVisible" type="danger" @click="delMenu">
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
import { postMenu, getMenu, postSynchMenu } from '@/api/wechat'

export default {
  name: 'Menu',
  components: {
    menuContent
  },
  data() {
    return {
      group: 'mission',
      list: [

      ],
      // dialog参数
      temp: {
        name: '',
        type: 'view',
        url: '',
        key: '',
        appid: '',
        pagepath: '',
        media_id: ''
      },
      handleMenu: [-1, -1], // [pIndex,cIndex],pIndex=-1为添加父菜单，cIndex=-1为添加子菜单
      dialogFormVisible: false,
      dialogStatus: '',
      addFather: false,
      pIndex: '',
      cIndex: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [{ required: true, message: '请输入菜单标题', trigger: 'change' }],
        url: [{ required: true, message: '请输入正确网页链接',
          // pattern:/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
          pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
          trigger: 'change' }],
        key: [{ required: true, message: '请输入菜单KEY值', trigger: 'change' }],
        appid: [{ required: true, message: '请输入小程序的appid', trigger: 'change' }],
        pagepath: [{ required: true, message: '请输入正确页面路径',
          pattern: /^[a-zA-Z]:(((\\(?! )[^/:*?<>\""|\\]+)+\\?)|(\\)?)\s*$/, trigger: 'change' }],
        media_id: [{ required: true, message: '请输入media_id', trigger: 'change' }]
      },
      delMenuVisible: false, // 删除菜单按钮
      saveMenuLoading: false//
    }
  },
  computed: {
    typeUrl() {
      if (this.temp.type === 'view' || this.temp.type === 'miniprogram') {
        return this.temp.url
      }
      return ''
    },
    typeKey() {
      if (this.temp.type === 'click') {
        return this.temp.key
      }
      return ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clickitem(label) {
      label === this.temp.type ? this.temp.type = '' : this.temp.type = label
    },
    // 获取菜单
    getList() {
      this.listLoading = true
      getMenu().then(response => {
        this.list = JSON.parse(response.respObj.content).button
        this.list.forEach(item => {
          if (!item.sub_button) {
            item['sub_button'] = []
          }
        })

        // Just to simulate the time of the request
        // setTimeout(() => {
        this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    synch2wechat() { // 同步到微信
      var data = {}
      const content = this.jsonData()

      data.content = content
      postSynchMenu(data).then(response => {
        this.$notify({
          title: '成功',
          message: '同步成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        type: 'view',
        url: '',
        key: '',
        appid: '',
        pagepath: '',
        media_id: ''
      }
    },
    handleParentMenu() { // 显示添加主菜单form
      if (this.list.length >= 3) {
        this.$message({
          message: '主菜单不能大于三个',
          type: 'warning'
        })
        return
      }
      this.handleMenu = [-1, -1]
      this.delMenuVisible = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.addFather = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleChildMenu(pIndex) { // 显示添加子菜单
      if (this.list[pIndex].sub_button && this.list[pIndex].sub_button.length >= 5) {
        this.$message({
          message: '子菜单不能大于五个',
          type: 'warning'
        })
        return
      }

      this.handleMenu = [pIndex, -1]
      this.delMenuVisible = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(pIndex, cIndex) {
      this.handleMenu = [pIndex, cIndex]
      this.delMenuVisible = true
      let item
      if (cIndex === -1) { // 编辑主菜单
        item = this.list[pIndex]
      } else {
        item = this.list[pIndex].sub_button[cIndex]
      }
      this.temp.name = item.name
      this.temp.type = item.type
      this.temp.url = item.url
      this.temp.key = item.key
      this.temp.appid = item.appid
      this.temp.pagepath = item.pagepath
      this.temp.media_id = item.media_id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.pIndex = pIndex
      this.cIndex = cIndex
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(pIndex + '*' + cIndex)
    },
    delMenu() { // 删除菜单
      // 删除父菜单
      if (this.handleMenu[1] === -1) {
        this.list.splice(this.handleMenu[0], 1)
      } else {
        // 删除子菜单
        this.list[this.handleMenu[0]].sub_button.splice(this.handleMenu[1], 1)
        JSON.stringify(this.list[0])
        const pObj = this.list[this.handleMenu[0]]
        this.list.splice(this.handleMenu[0], 1, pObj)
        JSON.stringify(this.list[0])

        if (this.list[this.handleMenu[0]].sub_button.length === 0) {
          delete (this.list[this.handleMenu[0]]['sub_button'])
        }
      }
      this.dialogFormVisible = false
      JSON.stringify(this.list)
    },
    changeList(val) {
      this.list = val
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 添加父菜单
          if (this.addFather) {
            const plist = {}
            for (const item in this.temp) {
              if (this.temp[item] !== '') {
                this.temp[item] = this.temp[item].trim()
                plist[item] = this.temp[item]
                plist['sub_button'] = []
              }
            }
            this.list.push(plist)

            console.log(JSON.stringify(this.list))
          } else {
            // 添加子菜单
            const index = this.handleMenu[0]// 父index
            // 父菜单有type属性添加子菜单时添加sub_button保留name属性
            // if(this.list[index].sub_button === undefined){
            //   for(let key in this.list[index]){
            //     if(key !== "name"){
            //       delete this.list[index][key];
            //     }
            //     this.list[index].sub_button = [];
            //   }
            // }
            // 父菜单有type属性添加子菜单时添加sub_button保留其他属性

            const clist = {}
            for (const item in this.temp) {
              if (this.temp[item] !== '') {
                clist[item] = this.temp[item]
              }
            }
            if (this.list[index].sub_button === undefined) {
              this.list[index].sub_button = []
            }
            this.list[index].sub_button.push(clist)
            const pObj = this.list[index]
            this.list.splice(index, 1, pObj)
            console.log(JSON.stringify(this.list))
          }
          this.dialogFormVisible = false
          this.addFather = false
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = {}
          for (const key in this.temp) {
            if (this.temp[key] !== undefined) {
              this.temp[key] = this.temp[key].trim()
              temp[key] = this.temp[key]
            }
          }
          // 子菜单修改
          if (this.cIndex !== -1) {
            this.list[this.pIndex].sub_button.splice(this.cIndex, 1, temp)
            const pObj = this.list[this.pIndex]
            this.list.splice(this.pIndex, 1, pObj)
          } else {
            // 父菜单修改
            temp.sub_button = this.list[this.pIndex].sub_button
            this.list.splice(this.pIndex, 1, temp)
          }
          console.log(JSON.stringify(this.list))
        }
      })
      this.dialogFormVisible = false
    },
    saveMenu() { // 保存菜单
      var data = {}
      // this.jsonData()
      const content = this.jsonData()
      data.content = content
      this.saveMenuLoading = true
      // setTimeout(() => {
      // }, 2000)
      postMenu(data).then(response => {
        this.saveMenuLoading = false
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    jsonData() {
      console.log(this.list)
      this.list.forEach(item => {
        console.log(item)
        console.log(item.hasOwnProperty('sub_button'))
        if (item && item['sub_button'] && item.sub_button.length === 0) {
          delete item.sub_button
        }
      })
      const data = {}
      data.button = this.list
      return JSON.stringify(data)
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
