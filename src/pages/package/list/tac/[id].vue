<script setup lang="ts">
import ListUploader from '@/components/package-management/ListUploader.vue'
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Stores
const appStore = useAppStore()
const globalStore = useGlobalStore()

const route = useRoute()
const router = useRouter()
const packageId = route.params.id

console.log('Package ID: ', packageId)

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.user || !globalStore.token) {
    router.push('/')
    
    return false
  }
  
  return true
}

const itemToDelete = ref(null)

const fetchTac = async () => {
  if (!checkAuthentication()) return
  
  appStore.showLoader()
  
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // appStore.setPopup({
    //   title: 'Success!',
    //   word: 'TAC data loaded successfully',
    //   action: 'success',
    //   onSucc: () => {},
    // })
  } catch (error) {
    appStore.showError(error.message || 'Failed to load TAC data')
  } finally {
    appStore.hideLoader()
  }
}

const deleteTac = (item = null) => {
  if (!checkAuthentication()) return
  
  if (item) {
    itemToDelete.value = item
    appStore.setPopup({
      title: 'Confirm Deletion',
      word: 'Are you sure you want to delete this TAC record?',
      action: '2',
      onSucc: confirmDelete,
    })
  } else {
    appStore.setPopup({
      title: 'Confirm Deletion',
      word: 'Are you sure you want to delete all selected TAC records?',
      action: '2',
      onSucc: confirmDelete,
    })
  }
}

const confirmDelete = async () => {
  appStore.showLoader()
  
  try {
    // TODO: Replace with actual delete API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    appStore.setPopup({
      title: 'Success!',
      word: 'TAC record(s) deleted successfully',
      action: 'success',
      onSucc: () => {},
    })
    itemToDelete.value = null
  } catch (error) {
    appStore.showError(error.message || 'Failed to delete TAC record(s)')
  } finally {
    appStore.hideLoader()
  }
}

const uploadTac = () => {
  router.push(`/package/list/tac/upload/${packageId}`)
}

const goBack = id => {
  router.push(`/package/list/${id}`)
}

const pageTitle = ref("List Package")
const pageSubtitle = ref("Indosat Secure Bundling System")
</script>

<template>
  <VRow class="mb-6">
    <VCol cols="12">
      <div class="d-flex align-baseline">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ pageTitle }}
          </h2>
          <p class="text-h5">
            {{ pageSubtitle }}
          </p>
        </div>
      </div>
    </VCol>
  </VRow>

  <VCard>
    <VCardTitle>
      <div class="d-flex justify-space-between align-center mt-2 mb-2">
        <VBtn
          variant="flat"
          icon="mdi-arrow-left"
          color="#f0f0f0"
          size="small"
          @click="goBack(packageId)"
        />
        <h4 class="text-h5 font-weight-bold mb-2">
          List TAC
        </h4>
      </div>    
    </VCardTitle>
    <VDivider />

    <VCardText>
      <ListUploader
        type="tac"
        :fetch-function="fetchTac"
        :delete-function="deleteTac"
        :upload-function="uploadTac"
      />
    </VCardText>
  </VCard>
</template>

