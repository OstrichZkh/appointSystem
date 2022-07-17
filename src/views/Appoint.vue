<template>
  <div class="container">
    <el-table :data="newAppList" style="width: 100%" ref="multipleTableRef" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="id" label="编号" width="55"/>
        <el-table-column prop="name1" label="预约人" width="200" />
        <el-table-column prop="name2" label="预约对象" width="200" />
        <el-table-column prop="type" label="预约类型" width="200" />
        <el-table-column prop="date" label="预约日期" width="200" />
        <el-table-column prop="time" label="预约时间" width="200" />
        <el-table-column fixed="right" label="操作" width="120">
        <template #default>
          <el-button link type="primary" size="small" @click="handleDelete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
  
</template>

<script>
import {onMounted, ref,onBeforeMount,reactive} from 'vue'
import axios from 'axios'
export default {
  name: 'Appoint',
  setup(){
    let appList = reactive()
    let newAppList = reactive([])
    let multipleTableRef = ref()
    let multipleSelection = ref([])


    // 将日期时间戳变为XX-XX-XX形式
    function add0(m){return m<10?'0'+m:m }

    function dataConvert(time_){
      let time = new Date(parseInt(time_))
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      return y+'-'+add0(m)+'-'+add0(d)
    }

    function timerConvert(time1_,time2_){
      let time1 = new Date(parseInt(time1_))
      let time2 = new Date(parseInt(time2_))
      var h1 = time1.getHours();
      var mm1 = time1.getMinutes();
      var h2 = time2.getHours();
      var mm2 = time2.getMinutes();

      return add0(h1)+':'+add0(mm1) + ' - ' + add0(h2)+':'+add0(mm2)
    }


    let auth = JSON.parse(localStorage.getItem('info')).type
    let name = JSON.parse(localStorage.getItem('info')).name
    console.log(auth)
    if(auth == '老师'){
      axios({
        method:'GET',
        url:'http://localhost:3002/app/getapplist',
        params:{
          auth:'老师',
          name:name
        }
      }).then(res=>{
        appList = res.data.data
        appList.sort((a,b)=>{
          return a['date']-b['date']
        })
        for(let app of appList){
          let _temp = {}
          _temp['id'] = app.id
          _temp['name1'] = app.name1
          _temp['name2'] = app.name2
          _temp['type'] = app.type
          _temp['date'] = dataConvert(app.date)
          _temp['time'] = timerConvert(app.time1,app.time2)
          newAppList.push(_temp)
        }
      })
    }else if (auth=='学生'){
      axios({
        method:'GET',
        url:'http://localhost:3002/app/getapplist',
        params:{
          auth:'学生',
          name:name
        }
      }).then(res=>{
        appList = res.data.data
        appList.sort((a,b)=>{
          return a['date']-b['date']
        })
        for(let app of appList){
          let _temp = {}
          _temp['id'] = app.id
          _temp['name1'] = app.name1
          _temp['name2'] = app.name2
          _temp['type'] = app.type
          _temp['date'] = dataConvert(app.date)
          _temp['time'] = timerConvert(app.time1,app.time2)
          newAppList.push(_temp)
        }
      })
    }else{
      // 超级管理员，获得所有的预约信息
      axios({
        method:'GET',
        url:'http://localhost:3002/app/getapplist',
        params:{
          auth:'管理员'
        }
      }).then(res=>{
        appList = res.data.data
        appList.sort((a,b)=>{
          return a['date']-b['date']
        })
        for(let app of appList){
          let _temp = {}
          _temp['id'] = app.id
          _temp['name1'] = app.name1
          _temp['name2'] = app.name2
          _temp['type'] = app.type
          _temp['date'] = dataConvert(app.date)
          _temp['time'] = timerConvert(app.time1,app.time2)
          newAppList.push(_temp)
        }
      })
    }
    


    // 删除预约
    function handleDelete(){

    }


    return {
      appList,
      newAppList,
      multipleTableRef,
      multipleSelection,
    }

  }
}
</script>

<style>

.container{
  position: relative;
  /* height: 250px; */
  padding-bottom: 20px;
}

</style>
