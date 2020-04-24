<template>
  <div class="board-column">
    <draggable
      v-model="listMenu"
      :animation="800"
      class="menu-content"
      group="parent-menu"
      @end="datadragEnd"
    >
      <div v-for="(pItem,pIndex) in listMenu" :key="pItem.uuid" class="parent-menu">
        <div class="board-column-header" :class="'board-column-header-'+pIndex" @click="editMenu(pIndex,-1)">
          {{ pItem.name }}
        </div>
        <draggable
          v-model="pItem.sub_button"
          draggable=".item"
          :animation="800"
          group="child-menu"
          class="board-column-content"
          @start="datadragStart"
          @end="datadragEnd"
          @add="datadragAdd"
        >
          <div v-for="(cItem,cIndex) in pItem.sub_button" :key="cItem.uuid" class="board-item item" @click="editMenu(pIndex,cIndex)">
            {{ cItem.name }}
          </div>
          <div slot="footer" class="board-item" @click="addChildMenu(pIndex)">添加子菜单</div>
        </draggable>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'MenuItem',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      copyList: null// 拖动菜单之前的数据拷贝
    }
  },
  computed: {
    listMenu: {
      get() {
        return this.list
      },
      set(val) {
        // 改变由父组件控制
        console.log('调用修改', val)
        this.$emit('on-change-list', val)
      }
    }
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    datadragUpdate(evt) {
      evt.preventDefault()
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
    },
    datadragStart(evt) {
      evt.preventDefault()
      this.copyList = JSON.parse(JSON.stringify(this.list))
      console.log(this.copyList)
    },
    datadragEnd(evt) {
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      for (const pMenu of this.list) {
        const cList = pMenu.sub_button
        if (cList && cList.length > 5) {
          this.$notify({
            title: '警告',
            message: '最多支持5个子菜单',
            type: 'warning'
          })
          console.log('copyList', this.copyList)
          // setTimeout(()=>{
          //   console.log("定时器")
          this.listMenu = this.copyList
          // },500);
        }
      }
    },
    datadragAdd(evt) {
      evt.preventDefault()
      console.log('添加')
    },
    addPeople() {
      console.log(this.list)
    },
    editMenu(pIndex,cIndex){//编辑菜单
      this.$emit("editMenu",pIndex,cIndex);
    },
    addChildMenu(pIndex){
      this.$emit("addChildMenu",pIndex);
    }
  }
}
</script>

<style lang="scss" scoped>

  .board-column {

    .menu-content {
      display: flex;
      align-items: flex-start;
    }

    .parent-menu {
      min-width: 300px;
      min-height: 100px;
      /*height: auto;*/
      overflow: hidden;
      background: #f0f0f0;
      border-radius: 3px;
      margin-right: 20px;
    }

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 64px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 54px;
        padding: 5px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }

    .board-column-header-0 {
      background: #4A9FF9;
    }
    .board-column-header-1 {
      background: #f9944a;
    }
    .board-column-header-2 {
      background: #2ac06d;
    }
  }

</style>
