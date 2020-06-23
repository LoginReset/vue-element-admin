<template>
  <el-button
    :size="size"
    :type="type"
    style="margin-left: 10px;"
    :icon="icon"
    :disabled="!hasPerms(role,perms)"
    @click="handleClick"
  >
    {{ $t(label) }}
  </el-button>
</template>

<script>
// 禁用标识
// :disabled="!hasPerms(perms)"

import { hasBtnPermission } from '@/utils/permission'
export default {
  name: 'PButton',
  props: {
    label: {
      type: String,
      default: 'Button'
    },
    icon: {
      type: String
    },
    size: { // 按钮尺寸
      type: String
    },
    type: { // 按钮类型
      type: String,
      default: null
    },
    loading: { // 按钮加载标识
      type: Boolean,
      default: false
    },
    disabled: { // 按钮是否禁用
      type: Boolean,
      default: false
    },
    perms: { // 按钮权限标识，外部使用者传入
      type: String,
      default: null
    },
    role: {
      type: String,
      default: null
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  },

  methods: {

    handleClick: function() {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
    hasPerms: function(role, perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasBtnPermission(role, perms) // & !this.disabled
    }
  }
}
</script>
