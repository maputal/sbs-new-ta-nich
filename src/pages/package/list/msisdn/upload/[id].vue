<script setup>
import FileUploader from '@/@core/components/FileUploader.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Get package ID from route parameter
const route = useRoute()
const packageId = route.params.id

const router = useRouter()

// Page title and breadcrumb
const pageTitle = ref("Edit Package")
const pageSubtitle = ref("Indosat Secure Bundling System")

// Toast states
const isSuccessToastVisible = ref(false)
const isErrorToastVisible = ref(false)

// Messages
const errorMessage = ref("")
const successMessage = ref("")

// File upload handlers
const handleUploadSuccess = response => {
  successMessage.value = "MSISDN file uploaded successfully!"
  isSuccessToastVisible.value = true
}

const handleUploadError = error => {
  errorMessage.value = error.message || "Failed to upload MSISDN file. Please try again."
  isErrorToastVisible.value = true
}

const goBack = () => {
  router.push(`/package/list/msisdn/${packageId}`)
}

// Close toasts
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false
  
  // Navigate back after successful upload
  router.push(`/package/list/msisdn/${packageId}`)
}

const closeErrorToast = () => {
  isErrorToastVisible.value = false
}

// Auto close toasts after 5 seconds
watch(isSuccessToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isSuccessToastVisible.value = false
      router.push(`/package/list/msisdn/${packageId}`)
    }, 5000)
  }
})

watch(isErrorToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isErrorToastVisible.value = false
    }, 5000)
  }
})
</script>

<template>
  <div class="package-activity-page">
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
            List MSISDN
          </h4>
        </div>
      </VCardTitle>
      <VDivider />

      <VCardText>
        <FileUploader
          file-upload-url="/ta_secure/package/import-msisdn"
          :file-upload-parameter-data="{ packageId }"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />
      </VCardText>
    </VCard>

    <!-- Success Toast -->
    <VSnackbar
      v-model="isSuccessToastVisible"
      :timeout="5000"
      color="success"
      variant="flat"
      location="top end"
      class="custom-toast-success"
    >
      <VCard
        class="success-toast-card"
        elevation="0"
      >
        <VCardText class="d-flex align-center pa-3">
          <VIcon
            icon="mdi-check-circle"
            color="success"
            size="24"
            class="me-3"
          />
          <span class="text-body-1 text-success font-weight-medium">
            {{ successMessage }}
          </span>
          <VSpacer />
          <VBtn
            icon="mdi-close"
            size="small"
            variant="text"
            color="success"
            @click="closeSuccessToast"
          />
        </VCardText>
      </VCard>
    </VSnackbar>

    <!-- Error Toast -->
    <VSnackbar
      v-model="isErrorToastVisible"
      :timeout="5000"
      color="error"
      variant="flat"
      location="top end"
      class="custom-toast-error"
    >
      <VCard
        class="error-toast-card"
        elevation="0"
      >
        <VCardText class="d-flex align-center pa-3">
          <VIcon
            icon="mdi-alert-circle"
            color="error"
            size="24"
            class="me-3"
          />
          <span class="text-body-1 text-error font-weight-medium">
            {{ errorMessage }}
          </span>
          <VSpacer />
          <VBtn
            icon="mdi-close"
            size="small"
            variant="text"
            color="error"
            @click="closeErrorToast"
          />
        </VCardText>
      </VCard>
    </VSnackbar>
  </div>
</template>

<style scoped>
.package-activity-page {
  padding: 24px;
}

/* Toast slide animation styles */
.custom-toast-success .v-snackbar__wrapper {
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.custom-toast-success.v-snackbar--active .v-snackbar__wrapper {
  transform: translateX(0);
}

.custom-toast-error .v-snackbar__wrapper {
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.custom-toast-error.v-snackbar--active .v-snackbar__wrapper {
  transform: translateX(0);
}

.success-toast-card {
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
}

.error-toast-card {
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
}
</style>
