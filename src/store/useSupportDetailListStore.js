import { defineStore } from 'pinia'

export const useSupportTicketDetailListStore = defineStore('SupportTicketDetailListStore', {
  actions: {
    // 👉 Fetch all AuditTrails
    fetchTicketDetail(params) {
      console.log("fetchConversationList")
      console.log("params",params)


      // return axios.get('apps/auditTrails', { params })
      const res = {
        data: {
          ticket_id: '13',
          customer_phone_number: '6281210028232',
          status: 'Close',
          initiated_type: 'cis',
          category: 'marketing',
          priority: 'Low',
          user_name: 'diniagent',
          channel: "READ",
          description: "Wifi rusak",
          note: "apa kabar?",
          updated_tstamp: 1692001077,
          created_tstamp: 1691997372,
          attachment: [
            {
              id: 12340,
              filename: 'iniadalahattachment0',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12341,
              filename: 'iniadalahattachment1',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12342,
              filename: 'iniadalahattachment2',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
          ],
          notes: [
            {
              id: 12343,
              content: 'iniadalahnotes3',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12344,
              content: 'iniadalahnotes4',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes5',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
            {
              id: 12345,
              content: 'iniadalahnotes11',
              created_tstamp: 1692001077,
              updated_tstamp: 1691997372,
              user_id: 1356666,
            },
          ],
        },
      }

      console.log("res:",res)
      
      return Promise.resolve(res)
    },
  },
})
