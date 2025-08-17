<script setup lang="ts">
import ListUploader from '@/components/package-management/ListUploader.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const packageId = route.params.id

console.log('Package ID: ', packageId)

// Toast states
const isSuccessToastVisible = ref(false)
const isErrorToastVisible = ref(false)
const isConfirmToastVisible = ref(false)

// Messages
const errorMessage = ref("")
const successMessage = ref("")
const confirmMessage = ref("")
const itemToDelete = ref(null)

const fetchTac = async () => {
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = "TAC data loaded successfully"
    isSuccessToastVisible.value = true
  } catch (error) {
    errorMessage.value = error.message || "Failed to load TAC data"
    isErrorToastVisible.value = true
  }
}

const deleteTac = (item = null) => {
  if (item) {
    itemToDelete.value = item
    confirmMessage.value = `Are you sure you want to delete this TAC record?`
  } else {
    confirmMessage.value = `Are you sure you want to delete all selected TAC records?`
  }
  isConfirmToastVisible.value = true
}

const confirmDelete = async () => {
  try {
    isConfirmToastVisible.value = false
    
    // TODO: Replace with actual delete API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = "TAC record(s) deleted successfully"
    isSuccessToastVisible.value = true
    itemToDelete.value = null
  } catch (error) {
    errorMessage.value = error.message || "Failed to delete TAC record(s)"
    isErrorToastVisible.value = true
  }
}

const cancelDelete = () => {
  isConfirmToastVisible.value = false
  itemToDelete.value = null
}

const uploadTac = () => {
  router.push(`/package/list/tac/upload/${packageId}`)
}

const goBack = id => {
  router.push(`/package/list/${id}`)
}

// Close toasts
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false
}

const closeErrorToast = () => {
  isErrorToastVisible.value = false
}

// Auto close toasts after 5 seconds
watch(isSuccessToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isSuccessToastVisible.value = false
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

const pageTitle = ref("List Package")
const pageSubtitle = ref("Indosat Secure Bundling System")
</script>

<template>
  <!-- Toast Notifications -->
  <!-- Confirmation Toast -->
  <Transition
    name="toast-slide"
    appear
  >
    <div
      v-if="isConfirmToastVisible"
      class="toast-container confirmation-toast"
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
              color="warning"
              size="24"
              class="me-3"
            />
            <div class="flex-grow-1">
              <div class="text-h6 font-weight-bold text-warning">
                Confirm Deletion
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ confirmMessage }}
              </div>
            </div>
            <div class="d-flex gap-2 ms-4">
              <VBtn
                size="small"
                variant="outlined"
                color="error"
                @click="cancelDelete"
              >
                Cancel
              </VBtn>
              <VBtn
                size="small"
                color="error"
                @click="confirmDelete"
              >
                Delete
              </VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>
  </Transition>

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

.confirmation-toast .toast-card {
  border-color: #ff9800;
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

