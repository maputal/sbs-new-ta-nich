import { defineStore } from 'pinia'

export const useSupportCustomerDetailListStore = defineStore('SupportCustomerDetailListStore', {
  actions: {
    // 👉 Fetch all AuditTrails
    fetchCustomerDetail(params) {
      console.log("fetchConversationList")
      console.log("params",params)


      // return axios.get('apps/auditTrails', { params })
      const res = {
        data: {
          customer_id: 859,
          identity_id: 456,
          name: 'lisa',
          address: 'str',
          phone_number: '6281210028232',
          email: 'str',
          created_tstamp: 1692001077,
          updated_tstamp: 1691997372,
        },
      }

      console.log("res:",res)
      
      return Promise.resolve(res)
    },
  },
})
