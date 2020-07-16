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
      'roles', 'roleName'
    ])
  },
  created() {
    console.log(11111)
    console.log(this.roleName)
    if (this.roleName.includes('admin')) {
      this.currentRole = 'adminDashboard'
    }else{
      this.currentRole = 'editorDashboard'

    }
  }
}
</script>
