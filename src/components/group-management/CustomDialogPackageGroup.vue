<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  rounded: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: "auto",
  },
  title: {
    type: String,
    default: "[title]",
  },

  // Should be an array of objects, each containing headerName, dataName, and inputType
  // if inputTypes is 'select' then must also include array of items
  groupData: {
    type: Object,
    required: true,
  }, 
  packageList: {
    type: Array,
  },
  hasActionButton: {
    type: Boolean,
    default: true,
  },
  priv: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update:isDialogVisible', 'update:modelValue','save', 'create'])

const groupData = ref(structuredClone(toRaw(props.groupData)))
const refVForm = ref()

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      // emits('update:modelValue', false)
      emits('save', groupData.value)
    }
  })
}

const dialogVisibleUpdate = val => {
  emits('update:isDialogVisible', val)
}

watch(props, () => {
  groupData.value = structuredClone(toRaw(props.groupData))
})

///////////////////////////////////////////
const search = ref('');
const items = ref([]);
const loading = ref(false);

const onSearch = async (query) => {
  console.log('onSearch query:', query);

  search.value = query;

  if (query.length < 2) {
    items.value = [];
    return;
  }

  // loading.value = true;

  // try {
  //   // Simulate server call (replace with your real fetch logic)
  //   const response = await fetch(`/api/states?search=${encodeURIComponent(query)}`);
  //   const result = await response.json();

  //   items.value = result.data; // or whatever structure your API returns
  // } catch (err) {
  //   console.error('Search failed:', err);
  //   items.value = [];
  // } finally {
  //   loading.value = false;
  // }
}

async function onEnter() {
  console.log('search.value:', search.value)
  if (!search.value || search.value.length < 2) {
    items.value = [];
    return;
  }

  loading.value = true;
  // try {
  //   // Replace with your actual API call
  //   const response = await fetch(`/api/states?search=${encodeURIComponent(search.value)}`);
  //   const result = await response.json();
  //   items.value = result.data;
  // } catch (error) {
  //   console.error('API error:', error);
  //   items.value = [];
  // } finally {
  //   loading.value = false;
  // }
}
////////////////////////////////////////////////////////////////////////

const selected = ref(null);

function onSelect(item) {
  selected.value = item;
}

// Fake backend fetch
async function fetchItems(query, page) {
  const pageSize = 50;
  // const all = Array.from({ length: 5000 }, (_, i) => ({
  //   id: i,
  //   name: `Item ${i}`
  // })).filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

  const all = props.packageList
    ?.filter(p => p.package_name.toLowerCase().includes(query.toLowerCase())) || [];

  const start = (page - 1) * pageSize;
  const data = all.slice(start, start + pageSize);
  const more = start + pageSize < all.length;

  await new Promise(r => setTimeout(r, 300)); // simulate delay
  return { data, more };
}
</script>

<template>
  <VDialog
    :width="props.width"
    :model-value="props.isDialogVisible"
    persistent
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard 
      :rounded="props.rounded"
    >
      <VCardTitle
        class="text-black font-weight-bold"
      >
        {{ props.title }}
      </VCardTitle>
      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onFormSubmit"
        >
          <VRow class="align-center">
            <VCol
              cols="12"
            >
              <VTextField
                v-model="groupData.groupName"
                label="Group Name"
                variant="outlined"
                density="compact"
                focused
                readonly
              />
            </VCol>

            <VCol
              cols="12"
            >
              <!-- <v-autocomplete
                v-model="groupData.newPackageGroup"
                :items="props.packageList"
                item-title="package_name"
                item-value="package_id"
                label="Choose Package"
                variant="outlined"
                density="compact"
                chips
                multiple
                clearable
                closable-chips
                return-object
                focused
                :menu-props="{ maxHeight: 300, location: 'bottom' }"
              ></v-autocomplete> -->

              <v-autocomplete
                v-model="groupData.newPackageGroup"
                :items="items"
                item-title="package_name"
                item-value="package_id"
                label="Choose Package"
                variant="outlined"
                density="compact"
                :search="search"
                :loading="loading"
                :no-filter="true"
                :hide-no-data="true"
                chips
                multiple
                clearable
                return-object
                focused
                @keydown.enter="onEnter"
                @update:search="search = $event"
                :menu-props="{ maxHeight: 300, location: 'bottom' }"
              >
                <!-- Custom loader slot -->
                <template #loader="{ color, isActive }">
                  <v-progress-linear
                    v-if="isActive"
                    color="secondary"
                    indeterminate
                    size="20"
                    width="2"
                  />
                </template>
              </v-autocomplete>

              <!-- <MyAutocomplete
                :fetch-items="fetchItems"
                label="Pick an item"
                @select="onSelect"
              />

              <p v-if="selected">You picked: {{ selected.name }}</p> -->
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions
        class="d-flex align-center pa-3 justify-end"
      >            
        <!-- v-if ="priv.hasOwnProperty('create_group') && priv.hasOwnProperty('update_group') || Object.keys(priv).length === 0" -->
        <VBtn
          class="text-none px-4"
          variant="flat"
          @click="onFormSubmit"
        >
          Submit
        </VBtn>
        <VBtn
          class="text-none px-4"
          variant="outlined"
          @click="() => {
            dialogVisibleUpdate(false)
          }"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.required::after {
  color: red;
  content: "*";
}
</style>
