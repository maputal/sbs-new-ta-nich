<script setup>
import PackageForm from "@/components/package-management/PackageForm.vue"
import { onMounted, ref, watch } from "vue"

// Page title and breadcrumb
const pageTitle = ref("Create Package")
const pageSubtitle = ref("Indosat Secure Bundling System")

// Form data
const packageData = ref({
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

// Loading states
const isLoading = ref(false)
const isSubmitting = ref(false)

// Toast states
const isSuccessToastVisible = ref(false)
const isErrorToastVisible = ref(false)
const isConfirmToastVisible = ref(false)

// Messages
const errorMessage = ref("")
const successMessage = ref("")

// Methods
const resetForm = () => {
  packageData.value = {
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
  }
}

const handleSubmit = async formData => {
  isConfirmToastVisible.value = true
}

const confirmSubmit = async () => {
  isConfirmToastVisible.value = false
  
  try {
    isSubmitting.value = true

    // TODO: Replace with actual API call
    // await window.moffas.do_request(
    //   'create_package',
    //   packageData.value,
    //   (data) => {
    //     successMessage.value = "Package created successfully!";
    //     isSuccessToastVisible.value = true;
    //     resetForm();
    //   },
    //   (error) => {
    //     errorMessage.value = error.message || "Failed to create package";
    //     isErrorToastVisible.value = true;
    //   }
    // );

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    successMessage.value = "Package created successfully!"
    isSuccessToastVisible.value = true
    resetForm()
  } catch (error) {
    errorMessage.value = error.message || "Failed to create package"
    isErrorToastVisible.value = true
  } finally {
    isSubmitting.value = false
  }
}

const cancelSubmit = () => {
  isConfirmToastVisible.value = false
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

// Lifecycle
onMounted(() => {
  // Load initial data if needed
})
</script>

<template>
  <div class="package-management-page">
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
                  Confirm Package Creation
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Are you sure you want to create this package?
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
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ pageTitle }}
          </h2>
          <p class="text-body-2 text-medium-emphasis">
            {{ pageSubtitle }}
          </p>
        </div>
      </VCol>
    </VRow>

    <!-- Create New Package Form -->
    <VRow>
      <VCol cols="12">
        <PackageForm
          v-model="packageData"
          :is-loading="isSubmitting"
          mode="create"
          @submit="handleSubmit"
          @reset="resetForm"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.package-management-page {
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

/* Additional styling for better visual hierarchy */
.gap-2 > * + * {
  margin-left: 8px;
}
</style>
``
