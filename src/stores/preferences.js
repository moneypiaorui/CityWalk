import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    preferences: [
      { label: '景点少人路线', value: 'less_crowded' },
      { label: '吃货路线', value: 'food' },
      { label: '阴凉路线', value: 'shade' },
      { label: '最短路线', value: 'shortest' },
      { label: '文化探索', value: 'culture' }
    ]
  }),
  actions: {
    setPreferences(newPrefs) {
      this.preferences = newPrefs
    }
  }
})