export function dummyFetcher(params) {
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const sort = params.sort
  const filters = params.filters

  // Generate dummy data for Summer Daily Statistics
  const generateSummerData = () => {
    const packages = [
      'Samsung JJ Kit',
      'bost-microMat',
      'Multi-Play',
      'Xiaomi Test Package',
      'INFINIX SysMenu',
      'Nokia DevKit',
      'Sony MediaStack',
      'LG CoreBundle',
      'Huawei TestSuite',
      'OnePlus DevPack',
      'Oppo SystemKit',
      'Vivo AppBundle',
      'Realme TestPack',
      'Motorola DevKit',
      'Google PlayCore',
    ]
    
    const data = []
    const baseDate = new Date('2025-08-01')
    
    for (let i = 0; i < 100; i++) {
      const currentDate = new Date(baseDate)

      currentDate.setDate(baseDate.getDate() + (i % 30)) // Cycle through 30 days
      
      // Format date as DD-MM-YYYY
      const day = String(currentDate.getDate()).padStart(2, '0')
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const year = currentDate.getFullYear()
      const dateStr = `${day}-${month}-${year}`
      
      // Pick random package name
      const packageName = packages[i % packages.length]
      
      // Generate realistic statistics
      const offer = Math.floor(Math.random() * 30) + 5        // 5-35
      const attempt = Math.floor(Math.random() * 40) + 10     // 10-50
      const noResponse = Math.floor(Math.random() * 25) + 5   // 5-30
      const activate = Math.floor(Math.random() * 50) + 10    // 10-60
      const noStatus = Math.floor(Math.random() * 30) + 5     // 5-35
      const failed = Math.floor(Math.random() * 80) + 20      // 20-100
      const terminated = Math.floor(Math.random() * 70) + 30  // 30-100
      
      data.push({
        No: i + 1,
        'Package Name': packageName,
        Date: dateStr,
        Offer: offer,
        Attempt: attempt,
        'No Response': noResponse,
        Activate: activate,
        'No Status': noStatus,
        Failed: failed,
        Terminated: terminated,
      })
    }
    
    // Add totals row (optional - you might want to handle this separately)
    const totalsRow = {
      No: '',
      'Package Name': 'Total',
      Date: '',
      Offer: data.reduce((sum, row) => sum + row.Offer, 0),
      Attempt: data.reduce((sum, row) => sum + row.Attempt, 0),
      'No Response': data.reduce((sum, row) => sum + row['No Response'], 0),
      Activate: data.reduce((sum, row) => sum + row.Activate, 0),
      'No Status': data.reduce((sum, row) => sum + row['No Status'], 0),
      Failed: data.reduce((sum, row) => sum + row.Failed, 0),
      Terminated: data.reduce((sum, row) => sum + row.Terminated, 0),
    }
    
    return [...data, totalsRow]
  }

  // Generate full dataset
  const allData = generateSummerData()
  
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
    }, 400) // 400ms delay to simulate API call
  })
}

// Example usage with click actions:
// const clickActions = {
//   'Package Name': (row) => console.log('Package clicked:', row['Package Name']),
//   'Date': (row) => console.log('Date clicked:', row.Date),
//   'Action': (row) => console.log('Action clicked for:', row['Package Name'])
// }
//
// <AltStatsDetailTemplate 
//   :fetcher="summerStatsFetcher"
//   :click-action="clickActions"
//   :page-size="10"
// />
