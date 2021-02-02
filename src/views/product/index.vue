<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in productStatusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.type" placeholder="类别" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in productTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Search
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            Add
          </el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
            Export
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-tag>http://47.112.226.104/wechat/redirect?id={游戏id}</el-tag>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="220" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="logo">
        <template slot-scope="{row}">
          <img :src="row.logo" alt="" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ productStatusOptions[row.status - 1].display_name }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类别" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.type | statusFilter">
            {{ productTypeOptions[row.type - 1].display_name }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="PV" class-name="status-col">
        <template slot-scope="{row}">
          <span>{{row.pv}} </span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            详情
          </el-button>
          <el-button v-if="row.status!=2" size="mini" type="danger" @click="handleChangeState(row._id,2,$index)">
            下架
          </el-button>
          <el-button v-else size="mini" type="success" @click="handleChangeState(row._id,1,$index)">
            上架
          </el-button>
          <!-- <el-button type="info" size="mini" @click="handleFetchPv(row._id)">
            用户记录
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in productStatusOptions" :key="item.key" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="类别" prop="status">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in productTypeOptions" :key="item.key" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="名字" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="文章链接" prop="link">
          <el-input v-model="temp.link" />
        </el-form-item>
        <el-form-item label="百度云链接" prop="baiduyunlink">
          <el-input v-model="temp.baiduyunlink" />
        </el-form-item>
        <el-form-item label="提取码" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="logo">
          <ImageUpload :imageUrl.sync="temp.logo"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="用户记录">
      <el-table :data="pvuvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="name" label="名字" />
        <el-table-column prop="phone" label="手机" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createProduct, updateProduct,updateState } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ImageUpload from '@/components/ImageUpload'

const productStatusOptions = [
  { key: 'show', display_name: '上架',value:1 },
  { key: 'hide', display_name: '下架',value:2 },
]

const productTypeOptions = [
  { key: 'type1', display_name: '类别1',value:1 },
  { key: 'type2', display_name: '类别2',value:2 },
  { key: 'type3', display_name: '类别3',value:3 },
]

export default {
  name: 'ComplexTable',
  components: { Pagination,ImageUpload },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger',
        3: 'info',
      }

      // {
      //   1: '仅注册',
      //   2: '申请中',
      //   3: '成为会员'
      // }

      return statusMap[status]
    },
    parseTime
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        type: undefined,
      },
      productStatusOptions,
      productTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        _id: undefined,
        price: 0,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 2,
        minloan: '',
        maxloan: '',
        link: '',
        logo: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvuvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        price: [{ required: true, message: 'price is required', trigger: 'blur' }],
        link: [{ required: true, message: 'link is required', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: '',
        status: 2,
        price: '',
        link: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'admin'
          createProduct(this.temp).then((res) => {
            this.temp._id = res.data.id;
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateProduct(tempData).then(() => {
            const index = this.list.findIndex(v => v._id === this.temp._id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleChangeState(id,status,index) {
      updateState({id,status}).then(response => {
        this.list[index].status = status
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleFetchPv(id) {
      fetchPv(id).then(response => {
        this.pvuvData = response.data
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['create_time', '_id', 'name', 'status', 'price', 'link', 'remark', 'logo']
        const filterVal = ['create_time', '_id', 'name', 'status', 'price', 'link', 'remark', 'logo']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
