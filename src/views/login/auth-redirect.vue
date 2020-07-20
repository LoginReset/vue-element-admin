<script>
export default {
  name: 'AuthRedirect',
  created() {
    const hash = window.location.search.slice(1)
    if (window.localStorage) {
      debugger
      window.localStorage.setItem('x-admin-oauth-code', hash)
      // console.log(window.localStorage.getItem('x-admin-oauth-code'))
      window.close()
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
