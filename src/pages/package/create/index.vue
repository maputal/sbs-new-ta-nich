<script setup>
import { ref, onMounted } from "vue"
import PackageForm from "@/components/package-management/PackageForm.vue"
import CustomConfirmDialog from "@/components/CustomConfirmDialog.vue"
import CustomNotifDialog from "@/components/CustomNotifDialog.vue"

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

// Dialog states
const isSuccessDialogVisible = ref(false)
const isErrorDialogVisible = ref(false)
const isConfirmDialogVisible = ref(false)

// Error handling
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
  isConfirmDialogVisible.value = true
}

const confirmSubmit = async () => {
  try {
    isSubmitting.value = true

    // TODO: Replace with actual API call
    // await window.moffas.do_request(
    //   'create_package',
    //   packageData.value,
    //   (data) => {
    //     successMessage.value = "Package created successfully!";
    //     isSuccessDialogVisible.value = true;
    //     resetForm();
    //   },
    //   (error) => {
    //     errorMessage.value = error.message || "Failed to create package";
    //     isErrorDialogVisible.value = true;
    //   }
    // );

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    successMessage.value = "Package created successfully!"
    isSuccessDialogVisible.value = true
    resetForm()
  } catch (error) {
    errorMessage.value = error.message || "Failed to create package"
    isErrorDialogVisible.value = true
  } finally {
    isSubmitting.value = false
    isConfirmDialogVisible.value = false
  }
}

// Lifecycle
onMounted(() => {
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
          :is-loading="isSubmitting"
          mode="create"
          @submit="handleSubmit"
          @reset="resetForm"
        />
      </VCol>
    </VRow>

    <!-- Success Dialog -->
    <CustomNotifDialog
      v-model:is-dialog-visible="isSuccessDialogVisible"
      title="Success"
      :message="successMessage"
      dialog-type="success"
    />

    <!-- Error Dialog -->
    <CustomNotifDialog
      v-model:is-dialog-visible="isErrorDialogVisible"
      title="Error"
      :message="errorMessage"
      dialog-type="error"
    />

    <!-- Confirm Dialog -->
    <CustomConfirmDialog
      v-model:is-dialog-visible="isConfirmDialogVisible"
      title="Confirm Package Creation"
      message="Are you sure you want to create this package?"
      @confirm="confirmSubmit"
    />
  </div>
</template>

<style scoped>
.package-management-page {
  padding: 24px;
}
</style>
``
