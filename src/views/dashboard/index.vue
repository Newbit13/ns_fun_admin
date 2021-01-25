<template>
  <div class="dashboard-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日注册量</span>
          </div>
          <div style="height:20px;">
            {{rigister_count_today}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日总收入</span>
          </div>
          <div style="height:20px;">
            {{rigister_income_today}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本月注册量</span>
          </div>
          <div style="height:20px;">
            {{rigister_count_month}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本月总收入</span>
          </div>
          <div style="height:20px;">
            {{rigister_income_month}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="12">
        <el-date-picker
          v-model="timespan"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>注册量</span>
          </div>
          <div style="height:20px;">
            {{rigister_count}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>总收入</span>
          </div>
          <div style="height:20px;">
            {{rigister_income}}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchInfo,fetchInfoByTime } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data(){
    return {
      rigister_count_month: 0,
      rigister_count_today: 0,
      rigister_income_month: 0,
      rigister_income_today: 0,

      rigister_count:0,
      rigister_income:0,

      timespan:''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch:{
    timespan(newV,oldV){
      fetchInfoByTime({
        timespan:newV
      }).then(res=>{
        console.log(res);
        const data = res.data;
        this.rigister_count = data.rigister_count;
        this.rigister_income = data.rigister_income;
      })
    }
  },
  created(){
    fetchInfo().then(res=>{
      const data = res.data;
      this.rigister_count_month = data.rigister_count_month;
      this.rigister_count_today = data.rigister_count_today;
      this.rigister_income_month = data.rigister_income_month;
      this.rigister_income_today = data.rigister_income_today;
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
</style>
