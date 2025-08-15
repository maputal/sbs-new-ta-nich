<script setup>
import { useTheme } from 'vuetify'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import { useAppStore } from '@/store/app'

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
} = useThemeConfig()

const { global } = useTheme()

const appStore = useAppStore()
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const GeneralDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/PopUp.vue'))

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <VDialog
        v-model="appStore.showProgressCircular"
        persistent
      >
        <div class="text-center">
          <VProgressCircular
            color="primary"
            indeterminate
            :size="50"
            :width="10"
          />
        </div>
      </VDialog>

      
      <GeneralDialogs />
      <LazyErrorDialogs
        v-if="appStore.isErrorVisible"
        :custom-error-message="appStore.customErrorMessages"
        :error-type="appStore.errorType"
      />
    </VApp>
  </VLocaleProvider>
</template>
