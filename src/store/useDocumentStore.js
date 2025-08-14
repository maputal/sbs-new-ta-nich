import { defineStore } from 'pinia'
import axios from '@axios'

export const useDocumentStore = defineStore('DocumentStore', {
  actions: {
    // 👉 Fetch all Documents
    fetchDocuments(params) {
      console.log("fetchDocuments")
      console.log("params",params)
      // return axios.get('apps/documents', { params })
      const res = {
        data: {
          documents : [
            {
              no: 1,
              name : 'satu'
            },
            {
              no: 2,
              name : 'dua'
            },
            {
              no: 3,
              name : 'tiga'
            },
          ],
          totalPage : 1,
          totalDocuments : 3,
        }
      }
      console.log("res:",res)
      return Promise.resolve(res)
    },

    // 👉 Fetch single document
    fetchDocument(id) {
      return axios.get(`/apps/documents/${id}`)
    },

    // 👉 Fetch Clients
    fetchClients() {
      return axios.get('/apps/document/clients')
    },
  },
})
