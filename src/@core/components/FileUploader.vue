<script setup>
import UploadableItem from '@/components/UploadableItem.vue'
import { useAppStore } from '@/store/app'
import { useFileProgressStore } from '@/store/useFileUploadStore'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  acceptedFormats: {
    type: String,
    default: ".xls,.xlsx,.csv",
  },
  allowTextUpload: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["files-submitted"])

const appStore = useAppStore()

const uploadOptions = computed(() => {
  const options = [
    { title: 'File', value: 'FILE' },
  ]

  if (props.allowTextUpload) {
    options.unshift({ title: 'Text', value: 'TEXT' })
  }
  
  return options
})

const upload_method = ref(null)
const textValue = ref('')
const fileValue = ref([]) // using <VFileInput multiple />, so an array
const uploadedFiles = ref([]) // for sending to BE
const form = ref(null)

const isDragging = ref(false)
const fileInput = ref(null)

const textRules = [v => (!!v && v.trim().length > 0) || 'Text is required']

// IMPORTANT: [] is truthy; make sure we check length for multiple
const fileRules = [v => (Array.isArray(v) ? v.length > 0 : !!v) || 'File is required']

watch(upload_method, () => {
  textValue.value = ''
  fileValue.value = []
  form.value?.resetValidation?.()
})

// helper to run Vuetify-style rules (true|string)
const runRules = (value, rules = []) => rules.every(r => r(value) === true)

// mode flags
const isTextMode = computed(() => upload_method.value === 'TEXT')
const isFileMode = computed(() => upload_method.value === 'FILE')

// quick presence checks
const hasText   = computed(() => !!textValue.value && textValue.value.trim().length > 0)
const hasFiles  = computed(() => Array.isArray(fileValue.value) ? fileValue.value.length > 0 : !!fileValue.value)

// validity per mode (uses your rules)
const isTextValid = computed(() => isTextMode.value && runRules(textValue.value, textRules))
const isFileValid = computed(() => isFileMode.value && runRules(fileValue.value, fileRules))

// expose booleans you asked for
const showSubmit = computed(() => isTextMode.value || isFileMode.value) // show once a mode is chosen
const canSubmit  = computed(() => isTextValid.value || isFileValid.value) // enable only when valid

const onSubmit = async () => {
  // console.log('')
  const res = await form.value?.validate?.()
  if (!res?.valid) return

  appStore.setPopup({
    title: 'Upload Data',
    word: 'Are you sure you want to upload this data?',
    action: 'confirm',
    onSucc: () => {
      let dataSubmit
      if(upload_method.value === 'TEXT'){
        dataSubmit = textValue.value
      } else {
        dataSubmit = uploadedFiles.value
      }
    
      //reset after successful submission
      upload_method.value = null
      textValue.value = ''
      fileValue.value = []
      form.value?.resetValidation?.()
      fileStore.clearAll()
    },
  })
}

const fileStore = useFileProgressStore()

const fileKey = file => `${file.name}-${file.size}-${file.lastModified}`

function onRemove(id) {
  // remove from the UI list
  fileValue.value = fileValue.value.filter(f => fileKey(f) !== id)

  // remove from Pinia map
  fileStore.removeFile(id) // this action exists in your store. :contentReference[oaicite:0]{index=0}
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = err => reject(err)
  })
}

function simulateUpload(fileData, key) {
  const interval = setInterval(() => {
    if (fileData.progress >= 100) {
      clearInterval(interval)
      
      return
    }
    fileData.progress += 10
    fileStore.setProgress(key, fileData.progress) // keep in sync with Pinia
  }, 150)
}

// function uploadAndSync(files) {
//   files?.forEach(f => fileStore.setProgress(fileKey(f), 0)) // action exists. :contentReference[oaicite:1]{index=1}
// }

function uploadAndSync(files) {
  uploadedFiles.value = [] // Reset list

  Array.from(files).forEach(file => {
    convertToBase64(file)
      .then(base64 => {
        const key = fileKey(file)
        const pureBase64 = base64.split(',')[1]

        const fileData = {
          name: file.name,
          progress: 0,
          base64: pureBase64,
        }

        uploadedFiles.value.push(fileData)
        simulateUpload(fileData, key)
      })
      .catch(err => {
        console.error('Base64 conversion failed:', err)
      })
  })
}

function onDrop(e) {
  isDragging.value = false

  const files = Array.from(e.dataTransfer.files)

  fileValue.value = files
  uploadAndSync(files)
}

function onFileChange(e) {
  const files = Array.from(e.target.files)

  fileValue.value = files
  uploadAndSync(files)
}
</script>

