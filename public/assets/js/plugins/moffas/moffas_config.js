var moffas = moffas || {}

// moffas.build_production = true untuk build di prod, false untuk build di dev
moffas.build_production = false
moffas.config = {}


moffas.config.dev = {
  url: 'https://servobot.tel-access.com/portal-be',
  urldev: 'https://servobot.tel-access.com/portal-be',
  url_backoffice_helper_api: 'https://servobot.tel-access.com/backoffice-helper-crm/',
  param_company_id: 1,
  project_title: 'danareksa',
  dev: false,
  version_footer: 'V0.1.1.0',
  fields_to_show: ['response', 'sales', 'ao_code'],
  fields_to_keep_on_desc: ['sales', 'email', 'clcode', 'note'],
  options_contact_type: [
    {
      title: 'Address',
      value: 'address',
    },
    {
      title: 'Phone Number',
      value: 'phone_number',
    },
    {
      title: 'Email',
      value: 'email',
    },
  ],
  listOfResponseCustomer: [
    {
      title: 'Interested',
      value: 1
    },
    {
      title: 'Not Interested',
      value: 2
    },
    {
      title: 'Follow Up Again',
      value: 3
    },
  ],
}

if(moffas.build_production === true) {
  // moffas.config = moffas.config.prod
} else {
  moffas.config = moffas.config.dev
}