const DailyStore = {
    namespaced: true,  // 这一行非常重要，它启用了 Vuex module 的命名空间
    state: {
      cards: {
        quests: [] // 初始化 quests 为一个空数组
      }
    },
    mutations: {
      SET_DATA(state, cards) {
        state.cards = {
      quests: cards.quests || []
    };
      }
    },
    actions: {
      setDailyData({ commit }, cards) {
        commit('SET_DATA', cards);
      }
    }
  }
  
  export default DailyStore;