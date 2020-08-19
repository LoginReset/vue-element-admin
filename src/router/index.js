import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/change',
    component: Layout,
    children: [
      {
        path: 'password',
        component: () => import('@/views/dashboard/password'),
        name: 'changePwd',
        meta: { title: '修改密码', icon: 'documentation' },
        hidden: true
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'password',
        component: () => import('@/views/dashboard/password'),
        name: 'changePwd',
        meta: { title: '修改密码', icon: 'documentation'},
        hidden:true
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation'}
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/element',
    component: Layout,
    redirect: '/element/manage',
    alwaysShow: true, // will always show the root menu
    name: 'element',
    meta: {
      title: '元器件管理',
      icon: 'element',
      roles: ['element']
    }, children: [
      {
        path: 'manage',
        component: () => import('@/views/element/manage'),
        name: 'element-manage',
        meta: {
          title: '元器件规格',
          roles: ['element-manage']
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/element/redirect'),
        name: 'element-edit',
        meta: {
          title: '元件规格编辑',
          roles: ['element-manage:edit'],
          activeMenu: '/element/manage',
        },
        hidden:true

      },{
        path: 'create',
        component: () => import('@/views/element/redirect'),
        name: 'element-create',
        meta: {
          title: '创建元件规格',
          roles: ['element-manage:add']
        },
        hidden:true
      },
      {
        path: 'name',
        component: () => import('@/views/element/name'),
        name: 'element-name',
        meta: {
          title: '元件名称',
          roles: ['element-name']
        }
      },
      {
        path: 'rank',
        component: () => import('@/views/element/rank'),
        name: 'element-rank',
        meta: {
          title: '元件级别',
          roles: ['element-rank']
        }
      },
      {
        path: 'type',
        component: () => import('@/views/element/type'),
        name: 'element-type',
        meta: {
          title: '元件类型',
          roles: ['element-type']
        }
      }
    ]
  },  {
    path: '/bom',
    component: Layout,
    redirect: '/bom/manage',
    alwaysShow: true, // will always show the root menu
    name: 'bom',
    meta: {
      title: 'bom清单管理',
      icon: 'bom',
      roles: ['bom']
    }, children: [
      {
        path: 'manage',
        component: () => import('@/views/bom/manage'),
        name: 'bom-manage',
        meta: {
          title: 'bom清单造价',
          roles: ['bom-manage']
        }
      }
    ]
  },
  // {
  //   path: '/ctl',
  //   component: Layout,
  //   redirect: '/ctl/device-list',
  //   alwaysShow: true, 
  //   name: 'ctl',
  //   meta: {
  //     title: '控制面板',
  //     icon: 'ctl',
  //     roles: ['ctl']
  //   }, children: [
  //     {
  //       path: 'device-list',
  //       component: () => import('@/views/wechat/components/device-list'),
  //       name: 'DeviceList',
  //       meta: {
  //         title: '控制面板',
  //         roles: ['ctl-manage']
  //       }
        // children: [
        //   {
        //     path: 'panel',
        //     component: () => import('@/views/wechat/ctlPanel'),
        //     name: 'panel',
        //     meta: {
        //       title: '控制面板',
        //       roles: ['file-manage']
        //       // roles: ['admin'] // or you can only set roles in sub nav
        //     },
        //     // hidden: true
        //   },
        //   {
        //     path: 'superSet',
        //     component: () => import('@/views/wechat/ctlPanel/superSet'),
        //     name: 'panel',
        //     meta: {
        //       title: '控制面板',
        //       roles: ['file-manage']
        //       // roles: ['admin'] // or you can only set roles in sub nav
        //     },
        //     hidden: true,
        //     activeMenu: '/ctl'
        //   },
        //   {
        //     path: 'sysSet',
        //     component: () => import('@/views/wechat/ctlPanel/sysSet'),
        //     name: 'panel',
        //     meta: {
        //       title: '控制面板',
        //       roles: ['file-manage']
        //       // roles: ['admin'] // or you can only set roles in sub nav
        //     },
        //     hidden: true,
        //     activeMenu: '/ctl/device-list'
        //   }
        // ]

    //   }
    // ]
  // },
//    {
//     path:'/device',
//     component:Layout,
//     redirect: '/device/manage',
//     alwaysShow: true, // will always show the root menu
//     name: 'device',
//     meta:{
//       title:'设备管理',
//       icon: 'shebei2',
//       roles:['device']
//     },children:[
//       {
//         path: 'manage',
//         component: () => import('@/views/device/manage'),
//         name: 'device-manage',
//         meta: {
//           title: '设备管理',
//           roles: ['device-manage']
//         }
//       },{
//         path: 'user',
//         component: () => import('@/views/device/user'),
//         name: 'device-user',
//         meta: {
//           title: '用户设备',
//           roles: ['device-user']
//         }
//       }
//     ]


// },{
//     path: '/enterprise',
//     component: Layout,
//     redirect: '/enterprise/manage',
//     alwaysShow: true, // will always show the root menu
//     name: 'enterprise',
//     meta: {
//       title: '企业管理',
//       icon: '111',
//       roles: ['enterprise']
//     }, children: [
//       {
//         path: 'manage',
//         component: () => import('@/views/enterprise/manage'),
//         name: 'enterprise-manage',
//         meta: {
//           title: '企业管理',
//           roles: ['enterprise-manage']
//         }
//       },
//       {
//         path: 'logo',
//         component: () => import('@/views/enterprise/logo'),
//         name: 'enterprise-logo',
//         meta: {
//           title: 'logo管理',
//           roles: ['enterprise-logo']
//         }
//       }
//     ]
//   },{
//       path:'/advertise',
//       component:Layout,
//       redirect: '/advertise/manage',
//       alwaysShow: true, // will always show the root menu
//       name: 'advertise',
//       meta:{
//         title:'广告管理',
//         icon: 'guanggao',
//         roles:['advertise']
//       },children:[
//         {
//           path: 'manage',
//           component: () => import('@/views/advertise/manage'),
//           name: 'advertise-manage',
//           meta: {
//             title: '广告管理',
//             roles: ['advertise-manage']
//           }
//         }
//       ]


//   },
  // {
  //   path: '/file',
  //   component: Layout,
  //   redirect: '/file/manage',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'file',
  //   meta: {
  //     title: '文件管理',
  //     icon: 'excel',
  //     roles: ['file']
  //     // roles: ['admin', 'editor'] // you can set roles in root nav
  //   }, children: [
  //     {
  //       path: 'manage',
  //       component: () => import('@/views/file/index'),
  //       name: 'Index',
  //       meta: {
  //         title: '文件管理',
  //         roles: ['file-manage']
  //         // roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/wechat',
  //   name: 'userManage',
  //   alwaysShow: true,
  //   meta: {
  //     title: '用户管理',
  //     icon: 'user',
  //     roles: ['user']
  //   },
  //   children: [
  //     {
  //       path:'wechat',
  //       component: () => import('@/views/user/wechat'),
  //       name:'user-wechat',
  //       meta: {
  //         title: '微信用户',
  //         roles: ['user-wechat']
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/wechat',
  //   component: Layout,
  //   redirect: '/wechat/menu',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'wechat',
  //   meta: {
  //     title: '微信管理',
  //     icon: 'wechat1',
  //     roles: ['wechat']
  //     // roles: ['admin', 'editor'] // you can set roles in root nav
  //   }, children: [
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/wechat/menu'),
  //       name: 'wehcat-menu',
  //       meta: {
  //         title: '自定义菜单',
  //         roles: ['wechat-menu']
  //       }
  //     },
      //  {
      //   path: 'msgTemp',
      //   component: () => import('@/views/wechat/msgTemp'),
      //   name: 'wehcat-msgTemp',
      //   meta: {
      //     title: '微信消息模板',
      //     roles: ['wechat-menu']

      //     // roles: ['admin'] // or you can only set roles in sub nav
      //   }
      // }, {
      //   path: 'create',
      //   component: () => import('@/views/wechat/msgRedirect'),
      //   name: 'createMsgTemp',
      //   meta: {
      //     title: '创建消息模板',
      //     roles: ['wechat-menu']
      //     // roles: ['admin'] // or you can only set roles in sub nav
      //   }
      // }, {
      //   path: 'edit',
      //   component: () => import('@/views/wechat/msgRedirect'),
      //   name: 'editMsgTemp',
      //   meta: {
      //     title: '编辑消息模板',
      //     roles: ['wechat-menu'],
      //     activeMenu: '/wechat/msgTemp'
      //     // roles: ['admin'] // or you can only set roles in sub nav
      //   },
      //   hidden: true
      // }
  //   ]
  // },
  // {
  //   path: '/sms',
  //   component: Layout,
  //   redirect: '/sms/account',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'sms',
  //   meta: {
  //     title: '短信管理',
  //     icon: 'message',
  //     roles: ['sms']
  //   },
  //   children: [{
  //     path: 'account',
  //     component: () => import('@/views/sms/account'),
  //     name: 'account',
  //     meta: {
  //       title: '短信账号',
  //       roles: ['sms-account'],
  //     }
  //   }, {
  //     path: 'template',
  //     component: () => import('@/views/sms/templates'),
  //     name: 'template',
  //     meta: {
  //       title: '短信模板',
  //       roles: ['sms-template'],
  //       buttons: ['add', 'download', 'edit', 'switch', 'select']

  //     }
  //   }, {
  //     path: 'create',
  //     component: () => import('@/views/sms/redirectPage'),
  //     name: 'createTemplate',
  //     meta: {
  //       title: '创建短信模板',
  //       roles: ['sms-create']
  //     }
  //   }, {
  //     path: 'edit',
  //     component: () => import('@/views/sms/redirectPage'),
  //     name: 'editTemplate',
  //     meta: {
  //       title: '编辑短信模板', noCache: false, activeMenu: '/sms/template', roles: ['sms-edit'] },
  //     hidden: true
  //   }]
  // },
  // {
  //   path: '/msgPush',
  //   component: Layout,
  //   redirect: '/msgPush/smsTemp',
  //   alwaysShow: true,
  //   name: 'msgPush',
  //   meta: {
  //     title: '消息推送',
  //     icon: 'icon-test',
  //     roles: ['msgPush']
  //   },
  //   children: [
  //     {
  //       path: 'smsTemp',
  //       component: () => import('@/views/msgPush/smsPushTemp'),
  //       name: 'smsTemp',
  //       meta: {
  //         title: '短信推送配置',
  //         roles: ['msgPush-smsTemp']

  //         // roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'wechatTemp',
  //       component: () => import('@/views/msgPush/wechatPushTemp'),
  //       name: 'wechatTemp',
  //       meta: {
  //         title: '微信推送配置',
  //         roles: ['msgPush-wechatTemp']

  //         // roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'create',
  //       component: () => import('@/views/msgPush/pushRedirect'),
  //       name: 'create-pushTemp',
  //       meta: {
  //         title: '创建推送模板',
  //         roles: ['msgPush-create'],
  //         // roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     }, {
  //       path: 'edit',
  //       component: () => import('@/views/msgPush/pushRedirect'),
  //       name: 'edit-pushTemp',
  //       meta: {
  //         title: '编辑推送模板',
  //         noCache: false,
  //         activeMenu: '/msgPush/wechatTemp',
  //         roles: ['msgPush-edit'] },
  //         hidden: true
  //     }
  //   ]
  // },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    alwaysShow: true, // will always show the root menu
    name: 'sys',
    meta: {
      title: '系统管理',
      icon: 'lock',
      roles: ['sys']

      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/sys/user'),
        name: 'user',
        meta: {
          title: '系统管理员',
          roles: ['sys-user']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          title: '管理员角色',
          roles: ['sys-role']
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/sys/permission'),
        name: 'permission',
        
        meta: {
          title: '系统权限',
          roles: ['sys-permission']
          // roles: ['admin'] // or you can only set roles in sub nav
        }
       },
      // {
      //   path: 'fieldName',
      //   component: () => import('@/views/sys/fieldName'),
      //   name: 'fieldName',
      //   meta: {
      //     title: '全局字段',
      //     roles: ['sys-fieldName']
      //     // roles: ['admin'] // or you can only set roles in sub nav
      //   }
      // }, {
      //   path: 'secretKey',
      //   component: () => import('@/views/sys/secretKey'),
      //   name: 'secretKey',
      //   meta: {
      //     title: '密钥管理',
      //     roles: ['sys-secretKey']
      //   }
      // }, {
      //   path: 'province',
      //   component: () => import('@/views/sys/province'),
      //   name: 'province',
      //   meta: {
      //     title: '省份管理',
      //     roles: ['sys-province']
      //   }
      // },
      {
        path: 'login-log',
        component: () => import('@/views/sys/login-log'),
        name: 'loginLog',
        meta: {
          title: '登录日志',
          roles: ['sys-login-log']
        }
      },
      {
        path: 'operation-log',
        component: () => import('@/views/sys/operation-log'),
        name: 'operation-log',
        meta: {
          title: '操作日志',
          roles: ['sys-operation-log']
        }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['permission']
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['permission-page']

  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission',
  //         roles: ['permission-directive']

  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'rolePermission',
  //         roles: ['permission-role']

  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   meta: {
  //     roles: ['icon']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', roles: ['icon'], noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example',
  //     roles: ['example']
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit', roles: ['example-create'] }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list', roles: ['example-edit'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list', roles: ['example-list'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   meta: {
  //     roles: ['tab']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab', roles: ['tab'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404',
  //     roles: ['error']
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true, roles: ['error-401'] }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true, roles: ['error-404'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   meta: {
  //     roles: ['error-log']
  //   },
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug', roles: ['error-log'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel',
  //     roles: ['excel']
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel', roles: ['export-excel'] }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel', roles: ['export-selected-excel'] }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'mergeHeader', roles: ['export-merge-header'] }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel', roles: ['upload-excel'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'zip', icon: 'zip', roles: ['zip'] },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip', roles: ['zip-download'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   meta: {
  //     roles: ['pdf']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'pdf', icon: 'pdf', roles: ['pdf'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   meta: {
  //     roles: ['pdf-download']
  //   },
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   meta: {
  //     roles: ['theme']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme', roles: ['theme'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   meta: { roles: ['theme'] },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard', roles: ['theme'] }
  //     }
  //   ]
  // },

  {
    path: '/i18n',
    component: Layout,
    meta: {
      // roles: ['i18n']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   meta: {
  //     roles: ['external-link']
  //   },
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link', roles: ['external-link'] }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
