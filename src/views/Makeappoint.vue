<template>
<div class="form">

 <el-form :model="form" label-width="120px" ref="ruleFormRef" :rules="rules">
    <!-- <el-form-item label="预约对象">
      <el-input v-model="form.name" />
    </el-form-item> -->

    <el-form-item label="预约对象">
      <el-select v-model="form.name" placeholder="请选择预约对象">
        <el-option v-for="(item,index) in form.nameList" :key="index" :label="item" :value="item" />
      </el-select>

    </el-form-item>

    
    <el-form-item label="预约类型">
      <el-select v-model="form.type" placeholder="请选择预约类型">
        <el-option label="研讨" value="研讨" />
        <el-option label="小组会" value="小组会" />
        <el-option label="大组会" value="大组会" />
      </el-select>
    </el-form-item>


    <el-form-item label="预约日期">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="请选择日期"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>

    <el-form-item label="预约时间">
      <el-col :span="11">
        <el-time-picker
          v-model="form.time1"
          placeholder="开始时间"
          style="width: 100%"
        />
      </el-col>

      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>

      <el-col :span="11">
        <el-time-picker
          v-model="form.time2"
          placeholder="结束时间"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
    </el-form-item>

  </el-form>
</div>
</template>

<script>
import {reactive,ref} from 'vue'
import axios from 'axios'

export default {
  name: 'Makeppoint',


  setup(){
    const ruleFormRef = ref()
    const form = reactive({
      name:'',
      nameList:'',
      type:'',
      date:'',
      time1:'',
      time2:'',
    })

    axios({
      method:'GET',
      url:'http://localhost:3002/app/getteacher'
    }).then(res=>{
      form.nameList = res.data.data
    })

    const rules = reactive({
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        type: [{ required: true, message: '请选择预约类型', trigger: 'blur' }],
        date: [{ required: true, message: '请选择预约日期', trigger: 'blur' }],
        time1: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        time2: [{ required: true, message: '请结束开始时间', trigger: 'blur' }],

    })
    let name1 = JSON.parse(localStorage.getItem('info')).name
    const submitForm = (ruleFormRef)=>{
      if(!ruleFormRef){
        alert('err')
      }
      if(form.name=='' || form.type=='' || form.data =='' || form.time1 == '' || form.time2 == ''){
        alert('请正确填写信息')
      }else{
        axios({
        method:'POST',
        url:'http://localhost:3002/app/makeappoint',
        data:{
          name1:name1,
          name2:form.name,
          type:form.type,
          date:+form.date,
          time1:+form.time1,
          time2:+form.time2,
        }
      }).then(res=>{
        alert('预约成功！')
      })
    }
      }
      


    return {
      form,
      ruleFormRef,
      submitForm,
      rules
    }

  }
}
</script>

<style scoped>
.form{
  width: 50%;
  margin-left: 100px;
  margin-top: 50px;
}
</style>
