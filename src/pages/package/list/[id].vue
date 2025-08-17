<script setup>
import PackageForm from "@/components/package-management/PackageForm.vue"
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

// Router
const route = useRoute()
const router = useRouter()

// Page title and breadcrumb
const pageTitle = ref("Edit Package")
const pageSubtitle = ref("Indosat Secure Bundling System")

// Package ID from route
const packageId = ref(route.params.id)

// TODO: Form data hardcoded
const packageData = ref({
  id: 12,
  packageName: "",
  packageCode: "",
  packageLimit: 0,
  packageDuration: "",
  priority: "",
  packageTariff: 0,
  applicableArea: [],
  bundlingType: [],
  monogami: "Multi-SMS",
  expiry: null,
  offer: false,
  offerMessage: "",
  rejectionMessage: "",
  smsKeyword: "",
  smsWarning: "",
  smsTerminate: "",
  smsReactivation: "",
  customTerminationWaitTime: null,
  wordingEditor: true,
  manualActivationNotification: "",
  failedActivationNotification: "",
  pairedNotification: "",
  fraudNotification: "",
  specialFraudIMEINotification: "",
})

// Initial data for reset
const initialPackageData = ref({})

// Loading states
const isLoading = ref(false)
const isSubmitting = ref(false)
const isPageLoading = ref(true)

// Toast states
const isSuccessToastVisible = ref(false)
const isErrorToastVisible = ref(false)
const isConfirmToastVisible = ref(false)

// Messages
const errorMessage = ref("")
const successMessage = ref("")

// Methods
const loadPackageData = async () => {
  try {
    isPageLoading.value = true

    // Mock API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data based on package ID
    const mockPackageData = {
      id: packageId.value,
      packageName: "",
      packageCode: "",
      packageLimit: 0,
      packageDuration: "",
      priority: "",
      packageTariff: 0,
      applicableArea: ["MC-MSISDN-JASMR"],
      bundlingType: ["BUNDLE"],
      monogami: "Multi-SMS",
      expiry: "2025-12-31",
      offer: true,
      offerMessage: "",
      rejectionMessage: "",
      smsKeyword: "",
      smsWarning: "",
      smsTerminate: "",
      smsReactivation: "",
      customTerminationWaitTime: null,
      wordingEditor: true,
      manualActivationNotification: "",
      failedActivationNotification: "",
      pairedNotification: "",
      fraudNotification: "",
      specialFraudIMEINotification: "",
    }

    packageData.value = { ...mockPackageData }
    initialPackageData.value = { ...mockPackageData }

    // TODO: Replace with actual API call
    // const response = await window.moffas.do_request(
    //   'get_package',
    //   { package_id: packageId.value },
    //   (data) => {
    //     packageData.value = { ...data };
    //     initialPackageData.value = { ...data };
    //   },
    //   (error) => {
    //     errorMessage.value = error.message || "Failed to load package data";
    //     isErrorDialogVisible.value = true;
    //   }
    // );
  } catch (error) {
    errorMessage.value = error.message || "Failed to load package data"
    isErrorToastVisible.value = true
  } finally {
    isPageLoading.value = false
  }
}

const handleSubmit = async formData => {
  isConfirmToastVisible.value = true
}

const confirmSubmit = async () => {
  isConfirmToastVisible.value = false
  
  try {
    isSubmitting.value = true

    // Mock API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: Replace with actual API call
    // const response = await window.moffas.do_request(
    //   'update_package',
    //   {
    //     package_id: packageId.value,
    //     ...packageData.value
    //   },
    //   (data) => {
    //     successMessage.value = "Package updated successfully!";
    //     isSuccessToastVisible.value = true;
    //   },
    //   (error) => {
    //     errorMessage.value = error.message || "Failed to update package";
    //     isErrorToastVisible.value = true;
    //   }
    // );

    successMessage.value = "Package updated successfully!"
    isSuccessToastVisible.value = true
  } catch (error) {
    errorMessage.value = error.message || "Failed to update package"
    isErrorToastVisible.value = true
  } finally {
    isSubmitting.value = false
  }
}

const cancelSubmit = () => {
  isConfirmToastVisible.value = false
}

const handleReset = () => {
  packageData.value = { ...initialPackageData.value }
}

