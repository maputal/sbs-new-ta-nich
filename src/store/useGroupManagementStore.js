import { defineStore } from 'pinia'

export const useGroupManagementStore = defineStore('groupManagementStore', {
  actions: {
    // 👉 Fetch all AuditTrails
    fetchGroupManagement(params) {
      console.log("fetchGroupManagement")
      console.log("params",params)


      // return axios.get('apps/auditTrails', { params })
      const res = {
        data: {
          groupManagement : [
            {
              no: 1,
              id: 99999991,
              nip: '1234567890',
              name: 'John Doe',
              email: 'john@gmail.com',
              phone_number: '081234567890',
              role: 'Agent',
              status: true,
              group_name: 'Marketing'
            },
            {
              no: 2,
              id: 99999992,
              nip: '1234567890',
              name: 'Corey Botosh',
              email: 'corey@gmail.com',
              phone_number: '081234567456',
              role: 'Agent',
              status: false,
              group_name: 'Supervisor'
            },
            {
              no: 3,
              id: 99999993,
              nip: '1234567890',
              name: 'Nolan Calzoni',
              email: 'nolan@gmail.com',
              phone_number: '081234567789',
              role: 'Agent',
              status: true,
              group_name: 'Finance and Accounting'

            },
            {
              no: 4,
              id: 99999994,
              nip: '1234567890',
              name: 'Jaydon Geidt',
              email: 'jaydon@gmail.com',
              phone_number: '081234567323',
              role: 'Agent',
              status: false,
              group_name: 'Operation'

            },
            {
              no: 5,
              id: 99999995,
              nip: '1234567890',
              name: 'Angel Dokidis',
              email: 'angel@gmail.com',
              phone_number: '081234567435',
              role: 'Agent',
              status: true,
              group_name: 'Research and Development'

            },
          ],
          totalPage : 1,
          totalRow : 5,
        },
      }

      console.log("res:",res)
      
      return Promise.resolve(res)
    },
  },
})