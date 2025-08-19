<script setup>
import AltStatsDetailTemplate from '@/components/statistics/AltStatsDetailTemplate.vue'
import StatisticsTemplateHeader from '@/components/statistics/StatisticsTemplateHeader.vue'
import { ref } from 'vue'
import { dummyFetcher } from './dummyData'

const totalPage = ref(1)
const totalRow = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)

// --- blacklist keys (these will not be displayed as columns) ---
const blacklist = ['id', 'created_at', 'updated_at']

const router = useRouter()
const route = useRoute()

const clickAction = {
  activate: row => {
    console.log(row)
    router.push(route.path + '/activate/' + row.date)
  },
  terminate: row => {
    console.log(row)
    router.push(route.path + '/terminate/' + row.date)
  },
  trouble: row => {
    console.log(row)
    router.push(route.path + '/trouble/' + row.date)
  },
}
</script>

<template>
  <section>
    <h6 class="text-h5 font-weight-bold">
      Daily statistics
    </h6>
    <h3 class="font-weight-light mb-4">
      Indosat
    </h3>

    <!--
      :package="['A']"
      :group="['A','B']"
    -->

    <StatisticsTemplateHeader
      :package="['A']"
    >
      <VDivider class="mb-6" />
      <AltStatsDetailTemplate
        :fetcher="dummyFetcher"
        :page-size="10"
        :page-size-options="[10, 20, 30, 50]"
        show-row-count
        dense
        :show-checkbox="false"
        :append-header="['Action']"
        @row-click="(row) => console.log('Row clicked', row)"
      >
        <!-- Add your own extra column(s) -->
        <template #append-columns="{ item }">
          <td class="text-right">
            <VBtn
              size="small"
              variant="text"
              @click.stop="() => alert(`Open ${item.id}`)"
            >
              Open
            </VBtn>
          </td>
        </template>
      </AltStatsDetailTemplate>
    </StatisticsTemplateHeader>
  </section>
</template>

