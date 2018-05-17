import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  count:10
}

const mutations = {
  increment(state){
    state.count++
  },
  uncrement(state){
    state.count--
  }
}

const actions = {
  increment: ({commit})=>{
    commit('increment')
  },
  uncrement: ({commit})=>{
    commit('uncrement')
  },
  clickOdd: ({commit,state})=>{
    if(state.count%2 === 0){
      commit('increment')
    }
  },
  addAsy: ({commit})=>{
    new Promise((resolve)=>{
      setTimeout(function(){
        commit('increment')
        resolve()
      },1000)
    })
  }
}

const getters = {

  count1(state){
    return state.count
  },

  doneTodos(state){
    return state.count+1
  }
}

export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters
})

