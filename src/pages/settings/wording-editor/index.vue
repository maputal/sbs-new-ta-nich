<script setup>
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { onMounted, reactive, ref } from "vue"
import { useRouter } from 'vue-router'

// Stores
const appStore = useAppStore()
const globalStore = useGlobalStore()
const router = useRouter()

const pageTitle = ref("Wording Editor")

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.user || !globalStore.token) {
    router.push('/')
    
    return false
  }
  
  return true
}

// Form data
const wordingData = reactive({
  manualActivateNotification: "",
  failedActivationNotification: "",
  pairedNotification: "",
  fraudNotification: "",
  specialFraudImeiNotification: "",
})

// Form validation
const isFormValid = ref(true) // Always valid since no required fields

// Load current settings on component mount
const loadSettings = () => {
  if (!checkAuthentication()) return
  
  appStore.showLoader()

  const onSuccess = response => {
    if (response.data) {
      wordingData.manualActivateNotification =
        response.data.manual_activate_notification || ""
      wordingData.failedActivationNotification =
        response.data.failed_activation_notification || ""
      wordingData.pairedNotification = response.data.paired_notification || ""
      wordingData.fraudNotification = response.data.fraud_notification || ""
      wordingData.specialFraudImeiNotification =
        response.data.special_fraud_imei_notification || ""
    }
    appStore.hideLoader()
  }

  const onError = error => {
    console.error("Error loading wording settings:", error)
    appStore.showError(error.message || "Failed to load wording settings")
    appStore.hideLoader()
  }

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request("get_wording_settings", {}, onSuccess, onError)
  } else {
    // Mock data for development
    setTimeout(() => {
      wordingData.manualActivateNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum."
      wordingData.failedActivationNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum."
      wordingData.pairedNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum."
      wordingData.fraudNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum."
      wordingData.specialFraudImeiNotification =
        "Lorem ipsum dolor sit amet, consectetur. Felis egestas amet enim risus egestas in orci egestas turpis. Eu vulputate hac amet sit sit. Pharetra commodo ipsum tristique dictum nunc. Faucibus orci ultrices felis tortor vestibulum."
      appStore.hideLoader()
    }, 1000)
  }
}

// Show confirmation popup
const showConfirmDialog = () => {
  if (!checkAuthentication()) return
  
  appStore.setPopup({
    title: 'Confirm Saving Changes',
    word: 'Do you want to proceed with saving the wording settings?',
    action: '2',
    onSucc: saveSettings,
  })
}

// Save settings
const saveSettings = () => {
  appStore.showLoader()

  const onSuccess = response => {
    appStore.hideLoader()
    appStore.setPopup({
      title: 'Success!',
      word: 'Wording settings saved successfully',
      action: 'success',
      onSucc: () => {},
    })
  }

  const onError = error => {
    appStore.hideLoader()
    appStore.showError(error.message || "Failed to save wording settings")
  }

  const params = {
    manual_activate_notification: wordingData.manualActivateNotification,
    failed_activation_notification: wordingData.failedActivationNotification,
    paired_notification: wordingData.pairedNotification,
    fraud_notification: wordingData.fraudNotification,
    special_fraud_imei_notification: wordingData.specialFraudImeiNotification,
  }

  // Replace with actual MOFFAS API call
  if (window.moffas) {
    window.moffas.do_request(
      "save_wording_settings",
      params,
      onSuccess,
      onError,
    )
  } else {
    // Mock success for development
    setTimeout(() => {
      appStore.hideLoader()
      appStore.setPopup({
        title: 'Success!',
        word: 'Wording settings saved successfully',
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
  <div class="wording-editor">
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
    <VRow v-if="appStore.showProgressCircular && !wordingData.manualActivateNotification">
      <VCol
        cols="12"
        class="text-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
          size="48"
        />
        <div class="mt-3">
          Loading wording settings...
        </div>
      </VCol>
    </VRow>

    <!-- Wording Editor Form -->
    <VRow v-else>
      <VCol cols="12">
        <VCard class="pa-6">
          <VForm v-model="isFormValid">
            <VRow>
              <!-- Manual Activate Notification -->
              <VCol
                cols="12"
                class="pb-6"
              >
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">Manual Activate Notification</span>
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.manualActivateNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter manual activate notification text..."
                  :disabled="appStore.showProgressCircular"
                />
              </VCol>

              <!-- Failed Activation Notification -->
              <VCol
                cols="12"
                class="pb-6"
              >
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">Failed Activation Notification</span>
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.failedActivationNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter failed activation notification text..."
                  :disabled="appStore.showProgressCircular"
                />
              </VCol>

              <!-- Paired Notification -->
              <VCol
                cols="12"
                class="pb-6"
              >
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">Paired Notification</span>
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.pairedNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter paired notification text..."
                  :disabled="appStore.showProgressCircular"
                />
              </VCol>

              <!-- Fraud Notification -->
              <VCol
                cols="12"
                class="pb-6"
              >
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">Fraud Notification</span>
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.fraudNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter fraud notification text..."
                  :disabled="appStore.showProgressCircular"
                />
              </VCol>

              <!-- Special Fraud IMEI Notification -->
              <VCol
                cols="12"
                class="pb-6"
              >
                <div class="mb-2">
                  <span class="text-body-2 text-high-emphasis">Special Fraud IMEI Notification</span>
                </div>
                <div class="mb-2">
                  <span class="text-caption text-error">Text</span>
                </div>
                <VTextarea
                  v-model="wordingData.specialFraudImeiNotification"
                  variant="outlined"
                  rows="4"
                  placeholder="Enter special fraud IMEI notification text..."
                  :disabled="appStore.showProgressCircular"
                />
              </VCol>

              <!-- Save Button -->
              <VCol cols="12">
                <VBtn
                  color="error"
                  :disabled="appStore.showProgressCircular"
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
.wording-editor {
  padding: 24px;
  position: relative;
}
</style>
