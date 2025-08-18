// stores/userManagement.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserManagementStore = defineStore("userManagement", () => {
  // state
  const user = ref(null);

  // actions
  function setUser(userObj) {
    console.log("SET USER")
    console.log(userObj)
    // Optionally validate/clone object to avoid reference mutation
    user.value = { ...userObj };
  }

  return {
    user,
    setUser
  };
});
