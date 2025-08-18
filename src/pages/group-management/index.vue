<script setup>
import { useNotificationOperations } from '@/@core/utils/fetchNotifications';
import CustomDialogGroup from '@/components/group-management/CustomDialogGroup.vue';
import CustomDialogPackageGroup from '@/components/group-management/CustomDialogPackageGroup.vue';
import globalRequest from '@/plugins/globalRequest';
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const { getPackageExp } = useNotificationOperations()

const route = useRoute()
const router = useRouter()

// =============================================== meta data  

const compareTimeStamp = epochMillis => {
  const dateFromEpoch = new Date(epochMillis * 1000)
  const today = new Date()

  return (
    dateFromEpoch.getDate() !== today.getDate() ||
    dateFromEpoch.getMonth() !== today.getMonth() ||
    dateFromEpoch.getFullYear() !== today.getFullYear()
  )
}

const onDataError = (e) => {
  console.log('masuk error di onDataError', e)
  loading.value = false
  appStore.hideLoader()
  appStore.showError(e)
}

// =============================================== group section
const itemGroups = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const totalPagesGroup = ref(1)
const rowLength = ref(10)

const showDialogGroup = ref(false)
const titleDialogGroup = ref('')

const searchGroup = ref('')
const hovered = ref(null)
const selectedGroup = ref([])

const editAddGroupData = ref({
  groupID: '',
  groupName: '',
  newPackageGroup: [],
})

const setGroupData = (data) => {
  editAddGroupData.value.groupID = data.group_id
  editAddGroupData.value.groupName = data.group_name
}

const resetGroupData = () => {
  editAddGroupData.value.groupID = ''
  editAddGroupData.value.groupName = ''
  editAddGroupData.value.newPackageGroup = []
}

const chooseDialogGroup = (typeDo, data) => {
  if(typeDo == 'create'){
    titleDialogGroup.value = 'Add New Group'
  } else if(typeDo == 'update'){
    titleDialogGroup.value = 'Edit Group'
    setGroupData(data)
  }
  showDialogGroup.value = true
}


function dummymoffasdogetGroupList(type, op, params, onSuccess, onError) {
  let dummyData = {
    data: [
      {
        "group_id": 1,
        "group_name": 'Group Lisa',
      },
      {
        "group_id": 2,
        "group_name": 'Group Justin',
      },
      {
        "group_id": 3,
        "group_name": 'Group Bagas',
      },
      {
        "group_id": 4,
        "group_name": 'Group David nih boss senggol dong brooo',
      },
      {
        "group_id": 5,
        "group_name": 'Group David2',
      },
      {
        "group_id": 6,
        "group_name": 'Group David3',
      },
      {
        "group_id": 7,
        "group_name": 'Group David4',
      },
      {
        "group_id": 8,
        "group_name": 'Group David5',
      },
      {
        "group_id": 9,
        "group_name": 'Group David6',
      },
      {
        "group_id": 10,
        "group_name": 'Group David7',
      },
    ],
    total_data: 50,
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}

const getGroupList = () => {
  console.log('Code getGroupList!')
  loading.value = true

  // appStore.showLoader()

  const params = {
    row_length: rowLength.value,
    page_number: page.value,
    search: searchGroup.value || '',
  }

  // dummymoffasdogetGroupList | globalRequest
  dummymoffasdogetGroupList(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      const newItems = response.data
      totalPagesGroup.value = Math.ceil(response.total_data / Number(rowLength.value))

      // Kalau halaman berikutnya kosong, berarti data habis
      if (!newItems.length || page.value >= totalPagesGroup.value) {
        hasMore.value = false
      } else {
        itemGroups.value.push(...newItems)
        page.value++
      }

      loading.value = false

      appStore.hideLoader()
    },
    onDataError
  )
}

