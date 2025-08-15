// stores/fileProgress.js
import { defineStore } from 'pinia'

export const useFileProgressStore = defineStore('fileProgress', {
  state: () => ({
    /** @type {Record<string, number>} */
    progressMap: {}
  }),

  getters: {
    getProgress: (state) => (fileName) => state.progressMap[fileName] ?? 0,
    // Optional: list files sorted by name
    fileNames: (state) => Object.keys(state.progressMap).sort()
  },

  actions: {
    setProgress(fileName, value) {
      const clamped = Math.min(100, Math.max(0, Number(value) || 0))
      // Vue 3 reactivity handles new keys on plain objects
      this.progressMap[fileName] = clamped
    },

    incrementProgress(fileName, delta) {
      const current = this.progressMap[fileName] ?? 0
      this.setProgress(fileName, current + (Number(delta) || 0))
    },

    removeFile(fileName) {
      delete this.progressMap[fileName]
    },

    clearAll() {
      this.progressMap = {}
    }
  }
})
