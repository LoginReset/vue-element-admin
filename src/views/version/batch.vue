<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.nickName"
        clearable
        placeholder="设备昵称"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.registerNum"
        clearable
        placeholder="注册编号"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.appKey"
        clearable
        placeholder="appKey"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.currentVersion"
        clearable
        placeholder="当前版本"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.targetVersion"
        clearable
        placeholder="最新目标版本"
        style="width: 140px;"
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

      <!-- <el-select
        v-model="listQuery.isEnable"
        clearable
        style="width: 140px"
        class="filter-item"
        placeholder="请选择状态"
        @change="handleFilter"
      >
        <el-option key="1" label="启用" :value="1" />
        <el-option key="0" label="禁用" :value="0" />
      </el-select>-->
      <el-select
        v-model="listQuery.upgradeStatus"
        clearable
        style="width: 140px"
        class="filter-item"
        placeholder="升级状态"
        @change="handleFilter"
      >
        <el-option key="0" label="失败" :value="0" />
        <el-option key="1" label="成功" :value="1" />
      </el-select>
      <!-- <el-select
        v-model="listQuery.checkVersion"
        clearable
        style="width: 140px"
        class="filter-item"
        placeholder="查询版本匹配"
        @change="handleFilter"
      >
        <el-option key="false" label="待使用" :value="false" />
        <el-option key="true" label="已使用" :value="true" />
      </el-select>-->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <PButton
        class="filter-item"
        icon="el-icon-download"
        perms="version-batch:download"
        label="table.download"
        @click="handleDownload"
      />
      <PButton
        class="filter-item"
        icon="el-icon-download"
        perms="version-batch:import"
        type="success"
        label="table.versionImport"
        @click="handleImport"
      />
      <PButton
        class="filter-item"
        icon="el-icon-thumb"
        perms="version-batch:version"
        type="primary"
        label="table.multipleVersion"
        @click="handleMultiple"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-refresh"
        @click="getList"
      >{{ $t('table.refresh') }}</el-button>
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
      <el-table-column label="设备名称" align="center" width="300" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag>{{row.deviceName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center" width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag type="success">{{row.appKey}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="设备昵称" align="center" width="200" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="批量注册编号" align="center"  width="200" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.registerNum }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="生产编号" align="center" width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前版本" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.currentVersion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="最新版本" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.targetVersion}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新结果说明" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.upgradeRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag v-if="row.deviceStatus===null" type="info">未激活</el-tag>
          <el-tag v-if="row.deviceStatus===1" type="success">在线</el-tag>
          <el-tag v-if="row.deviceStatus===0">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="升级状态" align="center" width="80">
        <template slot-scope="{row}">
          <el-tag v-if="row.upgradeStatus===0" type="danger">失败</el-tag>
          <el-tag v-if="row.upgradeStatus===1" type="success">成功</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" >
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column>-->

      <el-table-column label="状态更新时间" align="center" width="155">
        <template slot-scope="{row}">
          <span>{{ row.lastStatusTs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="升级时间" align="center" width="155">
        <template slot-scope="{row}">
          <span>{{ row.upgradeDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="version-batch:detail"
            size="mini"
            type="success"
            label="table.detail"
            @click="handleDetail(row)"
          />
          <PButton
            perms="version-batch:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleSingle(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
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
              <span>客户端的网络 IP 地址：{{parameter.ip_address}}</span>
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
          label="100px"
          label-position="left"
          style="width: 100%; margin-left:150px;"
        >
          <template v-if="dialogStatus==='import'">
            <el-form-item>
              <el-upload
                style="margin-left:100px;width:100%;"
                drag
                ref="upload"
                action="#"
                :file-list="modeList"
                :http-request="modeUpload"
                :on-change="fileChange"
                :on-remove="handleRemove"
                :auto-upload="false"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
              </el-upload>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="最新版本号" style="width:100%">
              <el-select v-model="temp.targetVersion" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in versionList"
                  :key="item.uuid"
                  :label="item.apkVersion+'('+item.name+')'"
                  :value="item.apkVersion"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="dialogStatus!=='import'">
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='single'?single(): specify()"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getProView } from "@/api/product";

import {
  getMqView,
  postMqImport,
  postVersion,
  getVersionView,
  postSingleVersion,
  getStatus,
} from "@/api/device";
import PButton from "@/components/PermissionBtn";
import waves from "@/directive/waves"; // waves directive
import { hasBtnPermission } from "@/utils/permission";

import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "device-versionBatch",
  directives: { waves },
  components: {
    PButton,
    Pagination,
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      modeList: [],
      versionList: [],
      proList: [],
      total: 0,
      details: {},
      parameter: {},
      name: "",
      temp: {
        nickName: undefined,
        currentVersion: undefined,
        appKey: undefined,
        registerNum: undefined,
        currentVersion: undefined,
        targetVersion: undefined,
      },
      query: {
        page: 1,
        limit: 20,
      },
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        orderField: undefined,
        orderType: undefined,
        nickName: undefined,
        appKey: undefined,
        currentVersion: undefined,
        isEnable: undefined,
        targetVersion: undefined,
        registerNum: undefined,
        apkVersion: undefined,
        upgradeStatus: undefined,
        checkVersion: true,
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        single: "指定版本",
        multiple: "批量指定",
        import: "导入设备",
        detail: "设备详情",
      },
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        console.log(val.params);
        if (val.params.checkVersion !== undefined) {
          this.listQuery.checkVersion = false;
        }
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getList() {
      this.listLoading = true;
      if (this.listQuery.checkVersion === "") {
        this.listQuery.checkVersion = null;
      }
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
    handleDownload() {
      window.location.href = `http://192.168.31.26:8080/b/mqUser/download`;
    },
    handleImport() {
      this.modeList = [];
      this.dialogStatus = "import";
      this.dialogFormVisible = true;
    },
    //添加
    beforeUpload(file) {
      file.name = file.name.toLowerCase();
      console.log(file.name);
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      let extension = testmsg === "xls";
      let extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls 、xlsx格式!",
          type: "error",
        });
      }
      return extension || extension2;
    },
    modeUpload(item) {
      console.log(item.file);
      this.mode = item.file;
      let fd = new FormData(); // FormData 对象
      fd.append("file", this.mode); // 文件对象
      postMqImport(fd).then((response) => {
        console.log(response);
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: response.errorMsg,
          type: "success",
          duration: 2000,
        });
        this.getList();
      });
    },
    fileChange(file, fileList) {
      this.modeList = [];
      if (this.beforeUpload(file)) {
        this.modeList.push(file);
        this.submitUpload();
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove() {},
    handleSingle(row) {
      let param = {
        appKey: row.appKey,
      };
      getVersionView(param).then((response) => {
        this.versionList = response.respObj.item;
      });
      this.dialogStatus = "single";
      console.log(row);
      this.temp.nickName = row.nickName;
      this.reset();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleMultiple() {
      this.reset();
      if (!this.listQuery.appKey || !this.listQuery.currentVersion) {
        this.$message({
          message: "请先选择appKey、当前版本",
          type: "error",
        });
      } else {
        let param = {
          appKey: this.listQuery.appKey,
        };
        getVersionView(param).then((response) => {
          this.versionList = response.respObj.item;
        });
        this.dialogStatus = "multiple";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      }
    },
    single() {
      let data = {};
      data.nickName = this.temp.nickName;
      if (this.temp.targetVersion === "") {
        this.temp.targetVersion = null;
      }
      data.targetVersion = this.temp.targetVersion;

      console.log(data);

      postSingleVersion(data).then((response) => {
        console.log(response);
        this.$notify({
          title: "成功",
          message: "已修改为指定版本",
          type: "success",
          duration: 2000,
        });
        this.getList();

        this.dialogFormVisible = false;
      });
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
      // this.parameter = JSON.parse(JSON.stringify(test))
      this.parameter = {};
      getStatus({ deviceName: row.deviceName }).then((response) => {
        this.parameter = response.respObj;
      });
      this.dialogStatus = "detail";
      this.dialogFormVisible = true;
    },
    specify() {
      let data = {};
      if (this.temp.targetVersion === "") {
        this.temp.targetVersion = null;
      }
      data.appKey = this.listQuery.appKey;
      data.currentVersion = this.listQuery.currentVersion;
      data.registerNum = this.listQuery.registerNum
        ? this.listQuery.registerNum
        : "";
      data.targetVersion = this.temp.targetVersion;
      console.log("data", data);
      postVersion(data).then((response) => {
        console.log(response);
        this.$notify({
          title: "成功",
          message: "已修改为指定版本",
          type: "success",
          duration: 2000,
        });
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    reset() {
      this.temp.targetVersion = null;
    },
    cancel() {
      this.dialogFormVisible = false;
      console.log(this.temp);
    },
    hasPerms(role, perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasBtnPermission(role, perms); // & !this.disabled
    },
  },
};
</script>
<style scoped>
.el-tag {
  font-size: 14px;
}
.text {
  font-size: 16px;
}
.box-card span {
  white-space: wrap;
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
.important {
  color: rgb(155, 44, 34);
  font-weight: bold;
}
/* .el-form {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
} */
/* .box-card {
      width: 480px;
    } */
</style>
