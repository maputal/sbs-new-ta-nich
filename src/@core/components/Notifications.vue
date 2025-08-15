<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { avatarText } from '@core/utils/formatters'

const props = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  badgeProps: {
    type: null,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
  notifDetailData: {
    type: Array,
  },  
  totalUnread: {
    type: Number,
  },
  totalPackageExp: {
    type: Number,
  },
})

const emit = defineEmits(['click:readAllNotifications', 'getData'])

const isMenuOpen = ref(false)

watch(isMenuOpen, val => {
  console.log('val=', val)
  if(val) {
    emit('getData')
  }
})
</script>

<template>
  <VBadge
    :model-value="!!props.badgeProps"
    v-bind="props.badgeProps"    
  >
    <VBtn
      icon
      variant="text"
      color="default"
      size="small"
    >
      <VBadge
        :model-value="!!props.totalUnread"
        :content="totalUnread"
        color="info"
        bordered
        offset-x="1"
        offset-y="1"
      >
        <VIcon
          icon="mdi-bell-outline"
          size="24"
        />
      </VBadge>

      <VMenu
        v-model="isMenuOpen"
        activator="parent"
        width="35%"
        height="90%"
        :location="props.location"
        offset="14px"
      >
        <VCard class="d-flex flex-column">
          <!-- 👉 Header -->
          <VCardItem class="py-3">
            <VCardTitle class="text-base font-weight-bold">
              Expired Packages
            </VCardTitle>
            <div class="text-subtitle-2 text-medium-emphasis">
              Packages expiring or already expired
            </div>

            <template #append>
              <VChip
                color="primary"
                size="small"
              >
                {{ props.totalPackageExp || 0 }} Package
              </VChip>
            </template>
          </VCardItem>

          <VDivider />

          <!-- 👉 Notifications list -->
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VList class="py-0">
              <template
                v-for="notification in props.notifications"
                :key="notification.title"
              >
                <VListItem
                  v-if="notification.title !== 'Expired'"
                  link
                  lines="one"
                  min-height="60px"
                  @click="$emit('click:readAllNotifications', notification.title)"
                  :class="{'custom-bg-secondary font-weight-bold': !notification?.is_read && notification.count > 0}"
                >
                  <!-- Slot: Prepend -->
                  <!-- Handles Avatar: Image, Icon, Text -->
                  <!-- <template #prepend>
                    <VListItemAction start>
                      <VAvatar
                        :color="notification.color || 'primary'"
                        :image="notification.img || undefined"
                        :icon="notification.icon || undefined"
                        size="40"
                        variant="tonal"
                      >
                        <span v-if="notification.text">{{ avatarText(notification.text) }}</span>
                      </VAvatar>
                    </VListItemAction>
                  </template> -->

                  <VListItemTitle class="text-subtitle-2">
                    {{ notification.title }}
                  </VListItemTitle>
                  <VListItemSubtitle class="text-caption">
                    {{ notification.subtitle }}
                  </VListItemSubtitle>

                  <!-- Slot: Append -->
                  <template #append>
                    <small class="whitespace-no-wrap">{{ notification.count }}</small>
                  </template>
                </VListItem>
                <VDivider />
              </template>
            </VList>
          </PerfectScrollbar>

          <!-- 👉 Footer -->
          <VCardText class="notification-section">
            <div
              v-for="notification in props.notifications"
              :key="notification.title"
            >
              <VBtn
                v-if="notification.title === 'Expired'"
                block
                class="text-none"
                style="pointer-events: none;"
              >
                <!-- Packages already expired 10 package -->
                Packages already expired: <b class="px-2">{{ notification.count }} {{ notification.count === 1 ? 'package' : 'packages' }}</b>
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VMenu>
    </VBtn>
  </VBadge>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}
</style>