const handleSuccessClose = () => {
  // Navigate back to package list after successful update
  router.push("/package/list")
}

// Close toasts
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false

  // Navigate back to package list after successful update
  router.push("/package/list")
}

const closeErrorToast = () => {
  isErrorToastVisible.value = false
}

// Auto close toasts after 5 seconds
watch(isSuccessToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isSuccessToastVisible.value = false
      router.push("/package/list")
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

const goBack = () => {
  router.push("/package/list")
}

const goToActivity = id => {
  router.push(`/package/list/activity/${id}`)
}

const handleMSISDNClick = id => {
  router.push(`/package/list/msisdn/${id}`)
}

const handleTACClick = id => {
  router.push(`/package/list/tac/${id}`)
}

const handleIMEIClick = id => {
  router.push(`/package/list/imei/${id}`)
}

// Lifecycle
onMounted(() => {
  if (!packageId.value) {
    errorMessage.value = "Invalid package ID"
    isErrorToastVisible.value = true
    
    return
  }

  loadPackageData()
})
</script>

<template>
  <div class="edit-package-page">
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
                  Confirm Package Update
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Are you sure you want to update this package?
                </div>
              </div>
              <div class="d-flex gap-2 ms-4">
                <VBtn
                  size="small"
                  variant="outlined"
                  color="error"
                  @click="cancelSubmit"
                >
                  Cancel
                </VBtn>
                <VBtn
                  size="small"
                  color="error"
                  @click="confirmSubmit"
                >
                  OK
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

    <!-- Loading State -->
    <VRow v-if="isPageLoading">
      <VCol cols="12">
        <VCard>
          <VCardText class="text-center pa-8">
            <VProgressCircular
              indeterminate
              color="primary"
              size="48"
            />
            <p class="mt-4">
              Loading package data...
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Edit Package Form -->
    <VRow v-else>
      <VCol cols="12">
        <VCard>
          <VCardTitle>
            <div class="d-flex justify-md-space-between align-center">
              <div class="d-flex align-center mb-5 mt-5 text-h5 font-weight-bold">
                <VBtn
                  variant="flat"
                  icon="mdi-arrow-left"
                  color="#f0f0f0"
                  size="small"
                  @click="goBack"
                />
                <h5 class="ml-3">
                  Edit List Package
                </h5>
              </div>
              <div class="d-flex align-center justify-space-around">
                <VBtn
                  variant="flat"
                  color="primary"
                  class="mr-5 text-none text-subtitle-2"
                  size="small"
                  @click="goToActivity(packageData.id)"
                >
                  View Activity Log
                </VBtn>
                <div class="connected-buttons">
                  <VBtn
                    class="button-left"
                    variant="outlined"
                    color="error"
                    size="small"
                    @click="handleMSISDNClick(packageData.id)"
                  >
                    List MSISDN
                  </VBtn>
                  <VBtn
                    class="button-middle"
                    variant="outlined"
                    color="error"
                    size="small"
                    @click="handleIMEIClick(packageData.id)"
                  >
                    List IMEI
                  </VBtn>
                  <VBtn
                    class="button-right"
                    variant="outlined"
                    color="error"
                    size="small"
                    @click="handleTACClick(packageData.id)"
                  >
                    List TAC
                  </VBtn>
                </div>
              </div>
            </div>
          </VCardTitle>

          <VDivider class="my-4" />

          <VCardText>
            <PackageForm
              v-model="packageData"
              :is-loading="isSubmitting"
              mode="edit"
              @submit="handleSubmit"
              @reset="handleReset"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.edit-package-page {
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

.connected-buttons {
  display: inline-flex;
  border: 1px solid rgb(var(--v-theme-error));
  border-radius: 4px !important;
}

.connected-buttons .v-btn {
  border-radius: 0 !important;
  margin: 0 !important;
}

.button-left {
  border: none !important;
}

.button-middle {
  border-top: none !important;
  border-bottom: none !important;
}

.button-right {
  border: none !important;
}

/* Ensure consistent hover and focus states */
.connected-buttons .v-btn:hover {
  z-index: 1;
  position: relative;
}

.connected-buttons .v-btn:focus {
  z-index: 2;
  position: relative;
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

/* Additional styling for better visual hierarchy */
.gap-2 > * + * {
  margin-left: 8px;
}
</style>
