<template>
  <div class="login-container">
    <div class="main">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">
            {{ $t('login.title') }}
          </h3>
          <lang-select class="set-language" />
        </div>
        <el-form-item ref="dragVerifySize" prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <!--滑动验证-->
        <el-form-item class="drag-verify-box">
          <drag-verify
            ref="Verify"
            :text="text"
            :success-text="successText"
            :background="background"
            :progress-bar-bg="progressBarBg"
            :completed-bg="completedBg"
            :handler-bg="handlerBg"
            :handler-icon="handlerIcon"
            :text-size="textSize"
            :success-icon="successIcon"
            :circle="getShape"
            :width="width"
            :height="height"
            :color="color"
            :border-radius="borderRadius"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          :style="{height:height+'px'}"
          @click.native.prevent="handleLogin"
        >
          {{ $t('login.logIn') }}
        </el-button>

        <!--<div style="position:relative">-->
        <!--<div class="tips">-->
        <!--<span>{{ $t('login.username') }} : admin</span>-->
        <!--<span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>-->
        <!--</div>-->
        <!--<div class="tips">-->
        <!--<span style="margin-right:18px;">-->
        <!--{{ $t('login.username') }} : editor-->
        <!--</span>-->
        <!--<span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>-->
        <!--</div>-->

        <!--<el-button class="thirdparty-button" type="primary" @click="showDialog=true">-->
        <!--{{ $t('login.thirdparty') }}-->
        <!--</el-button>-->
        <!--</div>-->
      </el-form>
    </div>
    <div class="footer-1">
      <div class="footer-top"><a href="http://www.cdzic.net">成都子程电子设备有限公司</a>提供技术支持</div>
      <div class="footer">copyright <a href="http://www.cdzic.net">© 2009 cdzic</a> all rights reserved.</div>
    </div>
    
    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './components/SocialSignin'
