
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

// -------------------- Group Management
const groupManagementSidebar = {
  title: 'Group Management',
  icon: { icon: 'mdi-account-group-outline' },
  children: []
};

if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_group') || priv.hasOwnProperty('view_broadcast')) {
  groupManagementSidebar.children.push({ title: 'View Group', to: 'group-management-view-all' });
}

if (Object.keys(priv).length === 0) {
  groupManagementSidebar.children.push({ title: 'Create Group', to: 'group-management-create' });
}

// if (groupManagementSidebar.children.length > 0) {
//   sideBars.push(groupManagementSidebar);
// }

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
