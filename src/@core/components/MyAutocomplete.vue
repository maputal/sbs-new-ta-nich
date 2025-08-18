<template>
  <div class="autocomplete-wrapper">
    <!-- Search input -->
    <v-text-field
      v-model="search"
      label="Search"
      clearable
      :append-inner-icon="open ? 'mdi-menu-up' : 'mdi-menu-down'"
      @focus="open = true"
      @blur="onBlur"
    />

    <!-- {{ items }} -->
    <!-- {{ fetchItems }} -->
    <!-- Dropdown -->
    <div
      v-if="open && items.length"
      class="dropdown-menu"
      ref="dropdownRef"
    >
      <v-card
        v-if="open"
        class="absolute z-10 w-full"
        style="max-height: 56vh;"
      >
        <MyInfiniteScroll
          :items="items"
          :loading="loading"
          :hasMore="hasMore"
          @load-more="loadMore"
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import MyInfiniteScroll from "./MyInfiniteScroll.vue";

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
  search.value = item.name;
  open.value = false;
  emit("select", item); // notify parent
}

onMounted(() => {
  console.log('MyAutocomplete mounted');
  // loadMore();
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
</style>
