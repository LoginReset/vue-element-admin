<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left">
        Your roles:
        <span class="pan-info-roles">{{ roleName }}</span>
      </pan-thumb>
      <!-- <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" /> -->
      <div class="info-container">
        <span class="display_name">{{ username}}</span>
        <span style="font-size:20px;display:inline-block;">欢迎管理员{{name}}使用后台管理系统</span>
      </div>
    </div>
    <!-- <panel-group  @handleSetLineChartData="handleSetLineChartData" /> -->
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOS } from '@/utils/auth'

import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'

import PanelGroup from '../admin/components/PanelGroup'

const lineChartData = {
  // newVisitis: {
  //   // expectedData: [100, 120, 161, 134, 105, 160, 165],
  //   // actualData: [120, 82, 91, 154, 162, 140, 145]
  // },
  // messages: {
  //   // expectedData: [200, 192, 120, 144, 160, 130, 140],
  //   // actualData: [180, 160, 151, 106, 145, 150, 130]
  // },
  // elRank: {
  //   // expectedData: [80, 100, 121, 104, 105, 90, 100],
  //   // actualData: [120, 90, 100, 138, 142, 130, 130]
  // },
  // shoppings: {
  //   // expectedData: [130, 140, 141, 142, 145, 150, 160],
  //   // actualData: [120, 82, 91, 154, 162, 140, 130]
  // }
}
export default {
  name: 'DashboardEditor',
  components: { 
    PanThumb, 
    GithubCorner,
    PanelGroup 
  },
  
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      lineChartData: lineChartData.newVisitis
     
    }
  },
  computed: {
    username:{
      get(){
        let account = JSON.parse(getOS()).username
        return account
      }
    },
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'roleName'
    ])
  },
  
  methods:{
    // handleSetLineChartData(type) {
      
    //   console.log(type)
    //   if(type==='elRank'){
    //     this.$router.push({name:'element-rank'})
    //   }else if(type==='elType'){
    //     this.$router.push({name:'element-type'})
    //   }else if(type==='elSum'){
    //     this.$router.push({name:'element-manage'})
    //   }else if(type==='elName'){
    //     this.$router.push({name:'element-name'})
    //   }
    //   // this.lineChartData = lineChartData[type]
    // }
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 40px;
        line-height: 40px;
        color: #525669;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
