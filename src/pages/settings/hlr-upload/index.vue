<script setup>
import { useAppStore } from '@/store/app'
import { useGlobalStore } from '@/store/useGlobalStore'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const globalStore = useGlobalStore()
const router = useRouter()

const pageTitle = ref("Upload Data HLR")

// Authentication check
const checkAuthentication = () => {
  const user = globalStore.user
  if (!user) {
    router.push('/login')
    
    return false
  }
  
  return true
}

// Form data
const uploadData = reactive({
  files: [],
  selectedFiles: [],
})

// File upload refs
const fileInput = ref(null)

// Computed properties
const hasFiles = computed(() => uploadData.files.length > 0)
const isFormValid = computed(() => hasFiles.value)

// File handling methods
const handleFileSelect = event => {
  const files = Array.from(event.target.files)

  addFiles(files)
}

const handleFileDrop = event => {
  event.preventDefault()

  const files = Array.from(event.dataTransfer.files)

  addFiles(files)
}

const addFiles = files => {
  files.forEach(file => {
    // Check if file is already added
    const exists = uploadData.files.some(existingFile => 
      existingFile.name === file.name && existingFile.size === file.size,
    )
    
    if (!exists) {
      const fileObj = {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending', // pending, uploading, success, error
      }

      uploadData.files.push(fileObj)
    }
  })
}

const removeFile = fileId => {
  uploadData.files = uploadData.files.filter(f => f.id !== fileId)
}

const clearAllFiles = () => {
  uploadData.files = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Drag and drop handlers
const onDragOver = event => {
  event.preventDefault()
}

const onDragLeave = event => {
  event.preventDefault()
}

// Show confirmation dialog
const showConfirmDialog = () => {
  if (!checkAuthentication()) return
  
  if (isFormValid.value) {
    appStore.setPopup({
      title: 'Confirm Upload',
      word: `Do you want to proceed with uploading ${uploadData.files.length} file(s)?`,
      action: '2',
      onSucc: uploadFiles,
    })
  }
}

// Upload functionality
const uploadFiles = () => {
  appStore.showLoader()
  
  const onSuccess = response => {
    appStore.hideLoader()
    appStore.setPopup({
      title: 'Success!',
      word: `Successfully uploaded ${uploadData.files.length} file(s)`,
      action: 'success',
      onSucc: () => {},
    })
    
    // Mark all files as success
    uploadData.files.forEach(file => {
      file.status = 'success'
      file.progress = 100
    })
  }

  const onError = error => {
    appStore.hideLoader()
    appStore.showError(error.message || "Failed to upload files")
    
    // Mark all files as error
    uploadData.files.forEach(file => {
      file.status = 'error'
    })
  }

  const formData = new FormData()

  uploadData.files.forEach((fileObj, index) => {
    formData.append(`files[${index}]`, fileObj.file)
    fileObj.status = 'uploading'
  })

  // MOFFAS API call for file upload
  if (window.moffas) {
    window.moffas.do_request("upload_hlr_files", { files: formData }, onSuccess, onError)
  } else {
    // Mock upload for development
    setTimeout(() => {
      appStore.hideLoader()
      appStore.setPopup({
        title: 'Success!',
        word: `Successfully uploaded ${uploadData.files.length} file(s)`,
        action: 'success',
        onSucc: () => {},
      })
      
      uploadData.files.forEach(file => {
        file.status = 'success'
        file.progress = 100
      })
    }, 2000)
  }
}

// Component lifecycle
onMounted(() => {
  checkAuthentication()
})
</script>

<template>
  <div class="hlr-upload">
    <!-- Loading Overlay -->
    <div
      v-if="appStore.showProgressCircular"
      class="loading-overlay"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <!-- Main Content -->
    <VRow class="mb-6">
      <VCol cols="12">
        <div>
          <h2 class="text-h4 font-weight-bold">
            {{ pageTitle }}
          </h2>
          <h3>Indosat Secure Bundling System</h3>
        </div>
      </VCol>
    </VRow>

    <!-- Upload Section -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <!-- File Upload Area -->
            <div class="mb-4">
              <div class="text-body-1 font-weight-medium mb-2 text-error">
                File
              </div>
              <div class="text-caption mb-3 text-medium-emphasis">
                Upload File HLR
              </div>

              <!-- Drop Zone -->
              <div
                class="upload-drop-zone"
                @dragover="onDragOver"
                @dragleave="onDragLeave"
                @drop="handleFileDrop"
                @click="$refs.fileInput.click()"
              >
                <VIcon
                  icon="mdi-cloud-upload-outline"
                  size="48"
                  color="primary"
                  class="mb-3"
                />
                <div class="text-h6 mb-2">
                  Drag & Drop or Choose File to Upload
                </div>
                <div class="text-caption text-medium-emphasis mb-3">
                  Supported files
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".csv,.txt,.xlsx,.xls"
                  style="display: none"
                  @change="handleFileSelect"
                >
              </div>
            </div>

            <!-- File List -->
            <div
              v-if="hasFiles"
              class="mb-4"
            >
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="text-h6">
                  Selected Files
                </div>
                <VBtn
                  color="error"
                  variant="text"
                  size="small"
                  @click="clearAllFiles"
                >
                  Clear All
                </VBtn>
              </div>

              <div class="file-list">
                <div
                  v-for="fileObj in uploadData.files"
                  :key="fileObj.id"
                  class="file-item"
                >
                  <div class="d-flex align-center">
                    <VIcon
                      :icon="fileObj.status === 'success' ? 'mdi-check-circle' : 
                        fileObj.status === 'error' ? 'mdi-alert-circle' :
                        fileObj.status === 'uploading' ? 'mdi-loading mdi-spin' : 'mdi-file-document'"
                      :color="fileObj.status === 'success' ? 'success' : 
                        fileObj.status === 'error' ? 'error' :
                        fileObj.status === 'uploading' ? 'primary' : 'default'"
                      size="20"
                      class="me-3"
                    />
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">
                        {{ fileObj.name }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatFileSize(fileObj.size) }}
                      </div>
                    </div>
                    <VBtn
                      v-if="fileObj.status === 'pending'"
                      icon="mdi-close"
                      variant="text"
                      size="small"
                      @click="removeFile(fileObj.id)"
                    />
                  </div>

                  <!-- Progress Bar for uploading files -->
                  <div
                    v-if="fileObj.status === 'uploading'"
                    class="mt-2"
                  >
                    <VProgressLinear
                      :model-value="fileObj.progress || uploadProgress"
                      color="primary"
                      height="4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div
              v-if="isLoading"
              class="mb-4"
            >
              <div class="d-flex align-center mb-2">
                <VIcon
                  icon="mdi-upload"
                  color="primary"
                  size="20"
                  class="me-2"
                />
                <div class="text-body-2">
                  Uploading files... {{ uploadProgress }}%
                </div>
              </div>
              <VProgressLinear
                :model-value="uploadProgress"
                color="primary"
                height="6"
              />
            </div>

            <!-- Submit Button -->
            <div class="d-flex justify-start">
              <VBtn
                color="error"
                :disabled="!isFormValid || appStore.showProgressCircular"
                :loading="appStore.showProgressCircular"
                @click="showConfirmDialog"
              >
                <VIcon
                  icon="mdi-upload"
                  class="me-2"
                />
                Submit
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.hlr-upload {
  padding: 24px;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Upload Drop Zone */
.upload-drop-zone {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.upload-drop-zone:hover {
  border-color: #1976d2;
  background-color: #f3f9ff;
}

/* File List */
.file-list {
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: #ffffff;
}

.file-item:last-child {
  margin-bottom: 0;
}
</style>

