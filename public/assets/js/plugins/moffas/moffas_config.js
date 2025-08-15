var moffas = moffas || {}

// moffas.build_production = true untuk build di prod, false untuk build di dev
moffas.build_production = false
moffas.config = {}


moffas.config.dev = {
  url: 'https://servobot.tel-access.com/portal-be',
  urldev: 'https://servobot.tel-access.com/portal-be',
  url_backoffice_helper_api: 'https://servobot.tel-access.com/backoffice-helper-crm/',
  param_company_id: 1,
  dev: false,
  project_title: '',
  fields_to_keep_on_desc: ['sales', 'email', 'clcode', 'note'],
  version_footer: 'V0.1.2.0',
}

if(moffas.build_production === true) {
  // moffas.config = moffas.config.prod
} else {
  moffas.config = moffas.config.dev
}