const createGroup = () => {
  console.log('Edit', editAddGroupData.value)

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully added the group',
    action: 'success',
    onSucc: () => {
      resetGroupData()
      appStore.hideLoader()
    },
  })

  return

  console.log('Code createGroup!')
  appStore.showLoader()

  const params = {
    group_name: editAddGroupData.value.groupName,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully added the group',
        action: 'success',
        onSucc: () => {
          resetGroupData()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

const editGroup = () => {
  console.log('Edit', editAddGroupData.value)

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully edited the group',
    action: 'success',
    onSucc: () => {
      resetGroupData()
      appStore.hideLoader()
    },
  })

  return

  console.log('Code editGroup!')
  appStore.showLoader()

  const params = {
    group_id: editAddGroupData.value.groupID,
    group_name: editAddGroupData.value.groupName,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully edited the group',
        action: 'success',
        onSucc: () => {
          resetGroupData()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

const deleteGroup = () => {
  console.log('Delete', editAddGroupData.value)

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully deleted the group',
    action: 'success',
    onSucc: () => {
      getGroupList()
      appStore.hideLoader()
    },
  })

  return

  console.log('Code deleteGroup!')
  appStore.showLoader()

  const params = {
    group_id: editAddGroupData.value.groupID,
    group_name: editAddGroupData.value.groupName,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully deleted the group',
        action: 'success',
        onSucc: () => {
          getGroupList()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}


// 👉 Fetch GroupList
// watch(getGroupList)

// =============================================== package section
const tableHeader = ref(['Package Name'])
const tableData = ref([])
const totalPage = ref(1)
const totalRow = ref(0)

const checkedRows = ref([])

const rowPerPagePackage = ref(10)
const currentPagePackage = ref(1)
const selectedRows = ref([])

const toggleSelectAll = (isChecked) => {
  if (isChecked) {
    checkedRows.value = tableData.value.map(row => row.package_id)
  } else {
    checkedRows.value = []
  }
}

const resetPackageGroup = () => {
  tableData.value = [] 
  totalPage.value = 1
  totalRow.value = 0
}

const showDialogPackage = ref(false)
const titleDialogPackage = ref('')

const packageList = ref([])

const chooseDialogPackage = () => {
  setGroupData(selectedGroup.value[0])
  getAllPackage()

  // localStorage.setItem('current_group', JSON.stringify(selectedGroup.value[0]))
  // router.push('/group-management/add-package-group/' + selectedGroup.value[0].group_id)
}

function dummymoffasdogetPackageGroup(type, op, params, onSuccess, onError) {
  let dummyData = {
    data: [
      { package_id: 1, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 2, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 3, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 4, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 5, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 6, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 7, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 8, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 9, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 10, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
      { package_id: 11, package_name: "Paket StreamMax", msisdn: "6285860653530" },
      { package_id: 12, package_name: "Paket Hiburan Komplit", msisdn: "628156539098" },
    ],
    total_pages: 2,
    total_rows: 20,
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}

const toggleChoosingGroup  = () => {
  if(!selectedGroup.value.length){
    resetPackageGroup()
    return
  } else {
    getPackageGroup()
  }
}

const getPackageGroup = () => {
  console.log('Code getPackageGroup!')

  appStore.showLoader()

  const params = {
    row_length: rowPerPagePackage.value,
    page_number: currentPagePackage.value,
    group_id: selectedGroup.value[0],
  }

  // dummymoffasdogetPackageGroup | taSecure_POST
  dummymoffasdogetPackageGroup(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      tableData.value = response.data   
      totalPage.value = response.total_pages
      totalRow.value = response.total_rows

      appStore.hideLoader()
    },
    onDataError
  )
}

const addPackageGroup = () => {
  console.log('Edit', editAddGroupData.value)

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully added this package to the group',
    action: 'success',
    onSucc: () => {
      showDialogPackage.value = false
      resetGroupData()
      getPackageGroup()
      appStore.hideLoader()
    },
  })

  return

  console.log('Code addPackageGroup!')
  appStore.showLoader()

  const params = {
    group_id: editAddGroupData.value.groupID,
    group_name: editAddGroupData.value.groupName,
    package: editAddGroupData.value.newPackageGroup,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully added this package to the group',
        action: 'success',
        onSucc: () => {
          showDialogPackage.value = false
          resetGroupData()
          getPackageGroup()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

const deletePackageGroup = () => {
  // group_id & package_id nya yang mana nih
  // group_id: selectedGroup.value[0]
  // checkedRows.value

  console.log('editAddGroupData', editAddGroupData.value)
  console.log('deletePackageGroup', checkedRows.value)

  appStore.setPopup({
    title: 'Success!',
    word: 'You’ve successfully deleted this package to the group',
    action: 'success',
    onSucc: () => {
      checkedRows.value = []
      getPackageGroup()
      appStore.hideLoader()
    },
  })

  return

  console.log('Code addPackageGroup!')
  appStore.showLoader()

  const params = {
    group_id: editAddGroupData.value.groupID,
    group_name: editAddGroupData.value.groupName,
    package: checkedRows.value,
  }

  globalRequest(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        loading.value = false
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      appStore.hideLoader()      

      appStore.setPopup({
        title: 'Success!',
        word: 'You’ve successfully added this package to the group',
        action: 'success',
        onSucc: () => {
          checkedRows.value = []
          getPackageGroup()
          appStore.hideLoader()
        },
      })
    },
    onDataError
  )
}

function dummymoffasdogetAllPackage(tyep, op, params, onSuccess, onError) {
  let dummyData = {
    data: [
      {"package_id": 1, "package_name": "Paket Dummy 1", "msisdn": "6289123456001"},
      {"package_id": 2, "package_name": "Paket Dummy 2", "msisdn": "6289123456002"},
      {"package_id": 3, "package_name": "Paket Dummy 3", "msisdn": "6289123456003"},
      {"package_id": 4, "package_name": "Paket Dummy 4", "msisdn": "6289123456004"},
      {"package_id": 5, "package_name": "Paket Dummy 5", "msisdn": "6289123456005"},
      {"package_id": 6, "package_name": "Paket Dummy 6", "msisdn": "6289123456006"},
      {"package_id": 7, "package_name": "Paket Dummy 7", "msisdn": "6289123456007"},
      {"package_id": 8, "package_name": "Paket Dummy 8", "msisdn": "6289123456008"},
      {"package_id": 9, "package_name": "Paket Dummy 9", "msisdn": "6289123456009"},
      {"package_id": 10, "package_name": "Paket Dummy 10", "msisdn": "6289123456010"},
      {"package_id": 11, "package_name": "Paket Dummy 11", "msisdn": "6289123456011"},
      {"package_id": 12, "package_name": "Paket Dummy 12", "msisdn": "6289123456012"},
      {"package_id": 13, "package_name": "Paket Dummy 13", "msisdn": "6289123456013"},
      {"package_id": 14, "package_name": "Paket Dummy 14", "msisdn": "6289123456014"},
      {"package_id": 15, "package_name": "Paket Dummy 15", "msisdn": "6289123456015"},
      {"package_id": 16, "package_name": "Paket Dummy 16", "msisdn": "6289123456016"},
      {"package_id": 17, "package_name": "Paket Dummy 17", "msisdn": "6289123456017"},
      {"package_id": 18, "package_name": "Paket Dummy 18", "msisdn": "6289123456018"},
      {"package_id": 19, "package_name": "Paket Dummy 19", "msisdn": "6289123456019"},
      {"package_id": 20, "package_name": "Paket Dummy 20", "msisdn": "6289123456020"},
      {"package_id": 21, "package_name": "Paket Dummy 21", "msisdn": "6289123456021"},
      {"package_id": 22, "package_name": "Paket Dummy 22", "msisdn": "6289123456022"},
      {"package_id": 23, "package_name": "Paket Dummy 23", "msisdn": "6289123456023"},
      {"package_id": 24, "package_name": "Paket Dummy 24", "msisdn": "6289123456024"},
      {"package_id": 25, "package_name": "Paket Dummy 25", "msisdn": "6289123456025"},
      {"package_id": 26, "package_name": "Paket Dummy 26", "msisdn": "6289123456026"},
      {"package_id": 27, "package_name": "Paket Dummy 27", "msisdn": "6289123456027"},
      {"package_id": 28, "package_name": "Paket Dummy 28", "msisdn": "6289123456028"},
      {"package_id": 29, "package_name": "Paket Dummy 29", "msisdn": "6289123456029"},
      {"package_id": 30, "package_name": "Paket Dummy 30", "msisdn": "6289123456030"},
      {"package_id": 31, "package_name": "Paket Dummy 31", "msisdn": "6289123456031"},
      {"package_id": 32, "package_name": "Paket Dummy 32", "msisdn": "6289123456032"},
      {"package_id": 33, "package_name": "Paket Dummy 33", "msisdn": "6289123456033"},
      {"package_id": 34, "package_name": "Paket Dummy 34", "msisdn": "6289123456034"},
      {"package_id": 35, "package_name": "Paket Dummy 35", "msisdn": "6289123456035"},
      {"package_id": 36, "package_name": "Paket Dummy 36", "msisdn": "6289123456036"},
      {"package_id": 37, "package_name": "Paket Dummy 37", "msisdn": "6289123456037"},
      {"package_id": 38, "package_name": "Paket Dummy 38", "msisdn": "6289123456038"},
      {"package_id": 39, "package_name": "Paket Dummy 39", "msisdn": "6289123456039"},
      {"package_id": 40, "package_name": "Paket Dummy 40", "msisdn": "6289123456040"},
      {"package_id": 41, "package_name": "Paket Dummy 41", "msisdn": "6289123456041"},
      {"package_id": 42, "package_name": "Paket Dummy 42", "msisdn": "6289123456042"},
      {"package_id": 43, "package_name": "Paket Dummy 43", "msisdn": "6289123456043"},
      {"package_id": 44, "package_name": "Paket Dummy 44", "msisdn": "6289123456044"},
      {"package_id": 45, "package_name": "Paket Dummy 45", "msisdn": "6289123456045"},
      {"package_id": 46, "package_name": "Paket Dummy 46", "msisdn": "6289123456046"},
      {"package_id": 47, "package_name": "Paket Dummy 47", "msisdn": "6289123456047"},
      {"package_id": 48, "package_name": "Paket Dummy 48", "msisdn": "6289123456048"},
      {"package_id": 49, "package_name": "Paket Dummy 49", "msisdn": "6289123456049"},
      {"package_id": 50, "package_name": "Paket Dummy 50", "msisdn": "6289123456050"},
      {"package_id": 51, "package_name": "Paket Dummy 51", "msisdn": "6289123456051"},
      {"package_id": 52, "package_name": "Paket Dummy 52", "msisdn": "6289123456052"},
      {"package_id": 53, "package_name": "Paket Dummy 53", "msisdn": "6289123456053"},
      {"package_id": 54, "package_name": "Paket Dummy 54", "msisdn": "6289123456054"},
      {"package_id": 55, "package_name": "Paket Dummy 55", "msisdn": "6289123456055"},
      {"package_id": 56, "package_name": "Paket Dummy 56", "msisdn": "6289123456056"},
      {"package_id": 57, "package_name": "Paket Dummy 57", "msisdn": "6289123456057"},
      {"package_id": 58, "package_name": "Paket Dummy 58", "msisdn": "6289123456058"},
      {"package_id": 59, "package_name": "Paket Dummy 59", "msisdn": "6289123456059"},
      {"package_id": 60, "package_name": "Paket Dummy 60", "msisdn": "6289123456060"},
      {"package_id": 61, "package_name": "Paket Dummy 61", "msisdn": "6289123456061"},
      {"package_id": 62, "package_name": "Paket Dummy 62", "msisdn": "6289123456062"},
      {"package_id": 63, "package_name": "Paket Dummy 63", "msisdn": "6289123456063"},
      {"package_id": 64, "package_name": "Paket Dummy 64", "msisdn": "6289123456064"},
      {"package_id": 65, "package_name": "Paket Dummy 65", "msisdn": "6289123456065"},
      {"package_id": 66, "package_name": "Paket Dummy 66", "msisdn": "6289123456066"},
      {"package_id": 67, "package_name": "Paket Dummy 67", "msisdn": "6289123456067"},
      {"package_id": 68, "package_name": "Paket Dummy 68", "msisdn": "6289123456068"},
      {"package_id": 69, "package_name": "Paket Dummy 69", "msisdn": "6289123456069"},
      {"package_id": 70, "package_name": "Paket Dummy 70", "msisdn": "6289123456070"},
      {"package_id": 71, "package_name": "Paket Dummy 71", "msisdn": "6289123456071"},
      {"package_id": 72, "package_name": "Paket Dummy 72", "msisdn": "6289123456072"},
      {"package_id": 73, "package_name": "Paket Dummy 73", "msisdn": "6289123456073"},
      {"package_id": 74, "package_name": "Paket Dummy 74", "msisdn": "6289123456074"},
      {"package_id": 75, "package_name": "Paket Dummy 75", "msisdn": "6289123456075"},
      {"package_id": 76, "package_name": "Paket Dummy 76", "msisdn": "6289123456076"},
      {"package_id": 77, "package_name": "Paket Dummy 77", "msisdn": "6289123456077"},
      {"package_id": 78, "package_name": "Paket Dummy 78", "msisdn": "6289123456078"},
      {"package_id": 79, "package_name": "Paket Dummy 79", "msisdn": "6289123456079"},
      {"package_id": 80, "package_name": "Paket Dummy 80", "msisdn": "6289123456080"},
      {"package_id": 81, "package_name": "Paket Dummy 81", "msisdn": "6289123456081"},
      {"package_id": 82, "package_name": "Paket Dummy 82", "msisdn": "6289123456082"},
      {"package_id": 83, "package_name": "Paket Dummy 83", "msisdn": "6289123456083"},
      {"package_id": 84, "package_name": "Paket Dummy 84", "msisdn": "6289123456084"},
      {"package_id": 85, "package_name": "Paket Dummy 85", "msisdn": "6289123456085"},
      {"package_id": 86, "package_name": "Paket Dummy 86", "msisdn": "6289123456086"},
      {"package_id": 87, "package_name": "Paket Dummy 87", "msisdn": "6289123456087"},
      {"package_id": 88, "package_name": "Paket Dummy 88", "msisdn": "6289123456088"},
      {"package_id": 89, "package_name": "Paket Dummy 89", "msisdn": "6289123456089"},
      {"package_id": 90, "package_name": "Paket Dummy 90", "msisdn": "6289123456090"},
      {"package_id": 91, "package_name": "Paket Dummy 91", "msisdn": "6289123456091"},
      {"package_id": 92, "package_name": "Paket Dummy 92", "msisdn": "6289123456092"},
      {"package_id": 93, "package_name": "Paket Dummy 93", "msisdn": "6289123456093"},
      {"package_id": 94, "package_name": "Paket Dummy 94", "msisdn": "6289123456094"},
      {"package_id": 95, "package_name": "Paket Dummy 95", "msisdn": "6289123456095"},
      {"package_id": 96, "package_name": "Paket Dummy 96", "msisdn": "6289123456096"},
      {"package_id": 97, "package_name": "Paket Dummy 97", "msisdn": "6289123456097"},
      {"package_id": 98, "package_name": "Paket Dummy 98", "msisdn": "6289123456098"},
      {"package_id": 99, "package_name": "Paket Dummy 99", "msisdn": "6289123456099"},
      {"package_id": 100, "package_name": "Paket Dummy 100", "msisdn": "6289123456100"}
    ],
    total_pages: 2,
    total_rows: 20,
  }

  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData))
  }, 1000)
}

