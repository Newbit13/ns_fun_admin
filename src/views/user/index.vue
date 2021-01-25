<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="listQuery.realName" placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="9">
          <el-date-picker
            v-model="listQuery.timespan"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-col>
        <el-col :span="10">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Search
          </el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            Add
          </el-button> -->
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
            Export
          </el-button>
        </el-col>
      </el-row>
    </div>

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
      <!-- <el-table-column label="ID" prop="_id" sortable="custom" align="center" width="60" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="注册时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员" class-name="status-col">
        <template slot-scope="{row}">
          <span>{{ row.level > 1 ?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-card class="box-card" style="margin-bottom:5px;">
          <div slot="header" class="clearfix">
            <span>Identity Certification</span>
          </div>
          <div>
            <img width="200" :src="'http://localhost:3000/file/image?id='+temp.panCardF" alt="">
            <img width="200" :src="'http://localhost:3000/file/image?id='+temp.panCardS" alt="">
            <img width="200" :src="'http://localhost:3000/file/image?id='+temp.panCardT" alt="">
            <!-- <img width="200" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2420744160,4087949052&fm=26&gp=0.jpg" alt="">
            <img width="200" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2420744160,4087949052&fm=26&gp=0.jpg" alt="">
            <img width="200" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2420744160,4087949052&fm=26&gp=0.jpg" alt=""> -->
          </div>
        </el-card>
        <el-card class="box-card" style="margin-bottom:5px;">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="12">

            </el-col>
            <el-col :span="12">

            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="Name" prop="realName">
                <el-input v-model="temp.realName" />
              </el-form-item>
              <el-form-item label="Aadhhar No." prop="aadhaarNo">
                <el-input v-model="temp.aadhaarNo" />
              </el-form-item>
              <el-form-item label="Pan No." prop="panNo">
                <el-input v-model="temp.panNo" />
              </el-form-item>
              <el-form-item label="Date of Birth" prop="dateOfBirth">
                <el-date-picker v-model="temp.dateOfBirth" type="datetime" placeholder="Please pick a date" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Gender">
              <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
                <el-option v-for="item in genderOptions" :key="item" :label="item" :value="item" />
              </el-select>
              </el-form-item>
              <el-form-item label="Marital">
                <el-select v-model="temp.maritalStatus" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in maritalStatusOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="Email" prop="email">
                <el-input v-model="temp.email" />
              </el-form-item>
              <el-form-item label="Fackbook ID" prop="facebookId">
                <el-input v-model="temp.facebookId" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" style="margin-bottom:5px;">
          <div slot="header" class="clearfix">
            <span>公司信息</span>
          </div>
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="Education" prop="education">
                <el-input v-model="temp.education" />
              </el-form-item>
              <el-form-item label="Company Name" prop="companyName">
                <el-input v-model="temp.companyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Salary Range" prop="salaryRange">
                <el-input v-model="temp.salaryRange" />
              </el-form-item>
              <el-form-item label="Official Email" prop="officialEmail">
                <el-input v-model="temp.officialEmail" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" style="margin-bottom:5px;">
          <div slot="header" class="clearfix">
            <span>联系人信息</span>
          </div>
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="First contact" prop="panNo">
                <el-input v-model="temp.panNo" />
              </el-form-item>
              <el-form-item label="Relationship">
              <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
                <el-option v-for="item in genderOptions" :key="item" :label="item" :value="item" />
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Telephone" prop="panNo">
                <el-input v-model="temp.panNo" />
              </el-form-item>
            </el-col>
          </el-row>
          <hr />
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="Second contact" prop="panNo">
                <el-input v-model="temp.panNo" />
              </el-form-item>
              <el-form-item label="Relationship">
              <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
                <el-option v-for="item in genderOptions" :key="item" :label="item" :value="item" />
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Telephone" prop="panNo">
                <el-input v-model="temp.panNo" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>其他</span>
          </div>
          <el-form-item label="备注">
            <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{dialogStatus==='create'?'创建':'更新'}}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createCustomer, updateCustomer } from '@/api/customer'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
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
        timespan:[],
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      genderOptions: ["female", "male"],
      maritalStatusOptions: ["married", "unmarried"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
      this.listQuery.page = 1;
      if(this.listQuery.timespan){
        this.listQuery.timestart = this.listQuery.timespan[0];
        this.listQuery.timeend = this.listQuery.timespan[1];
      }
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'admin'
          createCustomer(this.temp).then(() => {
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          updateCustomer(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
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
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['create_time', 'update_time', '_id', 'phone', 'panCardF', 'panCardS', 'panCardT', 'dateOfBirth', 'email', 'facebookId', 'gender', 'maritalStatus', 'panNo', 'realName', 'companyName', 'education', 'officialEmail', 'salaryRange', 'firstContactName', 'firstContactRelation', 'firstContactTel', 'secondContactName', 'secondContactRelation', 'secondContactTel','remark']
        const filterVal = ['create_time', 'update_time', '_id', 'phone', 'panCardF', 'panCardS', 'panCardT', 'dateOfBirth', 'email', 'facebookId', 'gender', 'maritalStatus', 'panNo', 'realName', 'companyName', 'education', 'officialEmail', 'salaryRange', 'firstContactName', 'firstContactRelation', 'firstContactTel', 'secondContactName', 'secondContactRelation', 'secondContactTel','remark']
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
