<script setup>
import { useGlobalStore } from '@/store/useGlobalStore'
const store = useGlobalStore()

const myUser = computed(() => ({
  name: store.user?.name,
  email: store.user?.account_obj.email ? store.user.account_obj.email : store.user.username,
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
  window.moffas.do_request('getProfile', pload, onLoadOwnInfo, onDataError)
})
</script>

<template>
  <div>
    <!-- error dialogs -->
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible"
      :custom-error-message="customErrorMessages"
    />

    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <VRow>
              <!-- Judul agak geser kanan -->
              <VCol cols="12" md="6">
                <h4 class="text-h4" style="padding-left: 150px">Profile Information</h4>
              </VCol>


              <!-- Kolom kanan: form -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="myUser.name"
                  label="Name"
                  readonly
                  class="mb-4"
                />
                <VTextField
                  v-model="myUser.role_name"
                  label="Role"
                  readonly
                  class="mb-4"
                />
                <VTextField
                  v-model="myUser.email"
                  label="Email"
                  readonly
                  class="mb-4"
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
