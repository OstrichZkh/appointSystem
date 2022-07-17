<template>
  <el-calendar>
    <template #dateCell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>
    </template>
  </el-calendar>
</template>

<script>
import { defineComponent,ref } from 'vue'
export default defineComponent ({
  name:'',
  components:{},
  props:{},
  setup(props, ctx){
    const value = ref(new Date())
    return {
      value
    }
  },
})
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
</style>