import DragVerify from 'vue-drag-verify'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign, DragVerify },
  data() {
    const validateUsername = (rule, value, callback) => {
      console.log(value)
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '1053818949',
        password: 'yaotao'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      browser: '未知浏览器',
      OS: '未知操作系统',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      //  以下为drag-verify配置
      width: 1,
      height: 1,
      text: '请将滑块拖动到右侧',
      successText: '验证成功',
      background: '#DDDDDD',
      progressBarBg: '#76C61D',
      completedBg: '#76C61D',
      handlerBg: 'white',
      handlerIcon: 'el-icon-d-arrow-right',
      textSize: '14',
      successIcon: 'el-icon-circle-check',
      getShape: false,
      color: 'white',
      borderRadius: '5px'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    width:{
      handler(val){
        console.log(val)
      },
      immediate: true

    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.width = this.$refs.dragVerifySize.$el.clientWidth
    this.height = this.$refs.username.$el.clientHeight
    /* 当窗口改变触发*/
    window.onresize = () => {
        return (() => {
          this.width = this.$refs.dragVerifySize.$el.clientWidth
          this.height = this.$refs.username.$el.clientHeight
        })()
        
    }
    
    
  },
  destroyed() {
    window.onresize = null
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      /* 验证*/
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.$refs.Verify.isPassing) { // 未通过验证
            this.$message({
              message: this.text + '进行验证',
              type: 'warning'
            })
            return
          }
          this.loading = true
           this.browser = (this.getBrowser()&&this.getBrowser().browser) || '未知浏览器' // 获取浏览器名
          this.version = (this.getBrowser()&&this.getBrowser().version) || '未知浏览器版本号' // 获取浏览器版本
          this.OS = this.getOS() + ' ' + this.getDigits() || '未知操作系统' // 系统版本号

          const loginInfo = this.loginForm
          loginInfo.browser = this.browser + ' ' + this.version
          loginInfo.OS = this.OS
          console.log(loginInfo)
          this.$store.dispatch('user/login', loginInfo)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
              console.log(this.otherQuery)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 判断所处操作系统
    getOS() {
		    var sUserAgent = navigator.userAgent.toLowerCase()

      var isWin = (navigator.platform == 'Win32') || (navigator.platform == 'Win64') || (navigator.platform == 'wow64')

      var isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel')
      if (isMac) return 'Mac'
      var isUnix = (navigator.platform == 'X11') && !isWin && !isMac
      if (isUnix) return 'Unix'
      var isLinux = (String(navigator.platform).indexOf('Linux') > -1)
      var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == 'android'
      if (isLinux) {
        if (bIsAndroid) return 'Android'
        else return 'Linux'
      }
      if (isWin) {
        var isWin2K = sUserAgent.indexOf('Windows nt 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
        if (isWin2K) return 'Win2000'
        var isWinXP = sUserAgent.indexOf('Windows nt 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
        sUserAgent.indexOf('Windows XP') > -1
        if (isWinXP) return 'WinXP'
        var isWin2003 = sUserAgent.indexOf('Windows nt 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
        if (isWin2003) return 'Win2003'
        var isWinVista = sUserAgent.indexOf('Windows nt 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
        if (isWinVista) return 'WinVista'
        var isWin7 = sUserAgent.indexOf('Windows nt 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
        if (isWin7) return 'Win7'
        var isWin8 = sUserAgent.indexOf('windows nt 6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1
        if (isWin8) return 'Win8'
        var isWin10 = sUserAgent.indexOf('windows nt 10.0') > -1 || sUserAgent.indexOf('Windows 10') > -1
        if (isWin10) return 'Win10'
      }
      return '其他'
				  },
    // 判断当前操作系统的版本号
    getDigits() {
      var sUserAgent = navigator.userAgent.toLowerCase()
      var is64 = sUserAgent.indexOf('win64') > -1 || sUserAgent.indexOf('wow64') > -1
      if (is64) {
        return '64位'
      } else {
        return '32位'
      }
    },
    // 判断浏览器名
    getBrowser() {
					  var rMsie = /(msie\s|trident\/7)([\w\.]+)/
					  var rTrident = /(trident)\/([\w.]+)/
					  var rEdge = /(chrome)\/([\w.]+)/// IE

					  var rFirefox = /(firefox)\/([\w.]+)/ // 火狐
					  var rOpera = /(opera).+version\/([\w.]+)/ // 旧Opera
					  var rNewOpera = /(opr)\/(.+)/ // 新Opera 基于谷歌
					  var rChrome = /(chrome)\/([\w.]+)/ // 谷歌
					  var rUC = /(chrome)\/([\w.]+)/// UC
					  var rMaxthon = /(chrome)\/([\w.]+)/// 遨游
					  var r2345 = /(chrome)\/([\w.]+)/// 2345
					  var rQQ = /(chrome)\/([\w.]+)/// QQ
					  // var rMetasr =  /(metasr)\/([\w.]+)/;//搜狗
					  var rSafari = /version\/([\w.]+).*(safari)/

					  var ua = navigator.userAgent.toLowerCase()

					  var matchBS, matchBS2

					  // IE 低版
					  matchBS = rMsie.exec(ua)
					  if (matchBS != null) {
						  matchBS2 = rTrident.exec(ua)
						  if (matchBS2 != null) {
							  switch (matchBS2[2]) {
							  case '4.0':
								  return {
									  browser:
									  'Microsoft IE',
									  version: 'IE: 8' // 内核版本号
								  }
								  break
							  case '5.0':
								  return {
									  browser:
									  'Microsoft IE',
									  version: 'IE: 9'
								  }
								  break
							  case '6.0':
								  return {
									  browser:
									  'Microsoft IE',
									  version: 'IE: 10'
								  }
								  break
							  case '7.0':
								  return {
									  browser:
									  'Microsoft IE',
									  version: 'IE: 11'
								  }
								  break
							  default:
								  return {
									  browser:
									  'Microsoft IE',
									  version: 'Undefined'
								  }
							  }
						  } else {
							  return {
								  browser: 'Microsoft IE',
								  version: 'IE:' + matchBS[2] || '0'
							  }
						  }
					  }
					  // IE最新版
					   matchBS = rEdge.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: 'Microsoft Edge',
							  version: 'Chrome/' + matchBS[2] || '0'
						  }
					  }
      // UC浏览器
					  matchBS = rUC.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: 'UC',
							  version: 'Chrome/' + matchBS[2] || '0'
						  }
					  }
					  // 火狐浏览器
					  matchBS = rFirefox.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: '火狐',
							  version: 'Firefox/' + matchBS[2] || '0'
						  }
					  }
      // Oper浏览器
					 matchBS = rOpera.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: 'Opera',
							  version: 'Chrome/' + matchBS[2] || '0'
						  }
					  }
					  // 遨游
					   matchBS = rMaxthon.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: '遨游',
							  version: 'Chrome/' + matchBS[2] || '0'
						  }
					  }
      // 2345浏览器
 					  matchBS = r2345.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: '2345',
							  version: 'Chrome/ ' + matchBS[2] || '0'
						  }
					  }
      // QQ浏览器
					  matchBS = rQQ.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  return {
							  browser: 'QQ',
							  version: 'Chrome/' + matchBS[2] || '0'
						  }
					  }
					  // Safari（苹果）浏览器
					  matchBS = rSafari.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent)) && (!(window.chrome)) && (!(window.opera))) {
						  return {
							  browser: 'Safari',
							  version: 'Safari/' + matchBS[1] || '0'
						  }
					  }
					  // 谷歌浏览器
					   matchBS = rChrome.exec(ua)
					  if ((matchBS != null) && (!(window.attachEvent))) {
						  matchBS2 = rNewOpera.exec(ua)
						  if (matchBS2 == null) {
							  return {
								  browser: '谷歌',
								  version: 'Chrome/' + matchBS[2] || '0'
							  }
						  } else {
							  return {
								  browser: 'Opera',
								  version: 'opr/' + matchBS2[2] || '0'
							  }
						  }
					  }
				  },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .drag-verify-box {
      border: none;
      background: none;
      border-radius: 0;
      color: #fff;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    // position: relative;
    // min-height: 100%;
    padding-bottom: 0;

    width: 100%;
    height: 100vh;

    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      height: calc(100vh-70px);

      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
    .main{
      // height: calc(100vh-70px);
      height: 90%;
    }
    .footer-1{
      // position: absolute;
      // bottom: 0;
      // left:0;
      // margin-bottom: 0px;
      height: 10%;
    }
    .footer-top{
      // margin-top:300px ;
      text-align: center;
      color: #fff;
      a{
        // color: skyblue;
      }
    }
    .footer{
      margin-top:20px ;
      text-align: center;
      color: #fff;
      a{
        // color: skyblue;
      }
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
