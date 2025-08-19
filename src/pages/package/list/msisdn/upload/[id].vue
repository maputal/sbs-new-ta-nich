<script setup>
import FileUploader from '@/@core/components/FileUploader.vue'
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Stores
const appStore = useAppStore()
const globalStore = useGlobalStore()

// Get package ID from route parameter
const route = useRoute()
const packageId = route.params.id

const router = useRouter()

// Page title and breadcrumb
const pageTitle = ref("List Package")
const pageSubtitle = ref("Indosat Secure Bundling System")

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.user || !globalStore.token) {
    router.push('/')
    
    return false
  }
  
  return true
}

// File upload handlers
const handleUploadSuccess = response => {
  appStore.setPopup({
    title: 'Success!',
    word: 'MSISDN file uploaded successfully!',
    action: 'success',
    onSucc: () => {
      router.push(`/package/list/msisdn/${packageId}`)
    },
  })
}

const handleUploadError = error => {
  appStore.showError(error.message || 'Failed to upload MSISDN file. Please try again.')
}

const goBack = () => {
  router.push(`/package/list/msisdn/${packageId}`)
}
</script>

<template>
  <div
    v-if="checkAuthentication()"
    class="package-activity-page"
  >
    <!-- Page Header -->
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
            Upload MSISDN
          </h4>
        </div>
      </VCardTitle>
      <VDivider />

      <VCardText>
        <FileUploader 
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.package-activity-page {
  padding: 24px;
  position: relative;
}
</style>
