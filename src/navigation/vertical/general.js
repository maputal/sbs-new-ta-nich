
let sideBars = [{ heading: 'General' }]

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

let projectTitle= moffas.config.project_title || ''

console.log('moffas.config.project_title=', moffas.config.project_title)

sideBars.push({
  title: 'Dashboard',
  icon: { icon: 'mdi-view-dashboard-outline' },
  to: 'dashboard',
})
// if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_dashboard')) {
// }

if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_broadcast') && priv.hasOwnProperty('view_template')) {
  sideBars.push({
    title: 'Group',
    icon: { icon: 'mdi-group' },
    to: 'group-management',
  })
}

if (Object.keys(priv).length === 0 || priv.hasOwnProperty('view_broadcast') && priv.hasOwnProperty('view_template')) {
  sideBars.push({
    title: 'Manual Activation',
    icon: { icon: 'mdi-form-textbox' },
    to: 'manual-activation',
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

// -------------------- Package Sidebar
const packageSidebar = {
  title: "Package",
  icon: { icon: "material-symbols:package" },
  children: [],
}

packageSidebar.children.push({
  title: "Create Package",
  to: "package-create",
})

packageSidebar.children.push({
  title: "List Package",
  to: "package-list",
})

if ((Object.keys(priv).length === 0 || priv.hasOwnProperty("view_dashboard")) && packageSidebar.children.length > 0) {
  sideBars.push(packageSidebar);
}

if (customerInteractionSidebar.children.length > 0) {
  sideBars.push(customerInteractionSidebar);
}


// -------- Settings Sidebar
const settingsSidebar = {
  title: 'Settings',
  icon: { icon: "mdi-cog" },
  children: [],
}

settingsSidebar.children.push({
  title: 'Retry Settings',
  to: 'settings-retry',
})

settingsSidebar.children.push({
  title: 'Alert Settings',
  to: 'settings-alert',
})

settingsSidebar.children.push({
  title: 'Upload Data HLR',
  to: 'settings-hlr-upload',
})

settingsSidebar.children.push({
  title: 'Wording Editor',
  to: 'settings-wording-editor',
})

if (settingsSidebar.children.length > 0) {
  sideBars.push(settingsSidebar)
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
