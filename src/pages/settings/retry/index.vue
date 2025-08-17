<script setup>
import { ref, reactive, onMounted, watch } from "vue";

const pageTitle = ref("Alert Settings");

// Form data
const alertSettings = reactive({
  firstAlertTime: "",
  secondAlertTime: "",
  msisdn: "",
});

// UI state
const isConfirmToastVisible = ref(false);
const isSuccessToastVisible = ref(false);
const isErrorToastVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("Alert Settings Saved Successfully");

// Form validation
const isFormValid = ref(false);

const firstAlertTimeRules = [
  (v) => !!v || "First alert time is required",
  (v) => (!isNaN(v) && parseInt(v) > 0) || "Must be a positive number",
];

const secondAlertTimeRules = [
  (v) => !!v || "Second alert time is required",
  (v) => (!isNaN(v) && parseInt(v) > 0) || "Must be a positive number",
];

const msisdnRules = [
  (v) => !!v || "MSISDN is required",
  (v) => v.length > 0 || "MSISDN cannot be empty",
];

// Load current settings on component mount
const loadSettings = () => {
  isLoading.value = true;

  const onSuccess = (response) => {
    if (response.data) {
      alertSettings.firstAlertTime =
        response.data.first_alert_time?.toString() || "";
      alertSettings.secondAlertTime =
        response.data.second_alert_time?.toString() || "";
      alertSettings.msisdn = response.data.msisdn || "";
    }
    isLoading.value = false;
  }

  const onError = (error) => {
    console.error("Error loading alert settings:", error);
    errorMessage.value = error.message || "Failed to load alert settings";
    isErrorToastVisible.value = true;
    isLoading.value = false;
  }

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request("get_alert_settings", {}, onSuccess, onError);
  } else {
    // Mock data for development
    setTimeout(() => {
      alertSettings.firstAlertTime = "7";
      alertSettings.secondAlertTime = "14";
      alertSettings.msisdn = "628123456789\n628987654321\n628112233445";
      isLoading.value = false;
    }, 1000);
  }
}

// Show confirmation toast
const showConfirmToast = () => {
  if (isFormValid.value) {
    isConfirmToastVisible.value = true;
  }
}

// Confirm saving changes
const confirmSave = () => {
  isConfirmToastVisible.value = false;
  saveSettings();
}

// Cancel saving changes
const cancelSave = () => {
  isConfirmToastVisible.value = false;
}

// Save settings
const saveSettings = () => {
  isLoading.value = true;

  const onSuccess = (response) => {
    isLoading.value = false;
    isSuccessToastVisible.value = true;
    successMessage.value = "Alert Settings Saved Successfully";
  }

  const onError = (error) => {
    isLoading.value = false;
    errorMessage.value = error.message || "Failed to save alert settings";
    isErrorToastVisible.value = true;
  }

  const params = {
    first_alert_time: parseInt(alertSettings.firstAlertTime),
    second_alert_time: parseInt(alertSettings.secondAlertTime),
    msisdn: alertSettings.msisdn,
  }

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request("save_alert_settings", params, onSuccess, onError);
  } else {
    // Mock success for development
    setTimeout(() => {
      isLoading.value = false;
      isSuccessToastVisible.value = true;
    }, 1500);
  }
}

// Close toasts
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false;
}

const closeErrorToast = () => {
  isErrorToastVisible.value = false;
}

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
  <div class="alert-settings">
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
                  Do you want to proceed with saving the Alert Time settings?
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
    <VRow v-if="isLoading && !alertSettings.firstAlertTime">
      <VCol cols="12" class="text-center">
        <VProgressCircular indeterminate color="primary" size="48" />
        <div class="mt-3">Loading alert settings...</div>
      </VCol>
    </VRow>

    <!-- Settings Form -->
    <VRow v-else>
      <VCol cols="12">
        <VCard class="pa-6">
          <VForm v-model="isFormValid">
            <VRow>
              <!-- First Alert Time Field -->
              <VCol cols="12" md="6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis"
                    >First Alert Time</span
                  >
                  <span class="text-error ms-1">*</span>
                </div>
                <VTextField
                  v-model="alertSettings.firstAlertTime"
                  :rules="firstAlertTimeRules"
                  placeholder="Days"
                  variant="outlined"
                  label="Days"
                  density="compact"
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Second Alert Time Field -->
              <VCol cols="12" md="6">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">Second Alert Time</span>
                  <span class="text-error ms-1">*</span>
                </div>
                <VTextField
                  v-model="alertSettings.secondAlertTime"
                  :rules="secondAlertTimeRules"
                  placeholder="Days"
                  variant="outlined"
                  label="Days"
                  density="compact"
                  :disabled="isLoading"
                />
              </VCol>

              <!-- MSISDN Field -->
              <VCol cols="12">
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">MSISDN</span>
                  <span class="text-error ms-1">*</span>
                </div>
                <VTextarea
                  v-model="alertSettings.msisdn"
                  :rules="msisdnRules"
                  placeholder="Enter MSISDN numbers"
                  variant="outlined"
                  rows="6"
                  label="Text"
                  :disabled="isLoading"
                  class="msisdn-textarea"
                />
              </VCol>

              <!-- Save Button -->
              <VCol cols="12">
                <VBtn
                  color="error"
                  :disabled="!isFormValid || isLoading"
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
.alert-settings {
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

/* MSISDN Textarea Styling */
.msisdn-textarea :deep(.v-field__input) {
  font-family: "Courier New", monospace;
  font-size: 14px;
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
