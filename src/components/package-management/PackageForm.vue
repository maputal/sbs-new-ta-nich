<script setup>
import { ref, watch, computed } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "create", // 'create' or 'edit'
    validator: (value) => ["create", "edit"].includes(value),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "submit", "reset"]);

// Local form data
const formData = ref({ ...props.modelValue });

// Form validation
const isFormValid = ref(false);

// Validation rules
const requiredRules = [(v) => !!v || "This field is required"];
const numberRules = [(v) => /^\d+$/.test(v) || "Must be a valid number"];

// Options
const applicableAreas = ref([
  { title: "MC-MSISDN-JASMR", value: "MC-MSISDN-JASMR" },
  { title: "MC-MSISDN-JKT", value: "MC-MSISDN-JKT" },
  { title: "MC-MSISDN-BEMO", value: "MC-MSISDN-BEMO" },
  { title: "MC-GTASAPI", value: "MC-GTASAPI" },
]);

const priorityValues = ref([
  { title: "High", value: "high" },
  { title: "Medium", value: "Medium" },
  { title: "Low", value: "low" },
]);

const bundlingTypes = ref([
  { title: "Discount", value: "DISCOUNT" },
  { title: "Bundle", value: "BUNDLE" },
  { title: "Free Trial", value: "FREE_TRIAL" },
]);

// Computed
const submitButtonText = computed(() => {
  return props.mode === "edit" ? "Update Package" : "Create New Package";
});

const cardTitle = computed(() => {
  return props.mode === "edit" ? "Edit Package" : "New Package";
});

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    formData.value = { ...newValue };
  },
  { deep: true }
);

watch(
  formData,
  (newValue) => {
    emit("update:modelValue", { ...newValue });
  },
  { deep: true }
);

// Methods
const handleSubmit = () => {
  if (validateForm()) {
    emit("submit", { ...formData.value });
  }
};

const handleReset = () => {
  emit("reset");
};

const validateForm = () => {
  return (
    formData.value.packageName &&
    formData.value.packageCode &&
    formData.value.packageLimit &&
    formData.value.packageDuration
  );
};
</script>

<template>
  <VForm v-model="isFormValid" @submit.prevent="handleSubmit">
    <VRow class="mb-4">
      <!-- Package Name -->
      <VCol cols="12" md="12">
        <VTextField
          v-model="formData.packageName"
          label="Package Name"
          :rules="requiredRules"
          density="comfortable"
        />
      </VCol>
    </VRow>

    <VRow>
      <!-- Package Code -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.packageCode"
          label="Package Code"
          :rules="requiredRules"
          aria-required="true"
        />
      </VCol>

      <!-- Package Quota -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.packageLimit"
          label="Package Quota"
          :rules="[...requiredRules, ...numberRules]"
          type="number"
        />
      </VCol>

      <!-- Duration -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.packageDuration"
          label="Duration"
          :rules="requiredRules"
          type="number"
        />
      </VCol>

      <!-- Priority -->
      <VCol cols="12" md="6">
        <VSelect
          v-model="formData.priority"
          label="Priority"
          :items="priorityValues"
          :rules="requiredRules"
          density="comfortable"
        />
      </VCol>

      <!-- Tariff -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.packageTariff"
          label="Package Tariff"
          :rules="numberRules"
          type="number"
        />
      </VCol>

      <!-- Applicable Area -->
      <VCol cols="12" md="6">
        <VSelect
          v-model="formData.applicableArea"
          label="Applicable Area"
          :items="applicableAreas"
          multiple
          chips
        />
      </VCol>

      <!-- Bundling Type -->
      <VCol cols="12" md="6">
        <VSelect
          v-model="formData.bundlingType"
          label="Bundling Type"
          :items="bundlingTypes"
          multiple
          chips
        />
      </VCol>

      <!-- Monogami -->
      <VCol cols="12" md="6">
        <div>
          <label class="text-body-2 font-weight-medium mb-2 d-block"
            >Monogami</label
          >
        </div>
        <VRadioGroup v-model="formData.monogami" inline>
          <VRadio label="Multi-SMS" value="Multi-SMS" />
          <VRadio label="Single-SMS" value="Single-SMS" />
        </VRadioGroup>
      </VCol>

      <!-- Offer Section -->
      <VCol cols="12" md="6">
        <VCheckbox v-model="formData.offer" label="Offer" />
      </VCol>

      <!-- Expiry Date -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.expiry"
          label="Expiry Date"
          type="date"
          clearable
        />
      </VCol>

      <!-- Offer Message -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.offerMessage"
          label="Offer Message"
          :disabled="!formData.offer"
        />
      </VCol>

      <!-- SMS Warning -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.smsWarning"
          label="SMS Warning"
          density="comfortable"
        />
      </VCol>

      <!-- Rejection Message -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.rejectionMessage"
          label="Rejection Message"
          :disabled="!formData.offer"
        />
      </VCol>

      <!-- SMS Terminate -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.smsTerminate"
          label="SMS Terminate"
          density="comfortable"
        />
      </VCol>

      <!-- SMS Keyword -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.smsKeyword"
          label="SMS Keyword"
          :disabled="!formData.offer"
        />
      </VCol>

      <!-- SMS Reactivation -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.smsReactivation"
          label="SMS Reactivation"
          density="comfortable"
        />
      </VCol>

      <!-- Wording Editor -->
      <VCol cols="12" md="6">
        <VCheckbox
          v-model="formData.wordingEditor"
          label="Wording Editor"
        />
      </VCol>

      <!-- Custom Termination Wait Time -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.customTerminationWaitTime"
          label="Custom Termination Wait Time"
          type="datetime-local"
          clearable
        />
      </VCol>

      <!-- Manual Activate Notification -->
      <VCol cols="12">
        <VTextField
          v-model="formData.manualActivationNotification"
          label="Manual Activate Notification"
          density="comfortable"
        />
      </VCol>

      <!-- Failed Activate Notification -->
      <VCol cols="12">
        <VTextField
          v-model="formData.failedActivationNotification"
          label="Failed Activate Notification"
          density="comfortable"
        />
      </VCol>

      <!-- Paired Notification -->
      <VCol cols="12">
        <VTextField
          v-model="formData.pairedNotification"
          label="Paired Notification"
          density="comfortable"
        />
      </VCol>

      <!-- Fraud Activate Notification -->
      <VCol cols="12">
        <VTextField
          v-model="formData.fraudNotification"
          label="Fraud Activate Notification"
          density="comfortable"
        />
      </VCol>

      <!-- Special Fraud IMEI Notification -->
      <VCol cols="12">
        <VTextField
          v-model="formData.specialFraudIMEINotification"
          label="Special Fraud IMEI Notification"
          density="comfortable"
        />
      </VCol>
    </VRow>

    <!-- Action Buttons -->
    <VRow class="mt-4">
      <VCol cols="12" class="d-flex justify-end gap-4">
        <VBtn variant="outlined" color="secondary" @click="handleReset">
          Reset
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          :loading="isLoading"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ submitButtonText }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style scoped>
/* Add any specific styles if needed */
</style>
