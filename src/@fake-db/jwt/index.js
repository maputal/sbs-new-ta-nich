import mock from '@/@fake-db/mock'


// TODO: Use jsonwebtoken pkg
// ℹ️ Created from https://jwt.io/ using HS256 algorithm
// ℹ️ We didn't created it programmatically because jsonwebtoken package have issues with esm support. View Issues: https://github.com/auth0/node-jsonwebtoken/issues/655
const userTokens = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.fhc3wykrAnRpcKApKhXiahxaOe8PSHatad31NuIZ0Zg',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mn0.cat2xMrZLn0FwicdGtZNzL7ifDTAKWB0k1RurSWjdnw',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6M30.PGOfMaZA_T9W05vMj5FYXG5d47soSPJD1WuxeUfw4L4',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NH0.d_9aq2tpeA9-qpqO0X4AmW6gU2UpWkXwc04UJYFWiZE',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NX0.ocO77FbjOSU1-JQ_BilEZq2G_M8bCiB10KYqtfkv1ss',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nn0.YgQILRqZy8oefhTZgJJfiEzLmhxQT_Bd2510OvrrwB8',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6N30.KH9RmOWIYv_HONxajg7xBIJXHEUvSdcBygFtS2if8Jk',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OH0.shrp-oMHkVAkiMkv_aIvSx3k6Jk-X7TrH5UeufChz_g',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OX0.9JD1MR3ZkwHzhl4mOHH6lGG8hOVNZqDNH6UkFzjCqSE',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTB9.txWLuN4QT5PqTtgHmlOiNerIu5Do51PpYOiZutkyXYg',
]


// ❗ These two secrets shall be in .env file and not in any other file
// const jwtSecret = 'dd5f3089-40c3-403d-af14-d0c228b05cb4'
const database = [
  {
    "approver": 0,
    "privileges": {
      "category_edit": 1,
      "report_settlement_xls": 1,
      "merchant_req_list": 1,
      "merchant_bulk_upload": 1,
      "merchant_close": 1,
      "print_qr": 1,
      "role_pdf": 1,
      "merchant_unblock": 1,
      "merchant_xls": 1,
      "notification_pdf": 1,
      "fee_transaction": 1,
      "nmid_update": 1,
      "group_pdf": 1,
      "report_settlement_pdf": 1,
      "customer_unblock": 1,
      "role_xls": 1,
      "group_view": 1,
      "notification_edit": 1,
      "mdr_create": 1,
      "content_edit": 1,
      "group_xls": 1,
      "update_nmid": 1,
      "group_edit": 1,
      "user_view": 1,
      "report_settlement_view": 1,
      "merchant_edit": 1,
      "user_xls": 1,
      "qr_generator": 1,
      "security_edit": 1,
      "merchant_create": 1,
      "category_create": 1,
      "role_delete": 1,
      "customer_xls": 1,
      "security_xls": 1,
      "report_qr_issuer": 1,
      "user_audit": 1,
      "report_qr_issuer_pdf": 1,
      "role_edit": 1,
      "merchant_view": 1,
      "report_customer_view": 1,
      "notification_view": 1,
      "manual_credit_acquirer": 1,
      "notification_xls": 1,
      "report_customer_pdf": 1,
      "content_view": 1,
      "customer_pdf": 1,
      "report_qr_issuer_xls": 1,
      "security_pdf": 1,
      "content_category": 1,
      "role_view": 1,
      "user_block": 1,
      "content_create": 1,
      "report_customer_xls": 1,
      "merchant_request_edit": 1,
      "merchant_log": 1,
      "system_setting": 1,
      "user_edit": 1,
      "customer_log": 1,
      "security_view": 1,
      "customer_block": 1,
      "merchant_request_view": 1,
      "mdr_edit": 1,
      "manual_credit_issuer": 1,
      "user_pdf": 1,
      "fee_transaction_view": 1,
      "customer_view": 1,
      "content_category_edit": 1,
      "role_create": 1,
      "mdr_view": 1,
      "report_qr_acquirer_pdf": 1,
      "merchant_reset_pin": 1,
      "system_setting_edit": 1,
      "report_merchant_xls": 1,
      "role_update": 0,
      "customer_upgrade": 1,
      "system_management": 1,
      "content_xls": 1,
      "report_qr_acquirer_xls": 1,
      "user_create": 1,
      "merchant_block": 1,
      "system_settings_edit": 1,
      "report_merchant_pdf": 1,
      "security_create": 1,
      "report_merchant_view": 1,
      "report_qr_acquirer": 1,
      "group_create": 1,
      "category_view": 1,
      "customer_resetpin": 1,
      "notification_create": 1,
      "customer_close": 1,
      "fee_transaction_edit": 1,
      "email_qr": 1,
      "content_pdf": 1,
      "merchant_pdf": 1
    },
    "role": 18,
    "nik": "123456882",
    "role_text": "Admin praMaster",
    "phone": "08129999999990",
    "cost_center": "313213123",
    "kode_cabang": "123123123",
    "function": 0,
    "name": "sangmaker",
    "id": 1,
    "function_text": "maker",
    "email": "sangmaker@gmail.com",
    "status": "active",
    "default_page": "/",
    "password": 'admin',
  },
]

//override data mockup auth login
mock.onPost('/auth/login').reply(request => {
  const { email, password } = JSON.parse(request.data)
  let errors = {
    email: ['Something went wrong'],
  }
  const user = database.find(u => u.email === email && u.password === password)
  if (user) {
    try {
      const accessToken = userTokens[user.id]

      // We are duplicating user here
      const userData = { ...user }

      const userOutData = Object.fromEntries(Object.entries(userData)
        .filter(([key, _]) => !(key === 'password')))

      const response = {
        accessToken,
        userData: userOutData,
      }


      //   const accessToken = jwt.sign({ id: user.id }, jwtSecret)
      return [200, response]
    }
    catch (e) {
      errors = { email: [e] }
    }
  }
  else {
    errors = {
      email: ['Email or Password is Invalid'],
    }
  }
  
  return [400, { errors }]
})
mock.onPost('/auth/register').reply(request => {
  const { username, email, password } = JSON.parse(request.data)

  // If not any of data is missing return 400
  if (!(username && email && password))
    return [400]
  const isEmailAlreadyInUse = database.find(user => user.email === email)
  const isUsernameAlreadyInUse = database.find(user => user.username === username)

  const errors = {
    password: !password ? ['Please enter password'] : null,
    email: (() => {
      if (!email)
        return ['Please enter your email.']
      if (isEmailAlreadyInUse)
        return ['This email is already in use.']
      
      return null
    })(),
    username: (() => {
      if (!username)
        return ['Please enter your username.']
      if (isUsernameAlreadyInUse)
        return ['This username is already in use.']
      
      return null
    })(),
  }

  if (!errors.username && !errors.email) {
    // Calculate user id
    const { length } = database
    let lastIndex = 0
    if (length)
      lastIndex = database[length - 1].id
    lastIndex += 1

    const userData = {
      id: lastIndex,
      email,
      password,
      username,
      fullName: '',
      role: 'admin',
      abilities: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
    }

    console.log('userData :>> ', userData)
    database.push(userData)

    const accessToken = userTokens[userData.id]
    const { password: _, abilities, ...user } = userData

    const response = {
      userData: user,
      accessToken,
      userAbilities: abilities,
    }

    return [200, response]
  }
  
  return [400, { error: errors }]
})
