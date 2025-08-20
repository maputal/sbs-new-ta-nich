export function dummyFetcher(params) {
  /* Params format */
  // {
  //     page: page.value,
  //     pageSize: pageSize.value,
  //     sort: localSortKey.value ? { key: localSortKey.value, desc: localSortDesc.value } : null,
  //     filters: props.filters || {},
  // }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const sort = params.sort
  const filters = params.filters

  // Generate dummy data for August 2025
  const generateData = () => {
    const data = []
    const baseDate = new Date('2025-08-01')
    
    for (let i = 0; i < 50; i++) {
      const currentDate = new Date(baseDate)

      currentDate.setDate(baseDate.getDate() + i)
      
      // Format date as DD-MM-YYYY
      const day = String(currentDate.getDate()).padStart(2, '0')
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const year = currentDate.getFullYear()
      const dateStr = `${day}-${month}-${year}`
      
      // Generate random but realistic data
      const activate = Math.floor(Math.random() * 500) + 1400 // 1400-1900 range
      const terminate = Math.floor(Math.random() * 150) + 50  // 50-200 range
      const trouble = Math.random() < 0.1 ? Math.floor(Math.random() * 5) + 1 : 0 // mostly 0, occasionally 1-5
      
      data.push({
        date: dateStr,
        activate: activate,
        terminate: terminate,
        trouble: trouble,
      })
    }
    
    return data
  }

  // Generate full dataset
  const allData = generateData()
  
  // Calculate pagination
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedItems = allData.slice(startIndex, endIndex)
  
  // TODO: Implement sorting when sort param is provided
  // if (sort) {
  //   // Sort logic would go here
  //   // sort.key contains the column key
  //   // sort.desc is boolean for descending
  // }
  
  // TODO: Implement filtering when filters param is provided  
  // if (filters && Object.keys(filters).length > 0) {
  //   // Filter logic would go here
  // }

  // Simulate async operation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        items: paginatedItems,
        total: allData.length,
      })
    }, 300) // 300ms delay to simulate API call
  })
}

// Example usage:
// const clickActions = {
//   'Date': (row) => console.log('Date clicked:', row.Date),
//   'Activate': (row) => console.log('Activate clicked:', row.Activate, 'for date:', row.Date)
// }
//
// <AltStatsDetailTemplate 
//   :fetcher="dummyFetcher"
//   :click-action="clickActions"
// />


// dummy-fetchers.js

// Fake "database"
const dummyPackages = [
  { id: 1, name: 'Starter Pack' },
  { id: 2, name: 'Pro Bundle' },
  { id: 3, name: 'Enterprise Suite' },
  { id: 4, name: 'Holiday Special' },
]

const dummyGroups = [
  { id: 'A', name: 'Group Alpha' },
  { id: 'B', name: 'Group Beta' },
  { id: 'C', name: 'Group Gamma' },
  { id: 'D', name: 'Delta Force' },
]

// Utility to simulate async delay
function simulateDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Package fetcher
export async function packageFetch(query = '') {
  await simulateDelay(600) // simulate network latency

  const q = query.toLowerCase()

  const filtered = dummyPackages.filter(p =>
    p.name.toLowerCase().includes(q),
  )

  return filtered.map(p => ({ title: p.name, value: p.id }))
}

// Group fetcher
export async function groupFetch(query = '') {
  await simulateDelay(400) // simulate network latency

  const q = query.toLowerCase()

  const filtered = dummyGroups.filter(g =>
    g.name.toLowerCase().includes(q),
  )

  return filtered.map(g => ({ title: g.name, value: g.id }))
}
