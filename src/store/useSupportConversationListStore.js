import { defineStore } from 'pinia'

export const useSupportConversationListStore = defineStore('SupportConversationListStore', {
  actions: {
    // 👉 Fetch all AuditTrails
    fetchConversationList(params) {
      console.log("fetchConversationList")
      console.log("params",params)


      // return axios.get('apps/auditTrails', { params })
      const res = {
        data: {
          conversations : [
            {
              customer_phone_number: '123456',
              name: 'Lisa',
              status: 'Close',
            },
            {
              customer_phone_number: '78910',
              name: 'Satria',
              status: 'Open',
            },
            {
              customer_phone_number: '123456',
              name: 'Fitya',
              status: 'Service',
            },
            {
              customer_phone_number: '123456',
              name: 'Gina',
              status: 'Close',
            },
            {
              customer_phone_number: '123456',
              name: 'Vicky',
              status: 'Service',
            },
          ],
          total_pages : 1,
          total_rows : 5,
        },
      }

      console.log("res:",res)
      
      return Promise.resolve(res)
    },
  },
})
