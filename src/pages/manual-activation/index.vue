<script setup>
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import globalRequest from '@/plugins/globalRequest';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

// =============================================== meta data  
const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  appStore.hideLoader()
  appStore.showError(e)
}

function handleFileSubmit(file) {
  console.log("File ready to upload:", file);
  uploadData(file)
  // Here you can call your API to upload
}

const uploadData = (dataUpload) => {

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully uploaded the data',
    action: 'success',
    onSucc: () => {
      appStore.hideLoader()
    },
  })

  return

  console.log('Code uploadData!')
  appStore.showLoader()

  const params = {
    group_name: editAddGroupData.value.groupName,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully added the group',
        action: 'success',
        onSucc: () => {
          resetGroupData()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

// =============================================== User interaction
const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData.priv

console.log("---------- hasil priv=", priv)

// =============================================== On Life Cycle Event
onMounted(() => {
  if(appStore.isMountedNavbarNotifications == false){
    getPackageExp()
  }
})
</script>

<template>
  <section>
    <div>
      <h6 class="text-h5 font-weight-bold mb-4">
        Manual Activation
      </h6>
      <!-- <p class="text-subtitle-1 mb-2 font-weight-medium">
        Secure Bundling System
      </p> -->
    </div>

    <VCard class="full-height-card px-4">
      <FileUploader
        acceptedFormats=".xls,.xlsx,.csv"
        @files-submitted="handleFileSubmit"
      />
    </VCard>
  </section>
</template>
  
<style lang="scss" scoped>
.full-height-card {
  height: 100%;
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: false
</route>
