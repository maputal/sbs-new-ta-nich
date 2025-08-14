export const useGlobalStore = defineStore('global', {
  // arrow function recommended for full type inference
  state: () => ({
    user: null,
    token: null,
    addData: {},
    payloadFin:{},
  }),
  actions: {
    SET_USER(user) {
      this.user = user
    },
    SET_TOKEN(token) {
      this.token = token
    },
    SET_ADD_DATA(data) {
      this.addData = data
    },
    SET_PAYLOAD_FIN(payload) {
      this.payloadFin = payload
    },
  },
})
