<script setup>
import { ref, reactive, computed, watch } from 'vue'

const pageTitle = ref("Upload Data HLR")

// Form data
const uploadData = reactive({
  files: [],
  selectedFiles: [],
})

// UI state
const isConfirmToastVisible = ref(false)
const isSuccessToastVisible = ref(false)
const isErrorToastVisible = ref(false)
const isLoading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref("")
const successMessage = ref("Files uploaded successfully")

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

// Upload functionality
const showConfirmToast = () => {
  if (isFormValid.value) {
    isConfirmToastVisible.value = true
  }
}

const confirmUpload = () => {
  isConfirmToastVisible.value = false
  uploadFiles()
}

const cancelUpload = () => {
  isConfirmToastVisible.value = false
}

const uploadFiles = () => {
  isLoading.value = true
  uploadProgress.value = 0
  
  const onSuccess = response => {
    isLoading.value = false
    uploadProgress.value = 100
    isSuccessToastVisible.value = true
    successMessage.value = `Successfully uploaded ${uploadData.files.length} file(s)`
    
    // Mark all files as success
    uploadData.files.forEach(file => {
      file.status = 'success'
      file.progress = 100
    })
  }

  const onError = error => {
    isLoading.value = false
    errorMessage.value = error.message || "Failed to upload files"
    isErrorToastVisible.value = true
    
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

  // Simulate upload progress
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10
    }
  }, 200)

  // MOFFAS API call for file upload
  if (window.moffas) {
    window.moffas.do_request("upload_hlr_files", { files: formData }, onSuccess, onError)
  } else {
    // Mock upload for development
    setTimeout(() => {
      clearInterval(progressInterval)
      isLoading.value = false
      uploadProgress.value = 100
      isSuccessToastVisible.value = true
      
      uploadData.files.forEach(file => {
        file.status = 'success'
        file.progress = 100
      })
    }, 2000)
  }
}

// Toast handlers
const closeSuccessToast = () => {
  isSuccessToastVisible.value = false
}

const closeErrorToast = () => {
  isErrorToastVisible.value = false
}

// Auto close toasts after 5 seconds
watch(isSuccessToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isSuccessToastVisible.value = false
    }, 5000)
  }
})

watch(isErrorToastVisible, newVal => {
  if (newVal) {
    setTimeout(() => {
      isErrorToastVisible.value = false
    }, 5000)
  }
})
</script>

<template>
  <div class="hlr-upload">
    <!-- Toast Notifications -->
    <!-- Confirmation Toast -->
    <Transition
      name="toast-slide"
      appear
    >
      <div
        v-if="isConfirmToastVisible"
        class="toast-container confirmation-toast"
      >
        <VCard
          class="toast-card"
          elevation="8"
          rounded="lg"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon
                icon="mdi-alert-circle"
                color="warning"
                size="24"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-warning">
                  Confirm Upload
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Do you want to proceed with uploading {{ uploadData.files.length }} file(s)?
                </div>
              </div>
              <div class="d-flex gap-2 ms-4">
                <VBtn
                  color="success"
                  size="small"
                  @click="confirmUpload"
                >
                  OK
                </VBtn>
                <VBtn
                  color="error"
                  variant="outlined"
                  size="small"
                  @click="cancelUpload"
                >
                  Cancel
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition
      name="toast-slide"
      appear
    >
      <div
        v-if="isSuccessToastVisible"
        class="toast-container success-toast"
      >
        <VCard
          class="toast-card"
          elevation="8"
          rounded="lg"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon
                icon="mdi-check-circle"
                color="success"
                size="24"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-success">
                  Success!
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ successMessage }}
                </div>
              </div>
              <VBtn
                color="success"
                size="small"
                @click="closeSuccessToast"
              >
                OK
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

    <!-- Error Toast -->
    <Transition
      name="toast-slide"
      appear
    >
      <div
        v-if="isErrorToastVisible"
        class="toast-container error-toast"
      >
        <VCard
          class="toast-card"
          elevation="8"
          rounded="lg"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon
                icon="mdi-alert-circle"
                color="error"
                size="24"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-error">
                  Error!
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ errorMessage }}
                </div>
              </div>
              <VBtn
                color="error"
                size="small"
                @click="closeErrorToast"
              >
                OK
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </Transition>

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
                :disabled="!isFormValid || isLoading"
                :loading="isLoading"
                @click="showConfirmToast"
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

/* Toast Container Positioning */
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 90%;
  max-width: 500px;
}

/* Toast Card Styling */
.toast-card {
  background-color: white !important;
  border: 1px solid #e0e0e0;
}

/* Toast Slide Animation */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
}

.toast-slide-enter-to,
.toast-slide-leave-from {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .hlr-upload {
    padding: 16px;
  }
  
  .upload-drop-zone {
    padding: 32px 16px;
  }
  
  .toast-container {
    width: 95%;
  }
}
</style>
