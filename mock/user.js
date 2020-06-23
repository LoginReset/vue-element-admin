
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 1,
          errorMsg: 'Account and password are incorrect.'
        }
      }

      return {
        code: 0,
        respObj: null
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      // const { token } = config.query
      // const info = users[token]
      //
      // // mock error
      // if (!info) {
      //   return {
      //     code: 1,
      //     errorMsg: 'Login failed, unable to get user details.'
      //   }
      // }

      // return {
      //   code: 1,
      //   errorMsg: 'Login failed, unable to get user details.'
      // }

      return {
        code: 0,
        respObj: users["admin-token"]
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 0
      }
    }
  }
]
