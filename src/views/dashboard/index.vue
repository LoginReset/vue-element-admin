<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import {getHome} from '@/api/ele'

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
      'roles', 'roleName','ele'
    ])
  },
  created() {
    console.log(this.roleName)

    if (this.roleName.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }else{
      this.currentRole = 'editorDashboard'
    }
    this.getList()

  },
  methods:{
    getList(){
      this.$store.dispatch('user/getElement') //获取首页element各个数量
    },
  }
}
</script>
