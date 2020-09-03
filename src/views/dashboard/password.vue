<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="right"
      label-width="125px"
      style="width: 800px; margin-left:100px;"
    >
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model.trim="temp.oldPwd" clearable placeholder="请输入旧密码" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model.trim="temp.newPwd" clearable placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model.trim="temp.confirmPwd" clearable placeholder="请输入确认密码" show-password />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetTemp">重置密码</el-button>
        <el-button type="success" @click="modify">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { postPwdUp } from "@/api/sys";
export default {
  name: "ChangePwd",
  data() {
    // 确认密码
    var confirmPwd = (rule, value, callback) => {
      console.log(value);
      if (this.temp.newPwd !== value) {
        callback(new Error("前后密码不一致"));
      }
      callback();
    };

    return {
      temp: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      rules: {
        oldPwd: [
          { required: true, message: "密码必填", trigger: "change" },
          {
            min: 6,
            max: 100,
            message: "长度范围[6,100]字符",
            trigger: "change",
          },
        ],
        newPwd: [
          { required: true, message: "密码必填", trigger: "change" },
          {
            min: 6,
            max: 100,
            message: "长度范围[6,100]字符",
            trigger: "change",
          },
        ],
        confirmPwd: [
          { required: true, message: "请确认密码", trigger: "change" },
          { validator: confirmPwd, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    modify() {
      this.$refs["dataForm"].validate((valid) => {
        console.log(this.$route);
        if (valid) {
          const data = {
            newPwd: this.temp.newPwd,
            oldPwd: this.temp.oldPwd,
          };
          postPwdUp(data).then((response) => {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
            this.resetTemp();
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1);
          });
        }
      });
    },
    resetTemp() {
      this.temp = {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      };
    },
  },
};
</script>
