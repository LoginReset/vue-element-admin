<template>
  <el-row :gutter="100"  class="panel-group" v-if="eleR.roles">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="ele.componet>0&&eleR.manage">
      <div class="card-panel" @click="handleSetLineChartData('elSum')" >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="sum" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            元器件总数
          </div>
          <count-to :start-val="0" :end-val="ele.componet" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="ele.elementName>0&&eleR.name">
      <div class="card-panel" @click="handleSetLineChartData('elName')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="name" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            元件种类
          </div>
          <count-to :start-val="0" :end-val="ele.elementName" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="ele.elementRank>0&&eleR.rank">
      <div class="card-panel" @click="handleSetLineChartData('elRank')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="rank" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            元件级别
          </div>
          <count-to :start-val="0" :end-val="ele.elementRank" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="ele.elementType>0&&eleR.type">
      <div class="card-panel" @click="handleSetLineChartData('elType')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="type" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            元件类型
          </div>
          <count-to :start-val="0" :end-val="ele.elementType" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import {getHome} from '@/api/ele'
import store from '@/store'
// let ele = window.ses
export default {
  components: {
    CountTo
  },
  // props:{
    
  //   componet:{
  //     type:Number,
  //     default:0
  //   },
  //   elementName:{
  //     type:Number,
  //     default:0
  //   },
  //   elementType:{
  //     type:Number,
  //     default:0
  //   },
  //   elementRank:{
  //     type:Number,
  //     default:0
  //   }
  // },
  data(){
    return{
      
      // componet:0,
      // elementName:0,
      // elementType:0,
      // elementRank:0
    }
  },
  computed:{
    // this.getList()
    ...mapGetters([
      'ele','eleR'
    ])
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
