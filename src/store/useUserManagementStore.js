import { defineStore } from 'pinia'

export const useUserManagementStore = defineStore('UserManagementStore', {
  actions: {
    // 👉 Fetch all AuditTrails
    fetchUserManagement(params) {
      console.log("fetchUserManagement")
      console.log("params",params)


      // return axios.get('apps/auditTrails', { params })
      const res = {
        data: {
          userManagement : [
            {
              no: 1,
              id: 99999991,
              nip: '1234567890',
              name: 'John Doe',
              email: 'john@gmail.com',
              phone_number: '081234567890',
              role: 'Agent',
              status: true,
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