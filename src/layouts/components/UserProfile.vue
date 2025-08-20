<script setup>
import { useGlobalStore } from '@/store/useGlobalStore';
import avatar1 from '@images/avatars/avatar-1.png';

const router = useRouter()
const logout = () => {
  router.push('/logout')
}
const toChangePass = () => {
  router.push('/change-pass')
}

const userName = sessionStorage.getItem('username')

const store = useGlobalStore()
console.log('store di profile=', store)
const myUser = computed(() => ({
  // name: store.user?.name || '',
  name: userName ? userName : '',
  role_name: store.user?.role_name || '',
}))

const userGuideLines = () => {
  window.open(
    'http://178.128.52.242:8080/securebundling/SecureBundlingSystemPrivilege.pdf',
    '_blank'
  )
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />
    </VAvatar>
  </VBadge>

  <VList style="background: none;">
    <VListItem
    >
      <VListItemTitle class="font-weight-bold">{{ myUser.name }}</VListItemTitle>
      <VListItemSubtitle class="text-caption">{{ myUser.role_name }}</VListItemSubtitle>

      <template v-slot:append>
        <VBtn
          icon="mdi-menu-down"
          size="small"
          variant="text"
        ></VBtn>        

        <!-- SECTION Menu -->
        <VMenu
          activator="parent"
          width="230"
          location="bottom end"
          offset="14px"
        >
          <VList>
            <!-- 👉 Change Password -->
             <!-- :to="{ name: 'change-pass' }" -->
            <VListItem @click="toChangePass" >
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="mdi-lock"
                  size="22"
                />
              </template>

              <VListItemTitle>Change Password</VListItemTitle>
            </VListItem>

            <!-- 👉 User Guide -->
            <VListItem 
              link
              @click="userGuideLines"
            >
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="mdi-file-account"
                  size="22"
                />
              </template>

              <VListItemTitle>User Guide</VListItemTitle>
            </VListItem>

            <!-- 👉 Profile -->
            <!-- <VListItem :to="{ name: 'account-settings-profile' }">
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="mdi-account-outline"
                  size="22"
                />
              </template>

              <VListItemTitle>Profile</VListItemTitle>
            </VListItem> -->

            <!-- Divider -->
            <VDivider class="my-2" />

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
      </template>
    </VListItem>
  </VList>
</template>
