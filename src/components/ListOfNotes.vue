<script setup>
defineProps([
  'listOfNotes', 
  'toTimeDMYHM',
  'project',
])

const emits = defineEmits([
  'click',
])

const downloadAttachment = fileId => {
  const baseUrl = window.moffas.config.url
  const downloadUrl = `${baseUrl}/storage/attachment?file_id=${fileId}/download`
  
  window.location.href = downloadUrl
}
</script>

<template>
  <VList>
    <VListItem
      v-for="(activity, index) in listOfNotes"
      :key="index"
      class="pl-0 pb-0"
      min-height="43px"
    >
      <div class="d-flex align-center">
        <VCol
          cols="12"
          class="pa-0"
        > 
          <div
            v-if="activity.changes.status"
            class="d-flex align-center pa-0"
          >
            <VListItemSubtitle class="text-black font-weight-bold">
              Status:
            </VListItemSubtitle>
            <VListItemSubtitle class="no-wrap pl-1">
              {{ activity.changes.status }}
            </VListItemSubtitle>
          </div>
          <div
            v-if="activity.changes.category_ticket"
            class="d-flex align-center pa-0"
          >
            <VListItemSubtitle v-if="project == 'danareksa'" class="text-black font-weight-bold">
              Campaign:
            </VListItemSubtitle>
            <VListItemSubtitle v-else class="text-black font-weight-bold">
              Category Ticket:
            </VListItemSubtitle>
            <VListItemSubtitle class="no-wrap pl-1">
              {{ activity.changes.category_ticket }}
            </VListItemSubtitle>
          </div>
          <div
            v-if="activity.changes.priority"
            class="d-flex align-center pa-0"
          >
            <VListItemSubtitle class="text-black font-weight-bold">
              Priority:
            </VListItemSubtitle>
            <VListItemSubtitle class="no-wrap pl-1">
              {{ activity.changes.priority }}
            </VListItemSubtitle>
          </div>
          <div
            v-if="activity.note.content"
            class="d-flex align-center"
          >
            <VListItemSubtitle class="overflow-visible text-black font-weight-bold">
              Note:
            </VListItemSubtitle>
            <VListItemSubtitle class="no-wrap pl-1">
              {{ activity.note.content }}
            </VListItemSubtitle>
          </div>
          <VListItemSubtitle class="no-wrap text-black text-sm">
            <div v-if="activity.changes.activity">
              {{ activity.changes.activity }} by {{ activity.user_name }} ({{ activity.user_role }}) {{ toTimeDMYHM(activity.created_tstamp) }}
              
            </div>
            <div v-else>
              updated by {{ activity.user_name }} ({{ activity.user_role }}) {{ toTimeDMYHM(activity.created_tstamp) }}
            </div>
          </VListItemSubtitle>
          <VDivider />
        </VCol>
        <!-- <VSpacer />
        <VCol
          v-if="activity.note.attachment"
          cols="3"
        >
          <VBtn
            id="downloadAttachment"
            variant="flat"
            size="x-small"
            class="text-none"
            @click="downloadAttachment(activity.note.attachment.file_id)"
          >
            Download Attachment
          </VBtn>
        </VCol> -->
      </div>
    </VListItem>
  </VList>
</template>

<style lang=scss scoped>
.no-wrap {
  -webkit-line-clamp: unset;
}
</style>