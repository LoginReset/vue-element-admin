<template>
  <div ref="content">
    <xayah
      :id="id"
      v-model="images"
      :urls="urls"
      :max="5"
      simple
      :config="config"
      @callback="callback"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import iView from 'iview'
Vue.use(iView) // xayah 依赖iView 此代码必须
import 'iview/dist/styles/iview.css'

import xayah from 'xayah'
Vue.use(xayah)

export default {
  name: 'Index',
  data() {
    return {
      images: [
        {
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585839566914&di=d978a3e492f4cd072a89abefa1bd03d1&imgtype=0&src=http%3A%2F%2Fimg.jk51.com%2Fimg_jk51%2F184357491.jpeg'
        }, {
          url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2439243355,2644723109&fm=26&gp=0.jpg'
        }
      ],
      urls: {
        // index: '/dev-api/vue-element-admin/xayah/file/list',    //获取文件地址
        index: 'http://localhost:8080/b/xayah', // 获取文件地址
        // upload: '/dev-api/vue-element-admin/xayah/create',   //上传地址
        upload: 'http://localhost:8080/b/xayah/upload', // 上传地址
        // create: '/dev-api/vue-element-admin/xayah/create',   //创建目录地址
        create: 'http://localhost:8080/b/xayah/create', // 创建目录地址
        check: '', // 检查文件唯一
        policy: 'http://localhost:8080/b/xayah/policy', // 获取上传策略地址
        delete: 'http://localhost:8080/b/xayah/delete', // 删除文件或目录地址
        return: 'http://localhost:8080/b/xayah/return', // 本地回调地址
        visible: 'http://localhost:8080/b/xayah/visible',
        rename: 'http://localhost:8080/b/xayah/rename',
      },
      id: 'editorImage',
      max: 5,
      config: {
        // last:true,//显示插件版本
        debug: true,
        random: false,
        size: 0,
        format: [
          'jpg', 'png', 'jpeg','docx'
        ],
        style: '?x-oss-process=style/thumb',
        key: 'id',
        gateway: 'oss', // 设置网关 网关 oss,qiniu 默认oss
        // prefix:"",//目录前缀
        // module:"",//模块名
        document: true, // 是否隐藏文档链接
        resource: true,// 是否隐藏源码链接
        // folder:true,//是否允许上传目录
        isShowInsertImgBtn:false,
        width:"80%",
      }
    }
  },
  methods: {
    callback(val) {
      console.log(val)
    }
  },
  mounted(){
    // console.log(this.$refs.content.clientWidth)
  }
}
</script>

<style scoped>

</style>
