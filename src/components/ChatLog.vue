<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  chatTemplateBody: {
    type: Function,
    required: true,
  },
  compareTimeStamp: {
    type: Function,
    required: true,
  },
  toTimeDMYHM: {
    type: Function,
    required: true,
  },
  toTimeHM: {
    type: Function,
    required: true,
  },
  statusColor: {
    type: Object,
    required: true,
  },
  statusIcon: {
    type: Object,
    required: true,
  },
  // userNameAgent: {
  //   type: Object,
  //   required: true,
  // },
})

const emits = defineEmits([
  'update', 
  'update:modelValue', 
])

const route = useRoute()
const router = useRouter()

const chatTemplateBody = ref(props.chatTemplateBody)
const compareTimeStamp = ref(props.compareTimeStamp)
const toTimeDMYHM = ref(props.toTimeDMYHM)
const toTimeHM = ref(props.toTimeHM)
const statusColor = ref(props.statusColor)
const statusIcon = ref(props.statusIcon)

onMounted(() => {
  console.log('Chat finish initiated')
})

</script>

<template>
  <div
    class="chat-log d-flex flex-column-reverse pa-4"
  >
    <div
      v-for="(chat, idx) in props.messages"
      :key="idx"
      class="chat-group d-flex align-start"
      :class="[{'flex-row-reverse': chat.side === 'business',}]"
    >
      <div
        class="chat-avatar"
        :class="chat.side === 'business' ? 'ms-1' : 'me-1'"
      >
        <VAvatar size="38">
          <VImg :src="chat.side === 'business' ? avatar1 : avatar2" />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="chat.side !== 'customer' ? 'align-end pl-16' : 'align-start pr-16'"
      >
        <div
          class="chat-content text-sm py-0 px-2 elevation-1 mb-1"
          :class="[
            chat.side === 'business' ? 'bg-primary text-white chat-right' : 'bg-surface chat-left',
          ]"
        >
          <!-- chat.isNew && chat.side === 'customer' ? 'bg-grey-200' : '', -->

          <div class="pt-1">
            <div
              v-if="chat.side === 'customer' && chat.type !== 'contacts'"
              class="text-xs"
            >
              <b>{{ chat.from }}</b>
            </div>
            <div
              v-else-if="chat.side === 'customer' && chat.type == 'contacts'"
            >              
              <div class="text-center bg-contact-green rounded pa-1">
                <b>Contact</b>
              </div>
            </div>
            <div
              v-else-if="chat.side === 'business'"
              class="text-end text-xs"
            >
              <!-- <b>{{ diniagent }}</b> -->
            </div>
          </div>
          <div>
            <div
              v-if="chat.type == 'text'"
            >
              {{ chat.data.body }}
            </div>
            <div
              v-else-if="chat.type == 'reaction'"
            >
              <i>[{{ chat.type }}]</i> <br />
              {{ chat.data.emoji }}
              <!-- {{ chat }} -->
            </div>
            <div
              v-else-if="chat.type == 'document'"
            >
              <div class="d-flex align-center bg-grey-200 pa-1">
                {{ chat.data.filename }}
                
                <a :href="chat.data.url" :download="chat.data.filename" class="pl-2">
                  <VIcon
                    icon="mdi-download-circle-outline"
                  />
                </a>
              </div>
              {{ chat.data.caption }}
            </div>
            <div
              v-else-if="chat.type == 'template'"
              style="white-space: pre-line;"
            >
              {{ chatTemplateBody(chat.data.body) }}
            </div>
            <div
              v-else-if="chat.type == 'image'"
            >
              <img
                class="size-img"
                :src="chat.data.url"
                alt="img"
              />
              <br />
              {{ chat.data.caption }}
            </div>
            <div
              v-else-if="chat.type == 'video'"
            >
              <video width="500" height="360" controls>
                <source :src="chat.data.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <br />
              {{ chat.data.caption }}
            </div>
            <div
              v-else-if="chat.type == 'audio'"
            >
              <audio ref="audioPlayer" controls>
                <source :src="chat.data.url" type="audio/mp3">
                Your browser does not support the audio tag.
              </audio>
            </div>
            <div
              v-else-if="chat.type == 'sticker'"
            >
              <img
                class="size-sticker"
                :src="chat.data.url"
                alt="img"
              />
              <br />
              <!-- {{ chat.data.url }}
              <i>Sticker</i> -->
            </div>
            <div
              v-else-if="chat.type == 'location'"
            >
              <i>[{{ chat.type }}]</i>
              <br />
              <div v-if="chat.data.name">
                {{ chat.data.name }}
              </div>
              <div v-if="chat.data.address">
                {{ chat.data.address }}
              </div>
              <a 
                :href="chat.data.url" 
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ chat.data.url }}
              </a>
            </div>
            <div
              v-else-if="chat.type == 'contacts'"
            >
              <div 
                v-for="(contact, idy) in chat.data"
                :key="idy"
              >
                <div v-if="contact.name">
                  {{ contact.name.formatted_name }}
                </div>
                <div v-if="contact.phones">
                  <div 
                    v-for="(phone, idz) in contact.phones"
                    :key="idz"
                  >
                    <b>{{ phone.phone }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
            >
              <i>[{{ chat.type }}]</i>
              <i>[{{ chat }}]</i>
            </div>
          </div>
          <div
            v-if="chat.status !== ''"
            class="py-0"
            :class="{ 'text-right': chat.side !== 'customer' }"
          >
            <span
              v-if="compareTimeStamp(chat.tstamp)" 
              class="text-xs me-1"
            >
              {{ toTimeDMYHM(chat.tstamp) }}
            </span>
            <span 
              v-else
              class="text-xs me-1"
            >
              {{ toTimeHM(chat.tstamp) }}
            </span>
            <VIcon
              :key="chat.message_id + idx"
              v-if="chat.side !== 'customer'"
              size="16"
              :color="statusColor[chat.status]"
            >
              {{ statusIcon [chat.status] }}
            </VIcon>
          </div>
        </div>
        <div 
          v-if="chat.side === 'business' && chat.status === 'failed' && chat.errors"
          class="d-flex justify-end pb-1"
        >
          <span
            class="text-xs text-primary"
            v-for="(error, idz) in chat.errors"
            :key="idz"
          >
            <div v-if="error.title">
              <i>failed: {{ error.title }}</i>
            </div>
            <div v-else-if="error.message">
              <i>failed: {{ error.message }}</i>
            </div>
          </span>
        </div>
        <div 
          v-if="chat.side === 'business' && chat.status === 'failed' && chat.error"
          class="d-flex justify-end pb-1"
        >
          <span
            class="text-xs text-primary"
          >
            <div v-if="chat.error.title">
              <i>failed: {{ chat.error.title }}</i>
            </div>
            <div v-else-if="chat.error.message">
              <i>failed: {{ chat.error.message }}</i>
            </div>
          </span>
        </div>
      </div>
    </div>   
  </div>
</template>

<style lang=scss scoped>
.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}

img {
  max-inline-size: 300px;
}

.size-sticker {
  inline-size: 150px;
}
</style>
