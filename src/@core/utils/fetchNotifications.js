// composables/useFetchNotifications.js
import { useAppStore } from '@/store/app'

export function useNotificationOperations() {
  const appStore = useAppStore()
  const router = useRouter()

  function dummymoffasdogetPackageExp(op, params, onSuccess, onError) {
    let dummyData = {
      data: [
        {
          "label": "Expired Today",
          "count": 2,
          "link": "listpackage.php?expiry=2",
          "is_read": false,
        },
        {
          "label": "Expires in 1 day",
          "count": 0,
          "link": null,
          "is_read": false,
        },
        {
          "label": "Expires in 2 days",
          "count": 1,
          "link": "listpackage.php?expiry=4",
          "is_read": true,
        },
        {
          "label": "Expired",
          "count": 3,
          "link": "recycling_package.php",
          "is_read": true,
        }
      ],
    }

    setTimeout(() => {
      onSuccess(JSON.stringify(dummyData))
    }, 1000)
  }

  function getPackageExp() {
    console.log('getPackageExp')
    // appStore.showLoader()

    const params = {}

    // dummymoffasdogetPackageExp | window.moffas.do_request
    dummymoffasdogetPackageExp(
      'get_broadcasts',
      params,
      (data) => {
        const response = JSON.parse(data)

        if (response.hasOwnProperty('trace_id')) {
          appStore.hideLoader()
          appStore.showError(response)
          return
        }

        const dataResponse = response.data
        appStore.setNotifications(dataResponse)

        appStore.isMountedNavbarNotifications = false
        appStore.hideLoader()
      },
      (error) => {
        appStore.hideLoader()
        appStore.showError(error)
      }
    )
  }

  function updateIsReadPackageExp(data) {
    // appStore.showLoader()

    const params = {
        label: data
    }

    // dummymoffasdogetPackageExp | window.moffas.do_request
    dummymoffasdogetPackageExp(
      'get_broadcasts',
      params,
      (data) => {
        const response = JSON.parse(data)

        if (response.hasOwnProperty('trace_id')) {
          appStore.hideLoader()
          appStore.showError(response)
          return
        }

        router.push('/support/list')

        appStore.hideLoader()
      },
      (error) => {
        appStore.hideLoader()
        appStore.showError(error)
      }
    )
  }

  return {
    getPackageExp,
    updateIsReadPackageExp
  }
}