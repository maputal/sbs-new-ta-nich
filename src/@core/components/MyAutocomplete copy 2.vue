<template>
  <div>
    <!-- Search input -->
    <v-text-field
      v-model="search"
      label="Search"
      clearable
      :append-inner-icon="open ? 'mdi-menu-up' : 'mdi-menu-down'"
      ref="activatorRef"
      @focus="open = true"
      @blur="onBlur"
    />

    <!-- {{ items }} -->
    <!-- {{ fetchItems }} -->
    <!-- Dropdown -->
    <v-overlay
      v-model="open"
      :close-on-content-click="true"
      :scrim="false"
      persistent
      location-strategy="connected"
      scroll-strategy="reposition"
      :activator="activatorRef"
      content-class="autocomplete-overlay"
    >
      <v-card class="pa-2" max-height="300px" width="100%" >
        <MyInfiniteScroll
          :items="items"
          :loading="loading"
          :hasMore="hasMore"
          @load-more="loadMore"
          style="max-height:300px"
        >
          <template #default="{ items }">
            <v-list>
              <v-list-item
                v-for="item in items"
                :key="item.id"
                @click="pick(item)"
              >
                {{ item.package_name }}
              </v-list-item>
            </v-list>
          </template>
        </MyInfiniteScroll>
      </v-card>
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
// import MyInfiniteScroll from "./MyInfiniteScroll.vue";

const props = defineProps({
  fetchItems: { type: Function, required: true }, // parent gives this
  label: { type: String, default: "Search" }
});

const emit = defineEmits(["select"]);

const search = ref("");
const open = ref(false);
const items = ref([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const activatorRef = ref(null);

watch(search, async () => {
  page.value = 1;
  items.value = [];
  hasMore.value = true;
  await loadMore();
});

function onBlur() {
  setTimeout(() => {
    open.value = false;
  }, 150);
}

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const { data, more } = await props.fetchItems(search.value, page.value);
    if (page.value === 1) {
      items.value = data;
    } else {
      items.value = [...items.value, ...data];
    }

    hasMore.value = more;
    page.value++;
  } finally {
    loading.value = false;
  }
}

function pick(item) {
  search.value = item.package_name;
  open.value = false;
  emit("select", item); // notify parent
}

onMounted(() => {
  console.log('MyAutocomplete mounted');
  loadMore();
})
</script>

<style scoped>
.autocomplete {
  position: relative;
  display: inline-block;
  width: 100%;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999999999; /* high enough to float above cards, dialogs, etc */
  width: 100%;
  max-height: 300px;
  /* overflow-y: auto; */
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
}

.autocomplete-overlay {
  width: 100% !important;
  max-width: 100% !important;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
