// Dummy data fetcher with fixed member list
export async function fetchMembersDummy(params) {
  const { row_length, current_page } = params;

  // Fixed dataset
  const allMembers = [
  { "login": "alice.johnson", "nip": "NIP-0001", "name": "Alice Johnson", "division": "Finance", "role": 1, "status": true },
  { "login": "bob.smith", "nip": "NIP-0002", "name": "Bob Smith", "division": "Engineering", "role": 3, "status": true },
  { "login": "charlie.davis", "nip": "NIP-0003", "name": "Charlie Davis", "division": "HR", "role": 2, "status": false },
  { "login": "diana.evans", "nip": "NIP-0004", "name": "Diana Evans", "division": "Marketing", "role": 3, "status": true },
  { "login": "ethan.brown", "nip": "NIP-0005", "name": "Ethan Brown", "division": "Engineering", "role": 1, "status": true },
  { "login": "fiona.carter", "nip": "NIP-0006", "name": "Fiona Carter", "division": "Finance", "role": 3, "status": true },
  { "login": "george.harris", "nip": "NIP-0007", "name": "George Harris", "division": "HR", "role": 2, "status": false },
  { "login": "hannah.lee", "nip": "NIP-0008", "name": "Hannah Lee", "division": "Marketing", "role": 3, "status": true },
  { "login": "ian.walker", "nip": "NIP-0009", "name": "Ian Walker", "division": "Engineering", "role": 1, "status": true },
  { "login": "jane.adams", "nip": "NIP-0010", "name": "Jane Adams", "division": "Finance", "role": 3, "status": true },
  { "login": "kevin.scott", "nip": "NIP-0011", "name": "Kevin Scott", "division": "Engineering", "role": 2, "status": true },
  { "login": "laura.king", "nip": "NIP-0012", "name": "Laura King", "division": "HR", "role": 3, "status": true },
  { "login": "michael.white", "nip": "NIP-0013", "name": "Michael White", "division": "Marketing", "role": 1, "status": true },
  { "login": "nina.brooks", "nip": "NIP-0014", "name": "Nina Brooks", "division": "Finance", "role": 3, "status": false },
  { "login": "oscar.reed", "nip": "NIP-0015", "name": "Oscar Reed", "division": "Engineering", "role": 2, "status": true }
  ];

  const totalRecords = allMembers.length;
  const totalPages = Math.ceil(totalRecords / row_length);

  // Slice data for the requested page
  const startIndex = (current_page - 1) * row_length;
  const paginatedMembers = allMembers.slice(startIndex, startIndex + row_length);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data:{
      data: paginatedMembers,
      page_total: totalPages,
      recordsTotal: totalRecords,
    }
  };
}

// Example usage
(async () => {
  const params = {
    company_id: "COMP-001",
    session_id: "SESSION-123",
    row_length: 5,
    current_page: 2,
    nip: "",
    name: "",
    search_filter: "",
  };

  const data = await fetchMembersDummy(params);
  console.log(data);
})();