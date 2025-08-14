
let sideBars = [{ heading: 'General' }]

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

let projectTitle= moffas.config.project_title || ''

console.log('moffas.config.project_title=', moffas.config.project_title)

if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_dashboard')) {
  sideBars.push({
    title: 'Dashboard',
    icon: { icon: 'mdi-view-dashboard-outline' },
    to: 'dashboard',
  })
}
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_broadcast') && priv.hasOwnProperty('view_template')) {
//   console.log ("masuk view_broadcast")
//   sideBars.push({
//     title: 'Broadcast',
//     icon: { icon: 'mdi-broadcast' },
//     to: 'broadcast-list',
//   })
// }
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_dashboard')) {
//   sideBars.push({
//     title: 'Package Subscription',
//     icon: { icon: 'material-symbols:package' },
//     to: 'package-subscription',
//   })
// }

// -------------------- Customer Interaction
const customerInteractionSidebar = {
  title: 'Customer Interaction',
  icon: { icon: 'mdi-support' },
  children: []
};

customerInteractionSidebar.children.push({ title: 'Ticket List', to: 'support-list' });
// if (Object.keys(priv).length === 0) {
// }

customerInteractionSidebar.children.push(
  { title: 'Customer Information', to: 'support-customer-information' }
);
// if (Object.keys(priv).length === 0) {
// }

// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_conversation')) {
//   console.log("masuk view_chat");
//   customerInteractionSidebar.children.push(
//     { title: 'Conversation List', to: 'support-conversation-list' }
//   );
// }

if (customerInteractionSidebar.children.length > 0) {
  sideBars.push(customerInteractionSidebar);
}

// -------------------- Customer Interaction
const AssignmentSidebar = {
  title: 'Assignment',
  icon: { icon: 'mdi-clipboard-text' },
  children: []
}

if (Object.keys(priv).length === 0) {
  AssignmentSidebar.children.push(
    { title: 'Classification List', to: 'assignment-classification-list' },
    { title: 'Assignment List', to: 'assignment-list' },
    { title: 'Re-Assignment List', to: 'assignment-re-assignment-list' },
  );
}

if (AssignmentSidebar.children.length > 0 && projectTitle !== 'danareksa') {
  sideBars.push(AssignmentSidebar)
}

// -------------------- Department Management
const departmentManagementSidebar = {
  title: 'Department Management',
  icon: { icon: 'mdi-account-group' },
  children: [
    { title: 'View Department', to: 'department-management-view-all-department' },
    { title: 'Create Department', to: 'department-management-create' }
  ]
};

if (departmentManagementSidebar.children.length > 0 && projectTitle !== 'danareksa') {
  sideBars.push(departmentManagementSidebar);
}

// -------------------- Staff Management
const staffManagementSidebar = {
  title: 'Staff Management',
  icon: { icon: 'mdi-account-multiple' },
  children: [
    { title: 'View Staff', to: 'staff-management-view-all' },
    { title: 'Create Staff', to: 'staff-management-create-staff' }
  ]
};

if (staffManagementSidebar.children.length > 0 && projectTitle !== 'danareksa') {
  sideBars.push(staffManagementSidebar);
}

// -------------------- Group Management
const groupManagementSidebar = {
  title: 'Group Management',
  icon: { icon: 'mdi-account-group-outline' },
  children: []
};

if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_group') || priv.hasOwnProperty('view_broadcast')) {
  console.log("masuk view_group");
  groupManagementSidebar.children.push({ title: 'View Group', to: 'group-management-view-all' });
}

if (Object.keys(priv).length === 0) {
  console.log("masuk view_group");
  groupManagementSidebar.children.push({ title: 'Create Group', to: 'group-management-create' });
}

// if (groupManagementSidebar.children.length > 0) {
//   sideBars.push(groupManagementSidebar);
// }

// -------------------- Customer Management
const customerManagementSidebar = {
  title: 'Customer Management',
  icon: { icon: 'mdi-account-group-outline' },
  children: []
};

if (Object.keys(priv).length === 0 ) {
  console.log("masuk view_group");
}
customerManagementSidebar.children.push({ title: 'View Customer', to: 'customer-management-view-all' });

if (Object.keys(priv).length === 0) {
  console.log("masuk view_group");
}
customerManagementSidebar.children.push({ title: 'Create Customer', to: 'customer-management-create' });

if (customerManagementSidebar.children.length > 0 && projectTitle !== 'danareksa') {
  sideBars.push(customerManagementSidebar);
}

// -------------------- User Management
const userManagementChildren = [];

if (priv['view_user'] == 1 || Object.keys(priv).length === 0) {
  userManagementChildren.push({ title: 'View User', to: 'user-management-view-all' });
}

// optionally: create-user permission
// if (priv['create_user'] == 1 || Object.keys(priv).length === 0) {
//   userManagementChildren.push({ title: 'Create User', to: 'user-management-create-user' });
// }

const userManagementSidebar = {
  title: 'User Management',
  icon: { icon: 'mdi-account' },
  children: userManagementChildren,
};

// Then conditionally push:
if (userManagementChildren.length > 0) {
  sideBars.push(userManagementSidebar);
}

export default sideBars