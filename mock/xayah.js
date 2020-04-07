export default [
  // user login
  {
    url: '/vue-element-admin/xayah/policy',
    type: 'get',
    response: config => {
      console.log(config)
      return {
        "data": {
          "token": "JQ4aZNe87tA2FG-I01lxp7kJArP6opY_renx7MU:Tg8Zrx5XIVNY4fwhHK9nX200UcM=:eyJzY29wZSI6InRlbHN0YXRpYyIsImRlYWRsaW5lIjoxNTQ2NDg2NjE4fQ==",
          "key": ""
        },
        "expire": "3600"
      }

    }
  },
  {
    url: '/vue-element-admin/xayah/file/list',
    type: 'get',
    response: config => {
      console.log(config.body)
      return {
        "children": {
          "current_page": 2,
          "data": [
            {
              "id": 7,
              "target_id": 1,
              "pid": 1,
              "path": "https://appall02.baidupcs.com/file/f39b77c67a2609d5bc8afd60005fe6a1?bkt=en-9917cc7abd88e3cbb85b5935e39ebe8ae78ba28941affa7485b1fc1487a5424160156cd9c3de2b36b4daa0983b064edbe57aac3ebd384eb183b77ccc38b83b67&fid=844491070-250528-71880279276407&time=1585844196&sign=FDTAXGERQlBHSKfW-DCb740ccc5511e5e8fedcff06b081203-5hw70GToykeis6uAdm886LXKN70%3D&to=135&size=19314&sta_dx=19314&sta_cs=0&sta_ft=docx&sta_ct=7&sta_mt=7&fm2=MH%2CNanjing02%2CAnywhere%2C%2Csichuan%2Cct&ctime=1446469988&mtime=1493864166&resv0=0&resv1=0&resv2=rlim&resv3=5&resv4=19314&vuk=1379396622&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-704160fda0d30dbc97208491b98c5c58dc888ed830f89eb53e0b7f8a3881eae3d198cab64d2b4cf1fa5f725048c6216c48003f7e853f1e24305a5e1275657320&expires=8h&rt=sh&r=592548746&vbdid=2614406652&fin=%E8%AE%BF%E9%97%AE%E5%91%98%E8%BF%9B%E5%BA%97%E6%8B%8D%E7%85%A7%E7%82%B9%E5%8F%8A%E6%8B%8D%E6%91%84%E6%AD%A5%E9%AA%A4.docx&fn=%E8%AE%BF%E9%97%AE%E5%91%98%E8%BF%9B%E5%BA%97%E6%8B%8D%E7%85%A7%E7%82%B9%E5%8F%8A%E6%8B%8D%E6%91%84%E6%AD%A5%E9%AA%A4.docx&rtype=1&dp-logid=2157199717171106893&dp-callid=0.1&hps=1&tsl=0&csl=0&fsl=0&csign=asmKerOA25YmiIiTljREJFFT%2FMs%3D&so=0&ut=6&uter=4&serv=0&uc=2970450506&ti=39965399e74cce845d6eec5ae69768cb6a312ff0a99cc0ae&reqlabel=250528_f_8e019a9cdb3564a1ad9e7b440326e6ab_-1_f03d4fea309c9cf4764cb882189249cf&by=themis",
              "module": "default",
              "name": "test",
              "gateway": "oss",
              "host": "//test.oss-cn-shanghai.aliyuncs.com",
              "bucket": "test",
              "ext": "",
              "type": "folder",
              "size": 0,
              "width": 0,
              "height": 0,
              "sort": 255,
              "order": 0,
              "checked": false,
              "visible": 0,
              "use_times": 0,
              "created_at": "2019-07-27T15:18:21+08:00",
              "updated_at": "2019-07-27T15:18:21+08:00",
              "deleted_at": null
            },
            {
              "id": 12,
              "target_id": 1,
              "pid": 1,
              "path":"acxcv",
              "url":"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2439243355,2644723109&fm=26&gp=0.jpg",
              "module": "default",
              "name": "1233.mp3",
              "bucket": "test",
              "ext": "",
              "type": "file",
              "size": 10,
              "width": 0,
              "height": 0,
              "sort": 0,
              "order": 0,
              "checked": false,
              "visible": 0,
              "use_times": 0,
              "created_at": "2019-07-28T17:36:58+08:00",
              "updated_at": "2019-07-28T17:36:58+08:00",
              "deleted_at": null
            },
            {
              "id": 16,
              "pid": 1,
              "path":"32432",
              "name": "demo",
              "type": "folder",
              "size": 0,
              "url":"https://appall02.baidupcs.com/file/f39b77c67a2609d5bc8afd60005fe6a1?bkt=en-9917cc7abd88e3cbb85b5935e39ebe8ae78ba28941affa7485b1fc1487a5424160156cd9c3de2b36b4daa0983b064edbe57aac3ebd384eb183b77ccc38b83b67&fid=844491070-250528-71880279276407&time=1585844196&sign=FDTAXGERQlBHSKfW-DCb740ccc5511e5e8fedcff06b081203-5hw70GToykeis6uAdm886LXKN70%3D&to=135&size=19314&sta_dx=19314&sta_cs=0&sta_ft=docx&sta_ct=7&sta_mt=7&fm2=MH%2CNanjing02%2CAnywhere%2C%2Csichuan%2Cct&ctime=1446469988&mtime=1493864166&resv0=0&resv1=0&resv2=rlim&resv3=5&resv4=19314&vuk=1379396622&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-704160fda0d30dbc97208491b98c5c58dc888ed830f89eb53e0b7f8a3881eae3d198cab64d2b4cf1fa5f725048c6216c48003f7e853f1e24305a5e1275657320&expires=8h&rt=sh&r=592548746&vbdid=2614406652&fin=%E8%AE%BF%E9%97%AE%E5%91%98%E8%BF%9B%E5%BA%97%E6%8B%8D%E7%85%A7%E7%82%B9%E5%8F%8A%E6%8B%8D%E6%91%84%E6%AD%A5%E9%AA%A4.docx&fn=%E8%AE%BF%E9%97%AE%E5%91%98%E8%BF%9B%E5%BA%97%E6%8B%8D%E7%85%A7%E7%82%B9%E5%8F%8A%E6%8B%8D%E6%91%84%E6%AD%A5%E9%AA%A4.docx&rtype=1&dp-logid=2157199717171106893&dp-callid=0.1&hps=1&tsl=0&csl=0&fsl=0&csign=asmKerOA25YmiIiTljREJFFT%2FMs%3D&so=0&ut=6&uter=4&serv=0&uc=2970450506&ti=39965399e74cce845d6eec5ae69768cb6a312ff0a99cc0ae&reqlabel=250528_f_8e019a9cdb3564a1ad9e7b440326e6ab_-1_f03d4fea309c9cf4764cb882189249cf&by=themis",
              "checked": false,
              "visible": 0,
              "created_at": "2019-07-28T18:26:35+08:00",
            }
          ],
          "first_page_url": "safsdaf",
          "form": 1,
          "last_page": 0,
          "last_page_url": "safsdaf",
          "next_page": 2,
          "next_page_url": "safsadf",
          "path": "",
          "per_page": 3,
          "prev_page_url": "sdfdsaf",
          "to": 15,
          "total": 300
        },
        "parent": {
          // "id": 1,
          // "target_id": 1,
          "pid": 0,
          // "path": "rakan/default/8VWmyW71",
          // "module": "default",
          // "name": "root",
          // "gateway": "oss",
          // "host": "//test.oss-cn-shanghai.aliyuncs.com",
          // "bucket": "test",
          // "ext": "",
          // "type": "folder",
          // "size": 0,
          // "width": 0,
          // "height": 0,
          // "sort": 255,
          // "order": 0,
          // "checked": false,
          // "visible": 0,
          // "use_times": 0,
          // "created_at": "2019-07-27T12:45:32+08:00",
          // "updated_at": "2019-07-27T12:45:32+08:00",
          // "deleted_at": null
        }
      }
    //   {
    //     "parent": {
    //       "id": "1",
    //       "path": "platform/q47G4R",
    //       "name": "Root",
    //       "type": "folder",
    //       "pid": 0,
    //       "module": "admin",
    //       "target_id": 1,
    //       "sort": 255,
    //       "updated_at": "2018-08-21 20:07:39",
    //       "created_at": "2018-08-21 20:07:39",
    //       "url": null,
    //       "checked": false
    //     },
    //     "children": {
    //       "current_page": 1,
    //       "data": [
    //         {
    //           "id": "2",
    //           "pid": "1",
    //           "path": "platform/q47G4R/test1",
    //           "name": "test1",
    //           "type":"file",
    //           "sort": 255,
    //           "updated_at": "2018-08-23 09:12:15",
    //           "created_at": "2018-08-23 09:12:15",
    //           "url": null,
    //         },
    //         {
    //           "id": "3",
    //           "pid": "1",
    //           "path": "platform/q47G4R/test2",
    //           "name": "test2",
    //           "target_id": 1,
    //           "type":"file",
    //           "sort": 255,
    //           "updated_at": "2018-08-23 09:12:15",
    //           "created_at": "2018-08-23 09:12:15",
    //           "url": "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2439243355,2644723109&fm=26&gp=0.jpg",
    //         },
    //         {
    //           "id": "4",
    //           "pid": "1",
    //           "name": "test3",
    //           "visible":0,
    //           "size":0,
    //           "sort": 255,
    //           "updated_at": "2018-08-23 09:12:15",
    //           "created_at": "2018-08-23 09:12:15",
    //           "url": null
    //         }
    //       ],
    //       "first_page_url": "http://www.test.local/admin?page=1",
    //       "from": 1,
    //       "last_page": 1,
    //       "last_page_url": "http://www.test.local/admin?page=1",
    //       "next_page_url": null,
    //       "path": "http://www.test.local/admin",
    //       "per_page": 50,
    //       "prev_page_url": null,
    //       "to": 1,
    //       "total": 1
    //     }
    //   }
    //
    }
  },
  {
    url: '/vue-element-admin/xayah/delete',
    type: 'delete',
    response: config => {
      console.log(config)
      return {
        status:200,
        msg:'删除成功'
      }
      // {
      //   status:500,
      //     msg:'目录 test 不为空'
      // }

    }
  },
  {
    url: '/vue-element-admin/xayah/create',
    type: 'post',
    response: config => {
      console.log(config)
      return {
        status :500,
        msg : '文件已存在'
      }
      // {
      //   status :200,
      //     msg : ''
      // }

    }
  },
  {
    url: '/vue-element-admin/xayah/reture',
    type: 'post',
    response: config => {
      alert(1)
      console.log(config)
      return {
        status :200,
      }
      // {
      //   status :200,
      //     msg : ''
      // }

    }
  }
]
