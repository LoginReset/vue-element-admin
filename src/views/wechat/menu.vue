<template>
  <div class="components-container board">
    <menuContent :key="1" :list="list" @on-change-list="changeList" />
    <el-button
      style="margin-left: 10px;"
      type="primary"
      @click="synch2wechat"
    >
      同步到微信
    </el-button>
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
          { name: '子菜单1', uuid: 1 },
          { name: '子菜单2', uuid: 2 },
          { name: '子菜单3', uuid: 3 },
          { name: '子菜单4', uuid: 4 }
        ]
      },
      {
        name: '父菜单2',
        uuid: 20,
        sub_button: [
          { name: '子菜单5', uuid: 5 },
          { name: '子菜单6', uuid: 6 },
          { name: '子菜单7', uuid: 7 }
        ]
      },
      {
        name: '父菜单3',
        uuid: 30,
        sub_button: [
          { name: '子菜单8', uuid: 8 },
          { name: '子菜单9', uuid: 9 },
          { name: '子菜单10', uuid: 10 }
        ]
      }
      ]
    }
  },
  methods: {
    synch2wechat() {
      console.log(this.list)
    },
    changeList(val) {
      this.list = val
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