<template>
  <section>
    <VForm
      ref="form"
      @submit.prevent="onSubmit"
    >
      <div class="pa-6 mb-8">
        <!-- Upload type selector -->
        <VRow class="align-center">
          <VCol
            cols="12"
            md="3"
            class="d-flex align-center"
          >
            <VLabel
              for="uploadMethod"
              class="ma-0 text-black font-weight-black"
            >
              Upload type
            </VLabel>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VSelect
              id="uploadMethod"
              v-model="upload_method"
              :items="uploadOptions"
              item-title="title"
              item-value="value"
              label="Upload Option"
              variant="outlined"
              density="comfortable"
              class="w-100"
              clearable
            />
          </VCol>
        </VRow>

        <VDivider
          :thickness="20"
          class="border-opacity-0"
        />

        <!-- Single row that stays mounted -->
        <VRow class="align-start">
          <!-- LEFT: label column (swap label text only) -->
          <VCol
            cols="12"
            md="3"
            class="align-self-start"
          >
            <Transition
              name="fade-slide"
              mode="out-in"
            >
              <VLabel
                v-if="upload_method === 'TEXT'"
                key="lbl-text"
                for="textInput"
                class="ma-0 text-black font-weight-black"
              >
                Upload Manual Entry
              </VLabel>

              <VLabel
                v-else-if="upload_method === 'FILE'"
                key="lbl-file"
                for="fileInput"
                class="ma-0 text-black font-weight-black"
              >
                Upload File MSISDN
              </VLabel>

              <!-- Optional: placeholder when nothing selected -->
              <span
                v-else
                key="lbl-none"
                class="text-medium-emphasis"
              >Select an upload option</span>
            </Transition>
          </VCol>

          <!-- RIGHT: input column (swap input only) -->
          <VCol
            cols="12"
            md="9"
          >
            <!-- Height + content swap -->
            <VExpandTransition>
              <div
                v-if="upload_method === 'TEXT' && allowTextUpload"
                key="inp-text"
              >
                <VTextarea 
                  id="textInput"
                  v-model="textValue"
                  :rules="textRules"
                  rows="10"
                  label="Text" 
                  variant="outlined"
                  density="comfortable"
                  focused
                  hide-details="auto"
                />
              </div>
            </VExpandTransition>

            <VExpandTransition>
              <div
                v-if="upload_method === 'FILE'"
                key="inp-file"
              >
                <VSheet
                  class="pa-6 text-center border-dashed-custom"
                  color="transparent"
                  rounded
                  outlined
                  :class="{ dragover: isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="onDrop"
                >
                  <VIcon size="36">
                    mdi-file-upload-outline
                  </VIcon>
                  <div class="d-flex align-center justify-center">
                    <div class="text-black mt-2">
                      Drag & Drop or
                    </div>
                    <VBtn
                      color="primary"
                      variant="text"
                      class="mt-2 pa-2"
                      @click="$refs.fileInput.click()"
                    >
                      Choose File
                    </VBtn>
                    
                    <div class="text-black mt-2">
                      to upload
                    </div>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    hidden
                    :accept="acceptedFormats"
                    @change="onFileChange"
                  >
                  <small class="d-block text-grey">
                    Supported files: {{ acceptedFormats }}
                  </small>
                </VSheet>

                <VList class="mt-2">
                  <UploadableItem
                    v-for="file in fileValue"
                    :id="fileKey(file)"
                    :key="fileKey(file)"
                    :file="file"
                    :name="file.name"
                    :progress="fileStore.getProgress(fileKey(file))"
                    @cancel="onRemove"
                  />
                </VList>
              </div>
            </VExpandTransition>

            <!-- Actions (always present; no v-if) -->
            <div
              v-if="showSubmit"
              class="d-flex justify-start gap-3 mt-6"
            >
              <VBtn
                variant="flat"
                color="primary"
                type="submit"
                :disabled="!canSubmit"
              >
                Submit
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </div>
    </VForm>
  </section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active { transition: opacity .18s ease, transform .18s ease; }
.fade-slide-enter-from,
.fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }

.border-dashed-custom {
  border: 1px solid red;
  border-style: solid;
  border-width: thin;
}
.dragover {
  background-color: #e0f7ff;
  transition: background 0.3s;
}

.uploadable-list {
  max-height: 15vh; /* 40% of the viewport height */
  overflow-y: auto;
  padding-right: 4px;
}
/* .file-entry .remove-btn {
  position: absolute;
  right: 0;
  top: 0;
} */
</style>
