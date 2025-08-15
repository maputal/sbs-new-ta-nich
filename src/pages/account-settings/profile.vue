<script setup>
import { useGlobalStore } from '@/store/useGlobalStore';
const store = useGlobalStore()
console.log('store di profile=', store)
const myUser = computed(() => ({
  name: store.user?.name,
  phone_number: store.user?.account_obj.phone_number,
  email: store.user?.account_obj.email ? store.user.account_obj.email : store.user.username,
  company_name: store.user?.company_name,
  role_name: store.user?.role_name,
}))

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref()
const onDataError = (e) => {
  isErrorVisible.value = true
  customErrorMessages.value = e
}
const onLoadOwnInfo = (data) => {}

onMounted(() => {
  let pload = {}
  window.moffas.do_request(
    'getProfile',
    pload,
    onLoadOwnInfo,
    onDataError,
  )
})
</script>

<template>
  <div>
    <!-- erorr dialogs -->
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    >
    </LazyErrorDialogs>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText class="d-flex">
            <VRow>
              <VCol
                md="6"
                cols="12"
              >
                <h4 class="text-center text-h4">Profile Information</h4>
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="myUser.name"
                  label="Name"
                  readonly
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="myUser.phone_number"
                  label="Phone Number"
                  readonly
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="myUser.role_name"
                  label="Role"
                  readonly
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="myUser.email"
                  label="Email"
                  readonly
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="myUser.company_name"
                  label="Company Name"
                  readonly
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
