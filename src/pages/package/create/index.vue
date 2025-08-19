<script setup>
import PackageForm from "@/components/package-management/PackageForm.vue"
import { useAppStore } from "@/store/app"
import { useGlobalStore } from "@/store/useGlobalStore"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const appStore = useAppStore()
const globalStore = useGlobalStore()

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
  appStore.setPopup({
    title: 'Confirm Package Creation',
    word: 'Are you sure you want to create this package?',
    action: 'confirm',
    onSucc: () => {
      confirmSubmit()
    },
  })
}

const confirmSubmit = async () => {
  try {
    appStore.showLoader()

    // TODO: Replace with actual API call
    // await window.moffas.do_request(
    //   'create_package',
    //   packageData.value,
    //   (data) => {
    //     appStore.hideLoader()
    //     appStore.setPopup({
    //       title: 'Success!',
    //       word: 'Package created successfully!',
    //       action: 'success',
    //       onSucc: () => {
    //         resetForm()
    //       },
    //     })
    //   },
    //   (error) => {
    //     appStore.hideLoader()
    //     appStore.showError(error.message || "Failed to create package")
    //   }
    // );

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    appStore.hideLoader()
    appStore.setPopup({
      title: 'Success!',
      word: 'Package created successfully!',
      action: 'success',
      onSucc: () => {
        resetForm()
      },
    })
  } catch (error) {
    appStore.hideLoader()
    appStore.showError(error.message || "Failed to create package")
  }
}

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.token || !globalStore.user) {
    router.push('/')
    
    return false
  }
  
  return true
}

// Lifecycle
onMounted(() => {
  // Check if user is authenticated
  if (!checkAuthentication()) {
    return
  }
  
  // Load initial data if needed
})
</script>

<template>
  <div class="package-management-page">
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
          :is-loading="appStore.showProgressCircular"
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
</style>
``
