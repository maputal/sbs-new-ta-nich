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
  successMessage.value = "IMEI file uploaded successfully!"
  isSuccessToastVisible.value = true
}

const handleUploadError = error => {
  errorMessage.value = error.message || "Failed to upload IMEI file. Please try again."
  isErrorToastVisible.value = true
}

const goBack = () => {
  router.push(`/package/list/imei/${packageId}`)
}

// Close toasts
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false
  
  // Navigate back after successful upload
  router.push(`/package/list/imei/${packageId}`)
}

const closeErrorToast = () => {
  isErrorToastVisible.value = false
}

// Auto close toasts after 5 seconds
watch(isSuccessToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isSuccessToastVisible.value = false
      router.push(`/package/list/imei/${packageId}`)
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
    <!-- Toast Notifications -->
    <!-- Success Toast -->
    <Transition
      name="toast-slide"
      appear
    >
      <div
        v-if="isSuccessToastVisible"
        class="toast-container success-toast"
      >
        <VCard
          class="toast-card"
          elevation="8"
          rounded="lg"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon
                icon="mdi-check-circle"
                color="success"
                size="24"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-success">
                  Success!
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ successMessage }}
                </div>
              </div>
              <VBtn
                size="small"
                color="success"
                variant="flat"
                class="ms-4"
                @click="closeSuccessToast"
              >
                OK
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

    <!-- Error Toast -->
    <Transition
      name="toast-slide"
      appear
    >
      <div
        v-if="isErrorToastVisible"
        class="toast-container error-toast"
      >
        <VCard
          class="toast-card"
          elevation="8"
          rounded="lg"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon
                icon="mdi-alert-circle"
                color="error"
                size="24"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-error">
                  Error!
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ errorMessage }}
                </div>
              </div>
              <VBtn
                size="small"
                color="error"
                variant="flat"
                class="ms-4"
                @click="closeErrorToast"
              >
                OK
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

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
            List IMEI
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

/* Toast Container Positioning */
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 400px;
  max-width: 600px;
}

/* Toast Card Styling */
.toast-card {
  border: 2px solid;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: white;
}

.success-toast .toast-card {
  border-color: #4caf50;
}

.error-toast .toast-card {
  border-color: #f44336;
}

/* Toast Slide Animation */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-100px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-100px);
}

.toast-slide-enter-to,
.toast-slide-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .toast-container {
    min-width: 320px;
    max-width: calc(100vw - 40px);
    left: 20px;
    right: 20px;
    transform: none;
  }

  .toast-slide-enter-from,
  .toast-slide-leave-to {
    transform: translateY(-100px);
  }

  .toast-slide-enter-to,
  .toast-slide-leave-from {
    transform: translateY(0);
  }
}
</style>
