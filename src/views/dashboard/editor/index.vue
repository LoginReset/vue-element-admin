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
    <panel-group  @handleSetLineChartData="handleSetLineChartData" />
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
    handleSetLineChartData(type) {
      
      console.log(type)
      if(type==='product'){
        this.$router.push({name:'product-manage'})
      }else if(type==='mqUser'){
        this.$router.push({name:'device-manage'})
      }else if(type==='version'){
        this.$router.push({name:'version-manage'})
      }else if(type==='register'){
        this.$router.push({name:'device-history'})
      }else if(type==='mqUnused'){ //未投入设备
        this.$router.push({name:'version-batch',params:{checkVersion:false}})
      }else if(type==='mqUse'){ //投入设备
        this.$router.push({name:'version-batch'})
      }
      // this.lineChartData = lineChartData[type]
    }
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
