<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.nickName"
        clearable
        placeholder="设备昵称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.deviceName"
        clearable
        placeholder="设备名称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.appKey"
        clearable
        placeholder="appKey"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model.trim="listQuery.registerNum"
        clearable
        placeholder="注册编号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="name"
        style="width: 150px;"
        class="filter-item"
        clearable
        filterable
        placeholder="产品名称"
        @change="handleFilter"
      >
        <el-option v-for="item in proList" :key="item.uuid" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.isEnable"
        clearable
        style="width: 140px"
        class="filter-item"
        placeholder="请选择状态"
        @change="handleFilter"
      >
        <el-option key="1" label="启用" :value="1" />
        <el-option key="0" label="禁用" :value="0" />
      </el-select>
      <!-- <el-select
        v-model="listQuery.isSuperuser"
        clearable
        style="width: 160px"
        class="filter-item"
        placeholder="是否为超级用户"
        @change="handleFilter"
      >
        <el-option key="1" label="启用" :value="1" />
        <el-option key="0" label="禁用" :value="0" />
      </el-select>-->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t("table.search") }}</el-button>
      <PButton
        class="filter-item"
        icon="el-icon-download"
        perms="device-manage:export"
        type="primary"
        label="table.export"
        @click="handleExport"
      />
      <!-- <PButton
        class="filter-item"
        icon="el-icon-thumb"
        perms="device-manage:multiple"
        type="primary"
        label="table.multipleDevice"
        @click="handleMultiple"
      />-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-refresh"
        @click="getList"
      >{{ $t("table.refresh") }}</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      row-key="uuid"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
      <el-table-column label="设备昵称" align="center" width="300" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag>{{ row.nickName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center" width="130" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag type="success">{{ row.appKey }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备秘钥" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.deviceSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产编号" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册编号" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.registerNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.isEnable"
            :active-value="Number(1)"
            :inactive-value="Number(0)"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!hasPerms('device-manage:switch')"
            @change="enableChange($event, row)"
          />
        </template>
      </el-table-column>

      <!-- <el-table-column label="超级用户" align="center" width="150">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isSuperuser"
            :active-value="Number(1)"
            :inactive-value="Number(0)"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!hasPerms('device-manage:switch')"
            @change="spChange($event,row)"
          />
        </template>
      </el-table-column>-->
      <el-table-column
        label="创建时间"
        align="center"
        sortable="custom"
        prop="create_date"
        width="230"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <PButton
            perms="device-manage:detail"
            size="mini"
            type="success"
            label="table.detail"
            @click="handleDetail(row)"
          />
          <PButton
            perms="device-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleSingle(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :width="Object.keys(parameter).length===0?'50%':'70%'"
    >
      <template v-if="dialogStatus==='detail'">
        <el-card class="box-card">
          <div class="left" :style="Object.keys(parameter).length>0?'width:400px':'width:auto'">
            <div class="text item">
              <span>产品名称：{{details.name}}</span>
            </div>
            <div class="text item">
              <span>设备昵称：{{details.nickName}}</span>
            </div>
            <div class="text item">
              <span class="important">设备名称：{{details.deviceName}}</span>
            </div>

            <div class="text item">
              <span>设备密钥：{{details.deviceSecret}}</span>
            </div>
            <div class="text item">
              <span>appKey：{{details.appKey}}</span>
            </div>
            <div class="text item">
              <span>批量注册编号：{{details.registerNum}}</span>
            </div>
            <div class="text item">
              <span>生产编号：{{details.productNum}}</span>
            </div>
            <div class="text item">
              <span>当前版本：{{details.currentVersion}}</span>
            </div>
            <div class="text item">
              <span>最新版本：{{details.targetVersion}}</span>
            </div>
            <div class="text item">
              <span>最新结果说明：{{details.upgradeRemark}}</span>
            </div>
            <div class="text item">
              <span v-if="details.deviceStatus">设备状态：{{details.deviceStatus===0?'离线':'在线'}}</span>
              <span v-else>设备状态：未激活</span>
            </div>
            <div class="text item">
              <span class="important">使用状态：{{details.isEnable===0?'禁用':'启用'}}</span>
            </div>
            <div class="text item">
              <span>超级用户状态：{{details.isSuperuser===0?'禁用':'启用'}}</span>
            </div>
            <div class="text item">
              <span>升级状态：{{details.upgradeStatus}}</span>
            </div>

            <div class="text item">
              <span>状态更新时间：{{details.lastStatusTs}}</span>
            </div>
            <div class="text item">
              <span>创建时间：{{details.createDate}}</span>
            </div>
            <div class="text item">
              <span>更新时间：{{details.updateDate}}</span>
            </div>
          </div>
          <div
            class="left item"
            v-show="Object.keys(parameter).length>0"
            :style="Object.keys(parameter).length>0?'width:400px':'width:0'"
          >
            <div class="text item">
              <span>接收的 TCP 报文数量：{{parameter.recv_cn}}</span>
            </div>
            <div class="text item">
              <span>此客户端允许建立的最大订阅数量：{{parameter.max_subscriptions}}</span>
            </div>
            <div class="text item">
              <span>客户端使用的协议版本：{{parameter.proto_ver}}</span>
            </div>
            <div class="text item">
              <span>接收的 MQTT 报文数量：{{parameter.recv_pkt}}</span>
            </div>
            <div class="text item">
              <span>飞行队列当前长度：{{parameter.inflight}}</span>
            </div>
            <div class="text item">
              <span>飞行队列最大长度：{{parameter.max_mqueue}}</span>
            </div>
            <div class="text item">
              <span>生产编号：{{parameter.productNum}}</span>
            </div>
            <div class="text item">
              <span>进程堆栈大小，单位：字节：{{parameter.heap_size}}</span>
            </div>
            <div class="text item">
              <span>客户端连接时使用的用户名：{{parameter.username}}</span>
            </div>
            <div class="text item">
              <span>端点提供的功能介绍：{{parameter.proto_name}}</span>
            </div>
            <div class="text item">
              <span>此客户端已建立的订阅数量：{{parameter.subscriptions_cnt}}</span>
            </div>
            <div class="text item">
              <span>发送的 MQTT 报文数量：{{parameter.send_pkt}}</span>
            </div>
            <div class="text item">
              <span>会话创建时间：{{parameter.created_at}}</span>
            </div>
            <div class="text item">
              <span>Erlang reduction：{{parameter.reductions}}</span>
            </div>
            <div class="text item">
              <span class="important">客户端的网络 IP 地址：{{parameter.ip_address}}</span>
            </div>
            <div class="text item">
              <span>发送的 PUBLISH 报文数量：{{parameter.send_msg}}</span>
            </div>
            <div class="text item">
              <span>发送的 TCP 报文数量：{{parameter.send_cnt}}</span>
            </div>
          </div>
          <div
            class="left item"
            v-show="Object.keys(parameter).length>0"
            :style="Object.keys(parameter).length>0?'width:400px':'width:0'"
          >
            <div class="text item">
              <span>会话过期间隔，单位：秒：{{parameter.expiry_interval}}</span>
            </div>
            <div class="text item">
              <span>保持连接时间，单位：秒：{{parameter.keepalive}}</span>
            </div>
            <div class="text item">
              <span>消息队列因超出长度而丢弃的消息数量：{{parameter.mqueue_dropped}}</span>
            </div>
            <div class="text item">
              <span>指示客户端是否通过桥接方式连接：{{parameter.is_bridge}}</span>
            </div>
            <div class="text item">
              <span>飞行队列最大长度：{{parameter.max_inflight}}</span>
            </div>
            <div class="text item">
              <span>接收的 PUBLISH 报文数量：{{parameter.recv_msg}}</span>
            </div>
            <div class="text item">
              <span>允许存在未确认的 PUBREC 报文的最大数量：{{parameter.max_awaiting_rel}}</span>
            </div>
            <div class="text item">
              <span>未确认的 PUBREC 报文数量：{{parameter.awaiting_rel}}</span>
            </div>
            <div class="text item">
              <span>进程邮箱大小：{{parameter.mailbox_len}}</span>
            </div>
            <div class="text item">
              <span>消息队列当前长度：{{parameter.mqueue_len}}</span>
            </div>
            <div class="text item">
              <span>接收的字节数量：{{parameter.recv_oct}}</span>
            </div>
            <div class="text item" v-if="parameter.connected">
              <span class="important">客户端连接时间：{{parameter.connected_at}}</span>
            </div>
            <div class="text item" v-if="!parameter.connected">
              <span class="important">客户端断开时间：{{parameter.disconnected_at}}</span>
            </div>
            <div class="text item">
              <span>指示客户端是否使用了全新的会话：{{parameter.clean_start}}</span>
            </div>
            <div class="text item">
              <span>客户端标识符：{{parameter.clientid}}</span>
            </div>
            <div class="text item">
              <span class="important">客户端是否处于连接状态：{{parameter.connected?'是':'否'}}</span>
            </div>
            <div class="text item">
              <span>客户端源端口：{{parameter.port}}</span>
            </div>
            <div class="text item">
              <span>发送的字节数量：{{parameter.send_oct}}</span>
            </div>
            <div class="text item">
              <span>指示客户端使用的配置组：{{parameter.zone}}</span>
            </div>
          </div>
        </el-card>
      </template>
      <template v-else>
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="生产编号" prop="productNum">
            <el-input v-model.trim="temp.productNum" clearable placeholder="请输入生产编号" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t("table.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'single' ? singleUp() : multipleUp()"
          >{{ $t("table.confirm") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getProView } from "@/api/product";
import {
  getAllStatus,
  getMqView,
  postMqSp,
  postMqEnable,
  postProductUp,
} from "@/api/device";
import PButton from "@/components/PermissionBtn";
import waves from "@/directive/waves"; // waves directive
import { hasBtnPermission } from "@/utils/permission";

import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "device-manage",
  directives: { waves },
  components: {
    PButton,
    Pagination,
  },
  data() {
    var checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("二维码类型必填"));
      }
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error("类型必须是数字"));
      }
      if (parseInt(value) > 99 || parseInt(value) < 0) {
        return callback(new Error("二维码类型范围[0,99]"));
      }
      callback();
    };
    return {
      tableKey: 0,
      list: [],
      proList: [],
      parameter: {},
      total: 0,
      temp: {
        deviceName: undefined,
        productNum: undefined,
        // registerNum:undefined,
      },
      name: undefined,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        orderField: undefined,
        orderType: undefined,
        nickName: undefined,
        appKey: undefined,
        deviceName: undefined,
        isEnable: undefined,
        isSuperuser: undefined,
        registerNum: undefined,
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        multiple: "批量更新",
        single: "生产编号更新",
        detail: "设备详情",
      },
      rules: {
        productNum: [
          { required: true, message: "生产编号必填", trigger: "change" },
          { min: 6, max: 20, message: "长度限制为[6,20]", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getMqView(this.listQuery).then((response) => {
        this.list = response.respObj.item;
        this.total = response.respObj.total;
        getProView().then((response) => {
          this.proList = response.respObj.item;
          this.listLoading = false;
        });
      });
    },
    handleFilter() {
      if (this.listQuery.appKey && this.name) {
        this.listQuery.name = "";
      } else {
        this.listQuery.name = this.name;
      }
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      // 排序
      const { prop, order } = data;
      if (prop === "create_date") {
        if (order === "ascending") {
          this.listQuery.orderType = "asc";
        } else if (order === "descending") {
          this.listQuery.orderType = "desc";
        } else {
          this.listQuery.orderType = undefined;
        }
        this.listQuery.orderField = prop;
      }
      this.handleFilter();
    },
    handleSingle(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "single";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogFormVisible = true;
    },
    singleUp() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let data = {
            productNum: this.temp.productNum,
            deviceName: this.temp.deviceName,
          };
          postProductUp(data).then((response) => {
            this.cancel();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleMultiple() {
      if (!this.listQuery.registerNum) {
        this.$message({
          message: "请先选择注册编号",
          type: "error",
        });
        return;
      }
      this.$confirm("会更新当前注册编号下所有的设备，是否继续?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
        this.dialogStatus = "multiple";
        this.dialogFormVisible = true;
      });
    },
    multipleUp() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let data = {
            productNum: this.temp.productNum,
            registerNum: this.listQuery.registerNum,
          };
          postProductUp(data).then((response) => {
            this.cancel();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleExport() {
      console.log(this.listQuery);
      let arr = [];
      for (let k in this.listQuery) {
        if (this.listQuery[k]) {
          arr.push(k + "=" + this.listQuery[k]);
        }
      }
      let param = "?";
      param = param + arr.join("&");
      let url = process.env.VUE_APP_BASE_API + "/b/mqUser/export" + param;
      window.location.href = url;
    },
    handleDetail(row) {
      this.details = Object.assign({}, row);
      let test = {
        recv_cnt: 2, // 接收的 TCP 报文数量
        max_subscriptions: 0, // 此客户端允许建立的最大订阅数量
        proto_ver: 4, // 客户端使用的协议版本
        recv_pkt: 1, // 接收的 MQTT 报文数量
        inflight: 0, // 飞行队列当前长度
        max_mqueue: 1000, // 飞行队列最大长度
        heap_size: 2586, // 进程堆栈大小，单位：字节
        username: "test", //客户端连接时使用的用户名
        proto_name: "MQTT", //端点提供的功能介绍
        subscriptions_cnt: 0, // 此客户端已建立的订阅数量
        send_pkt: 0, // 发送的 MQTT 报文数量
        created_at: "2020-02-20 13:38:51", //会话创建时间，格式为 "YYYY-MM-DD HH:mm:ss"
        reductions: 3978, // Erlang reduction
        ip_address: "127.0.0.1", //客户端的网络 IP 地址
        send_msg: 0, // 发送的 PUBLISH 报文数量
        send_cnt: 0, // 发送的 TCP 报文数量
        expiry_interval: 0, // 会话过期间隔，单位：秒
        keepalive: 60, // 保持连接时间，单位：秒
        mqueue_dropped: 0, // 消息队列因超出长度而丢弃的消息数量
        is_bridge: false, // 指示客户端是否通过桥接方式连接
        max_inflight: 32, // 飞行队列最大长度
        recv_msg: 0, // 接收的 PUBLISH 报文数量
        max_awaiting_rel: 100, // 允许存在未确认的 PUBREC 报文的最大数量
        awaiting_rel: 0, // 未确认的 PUBREC 报文数量
        mailbox_len: 1, // 进程邮箱大小
        mqueue_len: 0, // 消息队列当前长度
        recv_oct: 29, // 接收的字节数量
        connected_at: "2020-02-20 13:38:51", //客户端连接时间，格式为 "YYYY-MM-DD HH:mm:ss"
        clean_start: true, // 指示客户端是否使用了全新的会话
        clientid: "example", //客户端标识符
        connected: true, // 客户端是否处于连接状态
        port: 54889, // 客户端源端口
        send_oct: 0, // 	发送的字节数量
        zone: "external", //指示客户端使用的配置组
      };
      // this.parameter = JSON.parse(JSON.stringify(test));
      this.parameter = {};
      getAllStatus({ deviceName: row.deviceName }).then((response) => {
        this.parameter = response.respObj;
      });
      this.dialogStatus = "detail";
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.temp = {
        deviceName: undefined,
        productNum: undefined,
        // registerNum:undefined,
      };
    },
    cancel() {
      this.dialogFormVisible = false;
      this.resetTemp();
    },
    enableChange(status, row) {
      const formData = new FormData();
      formData.append("nickName", row.nickName);
      formData.append("status", status);
      const data = {
        nickName: row.nickName,
        status,
      };
      console.log(data);
      postMqEnable(data)
        .then((response) => {
          this.$notify({
            title: "成功",
            message: "修改状态成功",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          row.isEnable = status === 1 ? 0 : 1;
        });
    },
    spChange(status, row) {
      const data = {
        nickName: row.nickName,
        status,
      };
      console.log(data);
      postMqSp(data)
        .then((response) => {
          console.log(response);
          this.$notify({
            title: "成功",
            message: "修改用户成功",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          row.isSuperuser = status === 1 ? 0 : 1;
        });
    },
    hasPerms(role, perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasBtnPermission(role, perms); // & !this.disabled
    },
  },
};
</script>
<style>
.el-tag {
  font-size: 14px;
}
.text {
  font-size: 16px;
}
.box-card span {
  display: inline-block;
  white-space: wrap;
}
.important {
  color: rgb(155, 44, 34);
  font-weight: bold;
}

.item {
  padding: 15px 0;
}
.left {
  float: left;
  display: inline-block;
}
.left .item {
  margin-left: 40px;
}
.right {
  float: right;
}
</style>
