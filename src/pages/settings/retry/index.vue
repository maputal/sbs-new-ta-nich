<script setup>
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { onMounted, reactive, ref } from "vue"
import { useRouter } from 'vue-router'

// Stores
const appStore = useAppStore()
const globalStore = useGlobalStore()
const router = useRouter()

const pageTitle = ref("Alert Settings")

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.user || !globalStore.token) {
    router.push('/')
    
    return false
  }
  
  return true
}

// Form data
const alertSettings = reactive({
  firstAlertTime: "",
  secondAlertTime: "",
  msisdn: "",
})

// Form validation
const isFormValid = ref(false)

const firstAlertTimeRules = [
  v => !!v || "First alert time is required",
  v => (!isNaN(v) && parseInt(v) > 0) || "Must be a positive number",
]

const secondAlertTimeRules = [
  v => !!v || "Second alert time is required",
  v => (!isNaN(v) && parseInt(v) > 0) || "Must be a positive number",
]

const msisdnRules = [
  v => !!v || "MSISDN is required",
  v => v.length > 0 || "MSISDN cannot be empty",
]

// Load current settings on component mount
const loadSettings = () => {
  if (!checkAuthentication()) return
  
  appStore.showLoader()

  const onSuccess = response => {
    if (response.data) {
      alertSettings.firstAlertTime =
        response.data.first_alert_time?.toString() || ""
      alertSettings.secondAlertTime =
        response.data.second_alert_time?.toString() || ""
      alertSettings.msisdn = response.data.msisdn || ""
    }
    appStore.hideLoader()
  }

  const onError = error => {
    console.error("Error loading alert settings:", error)
    appStore.showError(error.message || "Failed to load alert settings")
    appStore.hideLoader()
  }

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request("get_alert_settings", {}, onSuccess, onError)
  } else {
    // Mock data for development
    setTimeout(() => {
      alertSettings.firstAlertTime = "7"
      alertSettings.secondAlertTime = "14"
      alertSettings.msisdn = "628123456789\n628987654321\n628112233445"
      appStore.hideLoader()
    }, 1000)
  }
}

// Show confirmation dialog
const showConfirmDialog = () => {
  if (!checkAuthentication()) return
  
  if (isFormValid.value) {
    appStore.setPopup({
      title: 'Confirm Saving Changes',
      word: 'Do you want to proceed with saving the Alert Time settings?',
      action: '2',
      onSucc: saveSettings,
    })
  }
}

// Save settings
const saveSettings = () => {
  appStore.showLoader()

  const onSuccess = response => {
    appStore.hideLoader()
    appStore.setPopup({
      title: 'Success!',
      word: 'Alert Settings Saved Successfully',
      action: 'success',
      onSucc: () => {},
    })
  }

  const onError = error => {
    appStore.hideLoader()
    appStore.showError(error.message || "Failed to save alert settings")
  }

  const params = {
    first_alert_time: parseInt(alertSettings.firstAlertTime),
    second_alert_time: parseInt(alertSettings.secondAlertTime),
    msisdn: alertSettings.msisdn,
  }

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request("save_alert_settings", params, onSuccess, onError)
  } else {
    // Mock success for development
    setTimeout(() => {
      appStore.hideLoader()
      appStore.setPopup({
        title: 'Success!',
        word: 'Alert Settings Saved Successfully',
        action: 'success',
        onSucc: () => {},
      })
    }, 1500)
  }
}

// Load settings on component mount
onMounted(() => {
  if (checkAuthentication()) {
    loadSettings()
  }
})
</script>

<template>
  <div class="alert-settings">
    <!-- Loading Overlay -->
    <div
      v-if="appStore.showProgressCircular"
      class="loading-overlay"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

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

    <!-- Settings Form -->
    <VRow>
      <VCol cols="12">
        <VCard class="pa-6">
          <VForm v-model="isFormValid">
            <VRow>
              <!-- First Alert Time Field -->
              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">First Alert Time</span>
                  <span class="text-error ms-1">*</span>
                </div>
                <VTextField
                  v-model="alertSettings.firstAlertTime"
                  :rules="firstAlertTimeRules"
                  placeholder="Days"
                  variant="outlined"
                  label="Days"
                  density="compact"
                  :disabled="appStore.showProgressCircular"
                />
              </VCol>

              <!-- Second Alert Time Field -->
              <VCol
                cols="12"
                md="6"
              >
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
                  :disabled="appStore.showProgressCircular"
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
                  :disabled="appStore.showProgressCircular"
                  class="msisdn-textarea"
                />
              </VCol>

              <!-- Save Button -->
              <VCol cols="12">
                <VBtn
                  color="error"
                  :disabled="!isFormValid || appStore.showProgressCircular"
                  :loading="appStore.showProgressCircular"
                  @click="showConfirmDialog"
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* MSISDN Textarea Styling */
.msisdn-textarea :deep(.v-field__input) {
  font-family: "Courier New", monospace;
  font-size: 14px;
}
</style>
