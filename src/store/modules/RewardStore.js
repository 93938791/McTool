const RewardStore = {
    namespaced: true,  // 这一行非常重要，它启用了 Vuex module 的命名空间
    state: {
      cards: {
        quests: [] // 初始化 rewards 为一个空数组
      }
    },
    mutations: {
      SET_CARDS(state, cards) {
        state.cards = cards;
      }
    },
    actions: {
      setCards({ commit }, cards) {
        commit('SET_CARDS', cards);
      }
    }
  }
  
  export default RewardStore;