import { createStore } from 'vuex'

export default createStore({
  state: {
    barCollapse:false,
    ifCodeSend:false,
    countDown:0,
  },
  getters: {
  },
  mutations: {
    changeCollapse(state){
      state.barCollapse = !state.barCollapse
    }
    // codeSend(state){
    //   state.countDown = 60
    //   state.ifCodeSend = true
    //   let timer = setInterval(()=>{
    //     state.countDown--
    //     state.innerHTML = `请${state.countDown}秒后再发`
    //     if(state.countDown == 0){
    //       state.ifCodeSend = false
    //       clearInterval(timer)
    //     }
    //   },1000)

    // }
  },
  actions: {
  },
  modules: {
  }
})