const getAllPackage = () => {
  console.log('Code getAllPackage!')

  appStore.showLoader()

  const params = {
    // row_length: rowPerPagePackage.value,
    // page_number: currentPagePackage.value,
  }

  // dummymoffasdogetAllPackage | taSecure_POST
  dummymoffasdogetAllPackage(
    'taSecure_POST',
    'get_broadcasts',
    params,
    (data) => {
      const response = JSON.parse(data)

      if (response.hasOwnProperty('trace_id')) {
        appStore.hideLoader()
        appStore.showError(response)
        return
      }

      packageList.value = response.data  
      appStore.hideLoader()      

      titleDialogPackage.value = 'Add Package Group'
      showDialogPackage.value = true
    },
    onDataError
  )
}

// 👉 Watch currentPagePackage
watchEffect(() => {
  console.log('masuk Watch currentPagePackage')
  if (currentPagePackage.value > totalPage.value && totalPage.value > 0)
    currentPagePackage.value = totalPage.value
})

// 👉 Computing pagination data
const numberTable = ref(0)

const paginationData = computed(() => {
  const firstIndex = tableData.value.length > 0 ? (currentPagePackage.value - 1) * rowPerPagePackage.value + 1 : 0
  const lastIndex = tableData.value.length + (currentPagePackage.value - 1) * rowPerPagePackage.value
  
  numberTable.value = firstIndex  

  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRow.value } entries`
})

// =============================================== User interaction
const isLeftSidebarOpen = ref(true)

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

const filter = ref({
  search: '',
})

const confirmDialogProps = ref({
  // confirmationStyling: '',
  // messageTitle: '',
  op: '',
})

const chooseConfirmPopup = (data) => {
  if(confirmDialogProps.value.op == 'create group'){
    appStore.setPopup({
      title: 'Add Group',
      word: 'Are you sure you want to add this group?',
      action: 'confirm',
      onSucc: () => {
        showDialogGroup.value = false
        createGroup()
      },
    })
  } else if(confirmDialogProps.value.op == 'edit group'){
    appStore.setPopup({
      title: 'Edit Group',
      word: 'Are you sure you want to edit this group?',
      action: 'confirm',
      onSucc: () => {
        showDialogGroup.value = false
        editGroup()
      },
    })
  } else if(confirmDialogProps.value.op == 'delete group') {
    appStore.setPopup({
      title: 'Delete Group',
      word: 'Are you sure you want to delete this group?',
      action: 'confirm',
      onSucc: () => {
        editAddGroupData.value.groupID = data.group_id
        deleteGroup()
      },
    })
  } else if(confirmDialogProps.value.op == 'remove package'){
    setGroupData(selectedGroup.value[0])

    appStore.setPopup({
      title: 'Remove Package Group',
      word: 'Are you sure you want to remove this package?',
      action: 'confirm',
      onSucc: () => {
        deletePackageGroup()
      },
    })
  } else if(confirmDialogProps.value.op == 'add package'){
    console.log('editAddGroupData.value=', editAddGroupData.value)
    appStore.setPopup({
      title: 'Add Package Group',
      word: 'Are you sure you want to add this package?',
      action: 'confirm',
      onSucc: () => {
        // showDialogPackage.value = false
        addPackageGroup()
      },
    })
  }
}

// =============================================== On Life Cycle Event
const interval = ref(null)

onMounted(() => {
  console.log('mounted group')

  if(appStore.isMountedNavbarNotifications == false){
    getPackageExp()
  }

  getGroupList()
})

onUnmounted (() => {
  clearInterval(interval.value)
})

onBeforeRouteLeave ((to, from) => {
  if(to.name != 'group-management-add-package-group-id'){
    if (localStorage.getItem('current_group')) {
      localStorage.removeItem('current_group')       
    }
  }
})
</script>

<template>
  <section>
    <!-- <LazyErrorDialogs
      v-if="isError"
      v-model:isDialogVisible="isError" 
      :custom-error-message="errorMessage"
    /> -->

    <div>
      <h6 class="text-h5 font-weight-bold mb-4">
        Group
      </h6>
      <!-- <p class="text-subtitle-1 mb-2 font-weight-medium">
        Secure Bundling System
      </p> -->
    </div>

    <div class="full-height-container">
      <VCard class="full-height-card">
        <VLayout class="full-height-layout">
          <VNavigationDrawer
            v-model="isLeftSidebarOpen"
            absolute
            touchless
            location="start"
            width="350"
            class="chat-list-sidebar d-flex flex-column"
            :permanent="$vuetify.display.mdAndUp"
            :temporary="$vuetify.display.smAndDown"
          >
            <VCardActions class="pt-2 pb-0"> 
              <h3 class="font-weight-bold">
                Group List
              </h3>
              <VSpacer />
              <VBtn 
                class="my-1"
                variant="flat"
                size="small"
                icon="mdi-plus"
                @click="chooseDialogGroup('create')"
              />
              <VBtn
                v-if="$vuetify.display.smAndDown"
                variant="text"
                color="default"
                icon
                size="small"
                @click="isLeftSidebarOpen = false"
              >
                <VIcon
                  size="24"
                  icon="mdi-close"
                  class="text-medium-emphasis"
                />
              </VBtn>
            </VCardActions>
    
            <VDivider />
    
            <!-- Search -->
            <VTextField
              v-model="searchGroup"
              placeholder="Search for Group List"
              prepend-inner-icon="mdi-magnify"
              class="pa-3"
              variant="solo"
              clearable
              focused
              density="compact"
              @keydown.enter.prevent 
              @keyup.enter="filter.search = searchGroup"
            />
    
            <!-- List -->
            <MyInfiniteScroll
              :items="itemGroups"
              :loading="loading"
              :hasMore="hasMore"
              @load-more="getGroupList"
              class="flex-grow-1"
            >
              <template #default="{ items }">
                <VList v-model:selected="selectedGroup" @click="toggleChoosingGroup">
                  <VListItem
                    v-for="(group, index) in itemGroups"
                    :key="group.group_id"
                    @mouseenter="hovered = group.group_id"
                    @mouseleave="hovered = null"
                    :value="group"
                  >
                    <!-- Nama group -->
                    <VListItemTitle class="text-wrap"> {{ group.group_name }} </VListItemTitle>
    
                    <!-- Action muncul saat hover -->
                    <template v-slot:append="{ isSelected }">
                      <template v-if="hovered === group.group_id">
                        <v-btn
                          icon="mdi-pencil-outline"
                          variant="text"
                          size="x-small"
                          color="primary"
                          @click.stop="chooseDialogGroup('update',group)"
                        />
                        <v-btn
                          icon="mdi-delete-outline"
                          variant="text"
                          size="x-small"
                          color="error"
                          @click.stop="() => {
                            confirmDialogProps.op = 'delete group'
                            chooseConfirmPopup(group)
                          }"
                        />
                      </template>
                    </template>
                  </VListItem>
                </VList>
              </template>
            </MyInfiniteScroll>
          </VNavigationDrawer>
    
          <VMain class="chat-content-container d-flex flex-column">
            <VCardText 
              v-if="isLeftSidebarOpen == false"
              class="d-flex flex-row align-center text-black font-weight-bold row2"
            >
              <VBtn
                variant="text"
                color="default"
                icon
                size="small"
                class="d-md-none me-3"
                @click="isLeftSidebarOpen = true"
              >
                <VIcon
                  size="24"
                  icon="mdi-menu"
                />
              </VBtn>
            </VCardText>
    
            <div class="overflow-y-auto">
              <!-- SINI YA SA!! -->
              <VCardText class="text-black font-weight-bold">
                <VRow>
                  <VCol cols="9" class="d-flex align-center">
                    <!-- <span class="me-3">Show</span>
                    <div>
                      <VSelect
                        v-model="rowPerPage"
                        class="pagination-select rounded"
                        density="compact"
                        focused
                        :items="[10, 20, 30, 50]"
                      />
                    </div>
                    <span class="ms-3">entries</span> -->
                  </VCol>
                  <VCol cols="3" class="d-flex align-center justify-end">
                    <VBtn
                      class="text-none mx-1"
                      icon="mdi-trash-outline"
                      size="small"
                      variant="tonal"
                      @click="() => {
                        confirmDialogProps.op = 'remove package'
                        chooseConfirmPopup()
                      }"
                      :disabled="!checkedRows.length"
                    />
                    <VBtn
                      class="text-none"
                      rounded="md"
                      size="small"
                      prepend-icon="mdi-archive-plus-outline"                  
                      @click="chooseDialogPackage()"
                      :disabled="!tableData.length && !selectedGroup.length"
                    >
                      Add Package
                    </VBtn>
                  </VCol>
                </VRow>
              </VCardText>
              <div class="">
                <CustomTable
                  :table-header-names="tableHeader"
                  :table-data-length="tableData.length"
                  :show-checkbox="true"
                  :selected-rows="checkedRows"
                  @toggleSelectAll="toggleSelectAll"
                >
                  <template #tableBody>
                    <tr
                      v-for="(row, index) in tableData"
                      :key="index"
                      class="bg-hover"
                    >
                      <td class="text-center d-flex justify-center align-center">
                        <VCheckbox
                          density="compact"
                          hide-details
                          color="primary"
                          :value="row.package_id"
                          v-model="checkedRows"
                        />
                      </td>
                      <td class="pl-5">{{ row.package_name }}</td>
                    </tr>
                  </template>
                </CustomTable>
              </div>
              <VDivider />
              <VCardText class="d-flex align-center font-weight-bold text-black">
                <span>
                  {{ paginationData }}
                </span>
                <VSpacer />
                <VPagination
                  v-model="currentPagePackage"
                  size="small"
                  :total-visible="3"
                  :length="totalPage"
                  @next="selectedRows = []"
                  @prev="selectedRows = []"
                />
              </VCardText>
            </div>
          </VMain>
  
        </VLayout>
      </VCard>
    </div>
    
    <CustomDialogGroup
      v-model:is-dialog-visible="showDialogGroup"
      rounded="lg"
      width="40%"
      :title="titleDialogGroup"
      :groupData="editAddGroupData"
      :priv="priv"
      @create="data => {
        editAddGroupData.groupName = data.groupName

        confirmDialogProps.op = 'create group'
        chooseConfirmPopup()
      }"
      @save="data => {
        editAddGroupData.groupName = data.groupName

        confirmDialogProps.op = 'edit group'
        chooseConfirmPopup()
      }"
    />

    <CustomDialogPackageGroup
      v-model:is-dialog-visible="showDialogPackage"
      rounded="lg"
      width="50%"
      :title="titleDialogPackage"
      :groupData="editAddGroupData"
      :packageList="packageList"
      :priv="priv"
      @save="data => {
        editAddGroupData.newPackageGroup = data.newPackageGroup

        confirmDialogProps.op = 'add package'
        chooseConfirmPopup()
      }"
    />
  </section>
</template>
  
<style lang="scss" scoped>
.chat-content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-list-sidebar {
  display: flex;
  flex-direction: column;
}

.full-height-container {
  height: 75vh;
}

.full-height-card {
  height: 100%;
}

.full-height-layout {
  height: 100%;
}

.bg-hover:hover {
  background-color: rgba(68, 73, 74, 5%);
  // cursor: pointer;
}
</style>

<route lang="yaml">
  meta:
    requiresAuth: false
</route>
