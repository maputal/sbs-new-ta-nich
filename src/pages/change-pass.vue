<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import globalRequest from '@/plugins/globalRequest';
import { useAppStore } from '@/store/app';

const router = useRouter()

const toDashboard = () => {
  router.replace('/dashboard')
}

const appStore = useAppStore()

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const refVForm = ref()

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  loading.value = false
  appStore.hideLoader()
  appStore.showError(e)
}

const resetForm = () => {
  isCurrentPasswordVisible.value = false
  isNewPasswordVisible.value = false
  isConfirmPasswordVisible.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const onSubmitForm = () => {
  console.log('msk onSubmitForm')
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      if (newPassword.value !== confirmPassword.value) {
        appStore.showError('Password confirmation does not match. Please check and try again.')
    
        return
      }
      
      appStore.setPopup({
        title: 'Change Password',
        word: 'Are you sure you want to change this password?',
        action: 'confirm',
        onSucc: () => {
          submitForm()
        },
      })
  })  
}

const submitForm = () => {
  console.log('submitForm')
  // appStore.showLoader()

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully changed the password',
    action: 'success',
    onSucc: () => {
      resetForm()
      appStore.hideLoader()
    },
  })

  return

  console.log('submitForm')

  appStore.showLoader()

  const params = {
    op: currentPassword.value,
    np: newPassword.value,
    rnp: confirmPassword.value,
  }
  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully changed the password',
        action: 'success',
        onSucc: () => {
          resetForm()
        },
      })

      appStore.hideLoader()
    },
    onDataError
  )
}

</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard >
        <template v-slot:title> Change Password </template>

        <v-divider></v-divider>

        <VForm ref="refVForm" @submit.prevent="onSubmitForm">
          <VCardText>
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Current Password"
                  :rules="[requiredValidator]"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="New Password"
                  :rules="[requiredValidator]"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Confirm New Password"
                  :rules="[requiredValidator]"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <!-- <VCardText>
            <p class="text-base mt-2">
              Password Requirements:
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="mdi-circle"
                    class="me-3"
                  />
                </div>
                <span class="text-subtitle-2">{{ item }}</span>
              </li>
            </ul>
          </VCardText> -->

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4 justify-end">
            <VBtn type="submit">Save changes</VBtn>

            <VBtn
              variant="outlined"
              @click="toDashboard()"
            >
              Cancel
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>