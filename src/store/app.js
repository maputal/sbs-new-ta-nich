import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const currentMSISDN = ref('')


  // Loader state
  const showProgressCircular = ref(false)
  function showLoader() {
    showProgressCircular.value = true
  }
  function hideLoader() {
    showProgressCircular.value = false
  }

  // General dialog state
  const popup = ref({
    visible: false,
    title: '',
    word: '',
    buttonLabelsYes: 'Yes',
    buttonLabelsNo: 'No',
    action: '',
    onSucc: null,
  })
  function setPopup(payload) {
    // popup.value = {
    //   ...popup.value,
    //   ...payload,
    //   visible: true,
    // }
    
    payload.visible = true
    popup.value = payload
  }
  function closePopup() {
    popup.value.visible = false
  }
  function confirmPopup() {
    closePopup()
    if (typeof popup.value.onSucc === 'function') {
      popup.value.onSucc()
    }
  }

  // Error dialog state
  const isErrorVisible = ref(false)
  const customErrorMessages = ref('')
  function showError(message) {
    customErrorMessages.value = message
    isErrorVisible.value = true
  }
  function hideError() {
    isErrorVisible.value = false
    customErrorMessages.value = ''
  }

  // Notification state
  const isMountedNavbarNotifications = ref(false)
  const totalUnreadExpPackage = ref(0)
  const totalExpPackage = ref(0)
  const notificationsStore= ref([])
  const notifications = ref([
    {
      title: 'Expired Today',
      subtitle: 'Please take immediate action.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 1 day',
      subtitle: 'Urgent: expires tomorrow.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 2 days',
      subtitle: 'Monitor and act before expiration.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 3 days',
      subtitle: 'Plan your next step soon.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 4 days',
      subtitle: 'Schedule renewal preparation.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 5 days',
      subtitle: 'Reminder: expiry approaching.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 6 days',
      subtitle: 'Early reminder: review packages.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expires in 7 days',
      subtitle: 'Plan renewal ahead of time.',
      count: 0,
      is_read: false,
    },
    {
      title: 'Expired',
      count: 0,
      is_read: false,
    },
  ])
  function setNotifications(newData) {
    totalUnreadExpPackage.value = 0
    totalExpPackage.value = 0

    notifications.value = notifications.value.map((notif) => {
      const match = newData.find((item) => item.label === notif.title)
      const storeMatch = notificationsStore.value.find((item) => item.title === notif.title)

      const count = match?.count ?? 0
      const prevCount = storeMatch?.count ?? 0
      const newIsRead = match?.is_read ?? true
      const prevIsRead = storeMatch?.is_read ?? true

      const isChanged = count !== prevCount || newIsRead !== prevIsRead
      const is_read = isChanged ? false : (storeMatch?.is_read ?? true)

      // const count = match?.count ?? 0
      // const is_read = match?.is_read ?? false

      totalExpPackage.value += count
      if (!is_read) totalUnreadExpPackage.value += count

      return {
        ...notif,
        count,
        is_read,
      }
    })

    // Deep copy so future changes to notifications don't affect the store reference
    notificationsStore.value = notifications.value.map(n => ({ ...n }))
  }  

  return {
    currentMSISDN,
    
    // Loader
    showProgressCircular,
    showLoader,
    hideLoader,

    // General dialog
    popup,
    setPopup,
    closePopup,
    confirmPopup,

    // Error
    isErrorVisible,
    customErrorMessages,
    showError,
    hideError,

    // Notification
    isMountedNavbarNotifications,
    totalUnreadExpPackage,
    totalExpPackage,
    notifications,
    notificationsStore,
    setNotifications,
  }
})
