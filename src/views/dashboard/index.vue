<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles', 'roleName','mq'
    ])
  },
  created() {
    this.getList()
    console.log(this.roleName)
    if (this.roleName.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }else{
      this.currentRole = 'editorDashboard'

    }
  },
  methods:{
    getList(){
      console.log(123)
      console.log('这是mq',this.mq)
      this.$store.dispatch('user/getMq') //获取首页mq各个数量
    }
  }
}
</script>
