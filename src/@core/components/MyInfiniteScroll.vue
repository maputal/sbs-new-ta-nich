<template>
  <div
    ref="scrollContainer"
    style="overflow-y: auto; max-height: 56vh;"
    @scroll="handleScroll"
  >
    <slot :items="items"></slot>

    <!-- Loading indicator -->
    <div v-if="loading" class="text-center py-4">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <!-- End message -->
    <div v-if="!loading && !hasMore" class="text-center py-4 text-grey">
      No more data
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: true }
})

const emit = defineEmits(['load-more'])

const scrollContainer = ref(null)

function handleScroll() {
  if (!scrollContainer.value) return

  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  // console.log('scrollTop=', scrollTop)
  // console.log('scrollHeight=', scrollHeight)
  // console.log('clientHeight=', clientHeight)

  // Trigger load when near bottom
  if (scrollHeight > clientHeight) {
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (!props.loading && props.hasMore) {
        emit('load-more')
      }
    }
  }
}
</script>