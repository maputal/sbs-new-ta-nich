<script setup>
import { ref, reactive, watch, onMounted } from "vue";

const pageTitle = ref("Wording Editor");

// Form data
const wordingData = reactive({
  manualActivateNotification: "",
  failedActivationNotification: "",
  pairedNotification: "",
  fraudNotification: "",
  specialFraudImeiNotification: "",
});

// UI state
const isConfirmToastVisible = ref(false);
const isSuccessToastVisible = ref(false);
const isErrorToastVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("Wording settings saved successfully");

// Form validation
const isFormValid = ref(true); // Always valid since no required fields

// Load current settings on component mount
const loadSettings = () => {
  isLoading.value = true;

  const onSuccess = (response) => {
    if (response.data) {
      wordingData.manualActivateNotification =
        response.data.manual_activate_notification || "";
      wordingData.failedActivationNotification =
        response.data.failed_activation_notification || "";
      wordingData.pairedNotification = response.data.paired_notification || "";
      wordingData.fraudNotification = response.data.fraud_notification || "";
      wordingData.specialFraudImeiNotification =
        response.data.special_fraud_imei_notification || "";
    }
    isLoading.value = false;
  };

  const onError = (error) => {
    console.error("Error loading wording settings:", error);
    errorMessage.value = error.message || "Failed to load wording settings";
    isErrorToastVisible.value = true;
    isLoading.value = false;
  };

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request("get_wording_settings", {}, onSuccess, onError);
  } else {
    // Mock data for development
    setTimeout(() => {
      wordingData.manualActivateNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum.";
      wordingData.failedActivationNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum.";
      wordingData.pairedNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum.";
      wordingData.fraudNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum.";
      wordingData.specialFraudImeiNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum.";
      isLoading.value = false;
    }, 1000);
  }
};

// Show confirmation toast
const showConfirmToast = () => {
  isConfirmToastVisible.value = true;
};

// Confirm saving changes
const confirmSave = () => {
  isConfirmToastVisible.value = false;
  saveSettings();
};

// Cancel saving changes
const cancelSave = () => {
  isConfirmToastVisible.value = false;
};

// Save settings
const saveSettings = () => {
  isLoading.value = true;

  const onSuccess = (response) => {
    isLoading.value = false;
    isSuccessToastVisible.value = true;
    successMessage.value = "Wording settings saved successfully";
  };

  const onError = (error) => {
    isLoading.value = false;
    errorMessage.value = error.message || "Failed to save wording settings";
    isErrorToastVisible.value = true;
  };

  const params = {
    manual_activate_notification: wordingData.manualActivateNotification,
    failed_activation_notification: wordingData.failedActivationNotification,
    paired_notification: wordingData.pairedNotification,
    fraud_notification: wordingData.fraudNotification,
    special_fraud_imei_notification: wordingData.specialFraudImeiNotification,
  };

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request(
      "save_wording_settings",
      params,
      onSuccess,
      onError
    );
  } else {
    // Mock success for development
    setTimeout(() => {
      isLoading.value = false;
      isSuccessToastVisible.value = true;
    }, 1500);
  }
};

// Close toasts
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false;
};

const closeErrorToast = () => {
  isErrorToastVisible.value = false;
};

// Auto close toasts after 5 seconds
watch(isSuccessToastVisible, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      isSuccessToastVisible.value = false;
    }, 5000);
  }
});

watch(isErrorToastVisible, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      isErrorToastVisible.value = false;
    }, 5000);
  }
});

// Load settings on component mount
onMounted(() => {
  loadSettings();
});
</script>

<template>
  <div class="wording-editor">
    <!-- Toast Notifications -->
    <!-- Confirmation Toast -->
    <Transition name="toast-slide" appear>
      <div
        v-if="isConfirmToastVisible"
        class="toast-container confirmation-toast"
      >
        <VCard class="toast-card" elevation="8" rounded="lg">
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
                  Confirm Saving Changes
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Do you want to proceed with saving the wording settings?
                </div>
              </div>
              <div class="d-flex gap-2 ms-4">
                <VBtn
                  size="small"
                  variant="outlined"
                  color="error"
                  @click="cancelSave"
                >
                  Cancel
                </VBtn>
                <VBtn size="small" color="error" @click="confirmSave">
                  OK
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition name="toast-slide" appear>
      <div v-if="isSuccessToastVisible" class="toast-container success-toast">
        <VCard class="toast-card" elevation="8" rounded="lg">
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
              <VBtn size="small" color="success" @click="closeSuccessToast">
                OK
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

    <!-- Error Toast -->
    <Transition name="toast-slide" appear>
      <div v-if="isErrorToastVisible" class="toast-container error-toast">
        <VCard class="toast-card" elevation="8" rounded="lg">
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon
                icon="mdi-alert-circle"
                color="error"
                size="24"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-error">Error!</div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ errorMessage }}
                </div>
              </div>
              <VBtn size="small" color="error" @click="closeErrorToast">
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
          <h2 class="text-h4 font-weight-bold">
            {{ pageTitle }}
          </h2>
          <h3 class="text-h6 text-medium-emphasis">
            Indosat Secure Bundling System
          </h3>
        </div>
      </VCol>
    </VRow>

    <!-- Loading State -->
    <VRow v-if="isLoading && !wordingData.manualActivateNotification">
      <VCol cols="12" class="text-center">
        <VProgressCircular indeterminate color="primary" size="48" />
        <div class="mt-3">Loading wording settings...</div>
      </VCol>
    </VRow>

    <!-- Wording Editor Form -->
    <VRow v-else>
      <VCol cols="12">
        <VCard class="pa-6">
          <VForm v-model="isFormValid">
            <VRow>
              <!-- Manual Activate Notification -->
              <VCol cols="12" class="pb-6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis"
                    >Manual Activate Notification</span
                  >
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.manualActivateNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter manual activate notification text..."
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Failed Activation Notification -->
              <VCol cols="12" class="pb-6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis"
                    >Failed Activation Notification</span
                  >
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.failedActivationNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter failed activation notification text..."
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Paired Notification -->
              <VCol cols="12" class="pb-6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis"
                    >Paired Notification</span
                  >
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.pairedNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter paired notification text..."
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Fraud Notification -->
              <VCol cols="12" class="pb-6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis"
                    >Fraud Notification</span
                  >
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.fraudNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter fraud notification text..."
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Special Fraud IMEI Notification -->
              <VCol cols="12" class="pb-6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis"
                    >Special Fraud IMEI Notification</span
                  >
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.specialFraudImeiNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter special fraud IMEI notification text..."
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Save Button -->
              <VCol cols="12">
                <VBtn
                  color="error"
                  :disabled="isLoading"
                  :loading="isLoading"
                  @click="showConfirmToast"
                >
                  Save
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.wording-editor {
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
  background-color: white !important;
  border-color: #e0e0e0;
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
