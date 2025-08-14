<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
const router = useRouter()
const logout = () => {
  router.push('/logout')
}

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)

</script>

<template>
  <div class="px-2">
    {{ userData.name || '' }}
  </div>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 Profile -->
          <VListItem :to="{ name: 'account-settings-profile' }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-account-outline"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>
          <!-- 👉 Logout -->
          <VListItem
            @click="logout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout-variant"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
