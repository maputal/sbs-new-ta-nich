<script setup lang="ts">
import ListUploader from '@/components/package-management/ListUploader.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const packageId = route.params.id

console.log('Package ID: ', packageId)

const fetchTac = () => {

}

const exportTac = () => {

}

const deleteTac = () => {

}

const uploadTac = () => {
  router.push(`/package/list/tac/upload/${packageId}`)
}

const goBack = id => {
  router.push(`/package/list/${id}`)
}

const pageTitle = ref("List Package")
const pageSubtitle = ref("Indosat Secure Bundling System")
</script>

<template>
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

  <VCard>
    <VCardTitle>
      <div class="d-flex justify-space-between align-center mt-2 mb-2">
        <VBtn
          variant="flat"
          icon="mdi-arrow-left"
          color="#f0f0f0"
          size="small"
          @click="goBack(packageId)"
        />
        <h4 class="text-h5 font-weight-bold mb-2">
          List TAC
        </h4>
      </div>    
    </VCardTitle>
    <VDivider />

    <VCardText>
      <ListUploader
        type="tac"
        :fetch-function="fetchTac"
        :delete-function="deleteTac"
        :export-function="exportTac"
        :upload-function="uploadTac"
      />
    </VCardText>
  </VCard>
</template>

