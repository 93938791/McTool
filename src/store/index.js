import { createStore } from 'vuex'
import RewardStore from './modules/RewardStore'
import DailyStore from './modules/DailyStore'
import WeeklyStore from './modules/WeeklyStore'
import PassTaskStore from './modules/PassTaskStore'

const store = createStore({
  modules: {
    RewardStore,
    DailyStore,
    WeeklyStore,
    PassTaskStore
  }
})

export default store