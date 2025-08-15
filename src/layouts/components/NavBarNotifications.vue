<script setup>
import Notifications from '@core/components/Notifications.vue'
import { useNotificationOperations } from '@/plugins/fetchNotifications'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { getPackageExp, updateIsReadPackageExp } = useNotificationOperations()


onMounted(() => {
  console.log('masuk NavbarNotifications')
  appStore.isMountedNavbarNotifications = true
  getPackageExp()
})
</script>

<template>
  <Notifications 
    :notifications="appStore.notifications" 
    :totalUnread="appStore.totalUnreadExpPackage" 
    :totalPackageExp="appStore.totalExpPackage"
    @click:readAllNotifications="(data) => {
      updateIsReadPackageExp(data)
    }"
    @get-data="() => {
      getPackageExp()
    }"
  />
</template>
