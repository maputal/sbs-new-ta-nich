import { defineStore } from 'pinia'

export const useSupportTicketListStore = defineStore('SupportTicketListStore', {
  actions: {
    // 👉 Fetch all AuditTrails
    fetchConversationList(params) {
      console.log("fetchConversationList")
      console.log("params",params)


      // return axios.get('apps/auditTrails', { params })
      const res = {
        data: {
          tickets : [
            {
              ticket_id: '13',
              customer_phone_number: '123456',
              name: 'Lisa',
              status: 'Closed',
              initiated_type: 'cis',
              category: 'marketing',
              priority: 'Low',
              user_name: 'diniagent',
              channel: "READ",
              description: "READ Dong",
              note: "apa kabar?",
              updated_tstamp: 1692001077,
              created_tstamp: 1691997372,
            },
            {
              ticket_id: '14',
              customer_phone_number: '78910',
              name: 'Satria',
              status: 'Closed',
              initiated_type: 'Bis',
              category: 'Marketing',
              priority: 'Low',
              user_name: 'diniagent',
              channel: "READ",
              description: "Kamu kenapa",
              note: "apa kabar?",
              updated_tstamp: 1692001077,
              created_tstamp: 1691997372,
            },
            {
              ticket_id: '15',
              customer_phone_number: '123456',
              name: 'Fitya',
              status: 'Replied',
              initiated_type: 'cis',
              category: 'marketing',
              priority: 'Low',
              user_name: 'diniagent',
              channel: "READ",
              description: "ini apa",
              note: "apa kabar?",
              updated_tstamp: 1692001077,
              created_tstamp: 1691997372,
            },
            {
              ticket_id: '16',
              customer_phone_number: '123456',
              name: 'Gina',
              status: 'Responed',
              initiated_type: 'cis',
              category: 'marketing',
              priority: 'Low',
              user_name: 'diniagent',
              channel: "READ",
              description: "READ",
              note: "apa kabar?",
              updated_tstamp: 1692001077,
              created_tstamp: 1691997372,
            },
            {
              ticket_id: '17',
              customer_phone_number: '123456',
              name: 'Vicky',
              status: 'Awaiting Response',
              initiated_type: 'cis',
              category: 'marketing',
              priority: 'Low',
              user_name: 'diniagent',
              channel: "READ",
              description: "READ",
              note: "apa kabar?",
              updated_tstamp: 1692001077,
              created_tstamp: 1691997372,
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
