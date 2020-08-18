const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  directFlag: state => state.tagsView.directFlag,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  roleName: state => state.user.roleName,
  permission_routes: state => state.permission.routes,
  permission_addRoutes: state => state.permission.addRoutes,
  // permission_btn: state => state.permission.permission,
  errorLogs: state => state.errorLog.logs
}
export default getters
