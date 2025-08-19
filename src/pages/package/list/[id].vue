<script setup>
import PackageForm from "@/components/package-management/PackageForm.vue"
import { useAppStore } from "@/store/app"
import { useGlobalStore } from "@/store/useGlobalStore"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

// Router
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const globalStore = useGlobalStore()

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
const isPageLoading = ref(true)

// Methods
const loadPackageData = async () => {
  try {
    appStore.showLoader()

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
    appStore.hideLoader()
    isPageLoading.value = false

    // TODO: Replace with actual API call
    // const response = await window.moffas.do_request(
    //   'get_package',
    //   { package_id: packageId.value },
    //   (data) => {
    //     packageData.value = { ...data };
    //     initialPackageData.value = { ...data };
    //     appStore.hideLoader();
    //     isPageLoading.value = false;
    //   },
    //   (error) => {
    //     appStore.hideLoader();
    //     appStore.showError(error.message || "Failed to load package data");
    //     isPageLoading.value = false;
    //   }
    // );
  } catch (error) {
    appStore.hideLoader()
    appStore.showError(error.message || "Failed to load package data")
    isPageLoading.value = false
  }
}

const handleSubmit = async formData => {
  appStore.setPopup({
    title: 'Confirm Package Update',
    word: 'Are you sure you want to update this package?',
    action: 'confirm',
    onSucc: () => {
      confirmSubmit()
    },
  })
}

const confirmSubmit = async () => {
  try {
    appStore.showLoader()

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
    //     appStore.hideLoader();
    //     appStore.setPopup({
    //       title: 'Success!',
    //       word: 'Package updated successfully!',
    //       action: 'success',
    //       onSucc: () => {
    //         router.push("/package/list");
    //       },
    //     });
    //   },
    //   (error) => {
    //     appStore.hideLoader();
    //     appStore.showError(error.message || "Failed to update package");
    //   }
    // );

    appStore.hideLoader()
    appStore.setPopup({
      title: 'Success!',
      word: 'Package updated successfully!',
      action: 'success',
      onSucc: () => {
        router.push("/package/list")
      },
    })
  } catch (error) {
    appStore.hideLoader()
    appStore.showError(error.message || "Failed to update package")
  }
}

const handleReset = () => {
  packageData.value = { ...initialPackageData.value }
}

// Authentication check
const checkAuthentication = () => {
  if (!globalStore.token || !globalStore.user) {
    router.push('/')
    
    return false
  }
  
  return true
}

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
  // Check if user is authenticated
  if (!checkAuthentication()) {
    return
  }
  
  if (!packageId.value) {
    appStore.showError("Invalid package ID")
    
    return
  }

  loadPackageData()
})
</script>

<template>
  <div class="edit-package-page">
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
              :is-loading="appStore.showProgressCircular"
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
</style>
