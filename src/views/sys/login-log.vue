<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        clearable
        v-model.trim="listQuery.account"
        placeholder="管理员账号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        clearable
        v-model.trim="listQuery.name"
        placeholder="管理员姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.osName"
        clearable
        placeholder="操作系统名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.browserName"
        clearable
        placeholder="浏览器名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model.trim="listQuery.status"
        style="width: 140px"
        class="filter-item"
        placeholder="请选择状态"
        clearable
        @change="handleFilter"
      >
        <el-option key="0" label="登入" :value="0" />
        <el-option key="1" label="登出" :value="1" />
      </el-select>
      <el-date-picker
        v-model="listQuery.beginDate"
        type="datetime"
        placeholder="选择起始时间"
        align="right"
        class="filter-item"
        :picker-options="pickerOptions"
      />
      <el-date-picker
        v-model="listQuery.endDate"
        type="datetime"
        placeholder="选择结束时间"
        align="right"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      row-key="permission"
      :tree-props="{children: 'children'}"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
      <el-table-column label="账号" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag type="primary">{{ row.account }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="管理员名字" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ip" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器名" align="center" width="280">
        <template slot-scope="{row}">
          <span>{{ row.browserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作系统名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.osName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status===0" type="success">登入</el-tag>
          <el-tag v-if="row.status===1" type="info">登出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" align="center" sortable="custom" prop="create_date" width="220">
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
  </div>
</template>

<script>
import { getLoginLog } from "@/api/sys";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import PButton from "@/components/PermissionBtn";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "LoginLog",
  components: { Pagination, PButton },
  directives: { waves },

  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },

      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      date: [],
      listQuery: {
        page: 1,
        limit: 20,
        orderField: undefined,
        orderType: undefined, // desc|asc
        name: undefined,
        endDate: "",
        beginDate: "",
      },
      pvData: [],
      downloadLoading: false,
      treeProp: {
        children: "children",
        label: "menuName",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getLoginLog(this.listQuery).then((response) => {
        this.list = response.respObj.item;
        this.total = response.respObj.total;
        // Just to simulate the time of the request
        // setTimeout(() => {
        this.listLoading = false;
        // }, 1.5 * 1000)
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
      const typeA = typeof this.listQuery.beginDate;
      const typeB = typeof this.listQuery.endDate;
      // 点击了日期
      if (
        typeA === "object" &&
        typeB === "object" &&
        this.listQuery.beginDate &&
        this.listQuery.endDate
      ) {
        this.listQuery.beginDate = this.formatter(this.listQuery.beginDate);
        this.listQuery.endDate = this.formatter(this.listQuery.endDate);
      } else if (typeA == "object" && this.listQuery.beginDate) {
        this.listQuery.beginDate = this.formatter(this.listQuery.beginDate);
      } else if (typeB == "object" && this.listQuery.endDate) {
        this.listQuery.endDate = this.formatter(this.listQuery.endDate);
      }

      this.listQuery.page = 1;
      this.getList();
    },
    formatter(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hh = date.getHours();
      const mm = date.getMinutes();
      const ss = date.getSeconds();
      return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
  },
};
</script>

<style scoped>
.permission-tree {
  margin-bottom: 30px;
}
</style>
