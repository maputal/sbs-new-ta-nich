
let sideBars = [{ heading: 'General' }]

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

sideBars.push({
  title: 'Dashboard',
  icon: { icon: 'mdi-view-dashboard-outline' },
  to: 'dashboard',
})
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_dashboard')) {
// }

sideBars.push({
  title: 'Group',
  icon: { icon: 'mdi-group' },
  to: 'group-management',
})
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_broadcast') && priv.hasOwnProperty('view_template')) {
// }

sideBars.push({
  title: 'Manual Activation',
  icon: { icon: 'mdi-form-textbox' },
  to: 'manual-activation',
})
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_broadcast') && priv.hasOwnProperty('view_template')) {
// }

// -------------------- Customer Interaction
const customerInteractionSidebar = {
  title: 'Customer Interaction',
  icon: { icon: 'mdi-support' },
  children: []
};

customerInteractionSidebar.children.push({ title: 'Ticket List', to: 'support-list' });
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_ticket')) {
// }

customerInteractionSidebar.children.push(
  { title: 'Customer Information', to: 'support-customer-information' }
);
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_customer')) {
// }

// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_conversation')) {
//   console.log("masuk view_chat");
//   customerInteractionSidebar.children.push(
//     { title: 'Conversation List', to: 'support-conversation-list' }
//   );
// }

// if (customerInteractionSidebar.children.length > 0) {
//   sideBars.push(customerInteractionSidebar);
// }

// -------------------- Search
const searchSidebar = {
  title: 'Search',
  icon: { icon: 'mdi-search' },
  children: []
};

searchSidebar.children.push({ title: 'Search by MSISDN', to: 'search-msisdn' });
searchSidebar.children.push({ title: 'Search by IMEI', to: 'search-msisdn' });
searchSidebar.children.push({ title: 'Search by TAC', to: 'search-msisdn' });

// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_group') || priv.hasOwnProperty('view_broadcast')) {
//   searchSidebar.children.push({ title: 'View Group', to: 'group-management-view-all' });
// }

// if (Object.keys(priv).length === 0) {
//   searchSidebar.children.push({ title: 'Create Group', to: 'group-management-create' });
// }

if (searchSidebar.children.length > 0) {
  sideBars.push(searchSidebar);
}

// -------------------- User Management
// const userManagementSidebar = {
//   title: 'User Management',
//   icon: { icon: 'mdi-account' },
//   children: [
//     { title: 'View User', to: 'user-management-view-all' },
//     { title: 'Create User', to: 'user-management-create-user' }
//   ]
// };

// if (userManagementSidebar.children.length > 0 && projectTitle !== 'danareksa') {
//   sideBars.push(userManagementSidebar);
// }

export default sideBars
