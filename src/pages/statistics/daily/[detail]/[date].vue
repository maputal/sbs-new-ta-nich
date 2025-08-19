<script setup>
import AltStatsDetailTemplate from '@/components/statistics/AltStatsDetailTemplate.vue'
import { watchEffect } from 'vue'

// Example fetcher (server-side ready; demo does client-side)
const fetchUsers = async ({ page, pageSize, sort, filters }) => {
  const start = (page - 1) * pageSize

  const all = Array.from({ length: 137 }, (_, i) => ({
    id: i + 1,
    first_name: `User${i + 1}`,

    //lastName: 'Doe',
    //email_address: `user${i + 1}@example.com`,
    //created_at: '2025-08-18',
    status: i % 3 ? 'Active' : 'Inactive',
  }))

  let data = [...all]
  if (sort && sort.key) {
    data.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av === bv) return 0
      
      return sort.desc ? (av < bv ? 1 : -1) : (av > bv ? 1 : -1)
    })
  }

  const pageItems = data.slice(start, start + pageSize)
  
  return { items: pageItems, total: all.length }
}

const route = useRoute()
const router = useRouter()

function redirectToStaticAncestor() {
  // Walk ancestors from deepest → shallowest
  const staticAncestor = [...route.matched].reverse().find(r => {
    // Ignore dynamic params (":id") and catch-alls ("(.*)")
    return !r.path.includes(':') && !r.path.includes('(.*)')
  })

  router.replace(staticAncestor?.path || '/')
}

function fetch_detail() {
  const valid_details = ["activate","terminate","trouble"]

  const detail_type = route.params.detail
  const detail_date = route.params.date

  let is_valid_details = (detail_type? valid_details.includes(detail_type) : false)

  console.log(`When the ${is_valid_details}`)

  if (!is_valid_details) {
    //router.replace({ path: "/statistics/daily" })
    redirectToStaticAncestor()
  }
}

watchEffect(fetch_detail)



// Optional explicit columns (otherwise inferred)
// const columns = [
//   { key: 'id', label: 'ID' },
//   { key: 'first_name', label: 'First Name' },
//   { key: 'email_address', label: 'Email' },
//   { key: 'status', label: 'Status', formatter: v => (v === 'Active' ? '✅ Active' : '⛔ Inactive') },
// ]
</script>

<template>
  <AltStatsDetailTemplate
    :fetcher="fetchUsers"
    :columns="columns"
    :page-size="10"
    :page-size-options="[10, 20, 30, 50]"
    show-row-count
    dense
    :show-checkbox="false"
    :append-header="['Test']"
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
</template>
