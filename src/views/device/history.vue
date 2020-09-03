<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-input
        v-model.trim="listQuery.count"
        clearable
        placeholder="注册数量"
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
        placeholder="批量注册编号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
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

      <el-table-column label="产品名称" align="center" width="220" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag type="primary">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册数量" align="center" width="220" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag type="primary">{{ row.count }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center" width="130" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.appKey }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="批量注册编号" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="点击查看设备" placement="top">
            <span
              @click="searchDevice(row.registerNum)"
              class="span"
              style="text-decoration:underline"
            >{{ row.registerNum }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        sortable="custom"
        prop="create_date"
        width="220"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
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
    <el-dialog title="设备查看" :visible.sync="dialogFormVisible" width="85%">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="mqList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
        <el-table-column label="设备昵称" align="center" width="300" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag>{{row.nickName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="appKey" align="center" width="130">
          <template slot-scope="{row}">
            <el-tag type="success">{{row.appKey}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备秘钥" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{row.deviceSecret}}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产编号" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{row.productNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册编号" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{row.registerNum}}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag v-if="row.isEnable===1" type="success">启用</el-tag>
            <el-tag v-if="row.isEnable===0" type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="超级用户" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-tag v-if="row.isSuperuser===1" type="success">启用</el-tag>
              <el-tag v-if="row.isSuperuser===0" type="info">禁用</el-tag>
            </template>
        </el-table-column>-->

        <el-table-column label="创建时间" align="center" prop="create_date" width="220">
          <template slot-scope="{row}">
            <span>{{ row.createDate }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="mqTotal>0"
        :total="mqTotal"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="searchDevice"
      />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { getProView } from "@/api/product";

import { getRhView, getMqView } from "@/api/device";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// import PButton from '@/components/PermissionBtn'
import waves from "@/directive/waves"; // waves directive

export default {
  name: "device-history",
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      tableKey: 0,
      list: [],
      mqList: [],
      proList: [],
      total: 0,
      mqTotal: 0,
      listLoading: true,
      date: [],
      name: undefined,
      listQuery: {
        page: 1,
        limit: 20,
        orderField: undefined,
        orderType: undefined, // desc|asc
        count: undefined,
        name: undefined,
        appKey: undefined,
        registerNum: undefined,
      },
      query: {
        page: 1,
        limit: 20,
        orderField: undefined,
        orderType: undefined, // desc|asc
        registerNum: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getRhView(this.listQuery).then((response) => {
        this.list = response.respObj.item;
        this.total = response.respObj.total;
        getProView().then((response) => {
          this.proList = response.respObj.item;
          this.listLoading = false;
        });
      });
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
    handleFilter() {
      if (this.listQuery.appKey && this.name) {
        this.listQuery.name = "";
      } else {
        this.listQuery.name = this.name;
      }
      this.listQuery.page = 1;
      this.getList();
    },
    searchDevice(registerNum) {
      if (typeof registerNum === "string") {
        this.query.registerNum = registerNum;
      }
      this.mqTotal = 0;
      getMqView(this.query).then((response) => {
        this.mqList = response.respObj.item;
        this.mqTotal = response.respObj.total;
        this.dialogFormVisible = true;
      });
    },
  },
};
</script>

<style scoped>
.el-tag {
  font-size: 14px;
}
.span {
  cursor: pointer;
}
</style>
