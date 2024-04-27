import { createStore } from 'vuex'
import RewardStore from './modules/RewardStore'

const store = createStore({
  modules: {
    RewardStore
  }
})

export default store