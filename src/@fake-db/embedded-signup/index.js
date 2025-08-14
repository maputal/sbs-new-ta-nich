import mock from '@/@fake-db/mock'

mock.onPost('/embeddedsignup').reply(request => {
  const { accessToken } = JSON.parse(request.data)

  // If not any of data is missing return 400
  if (!(accessToken))
    return [400]


  const errors = {
    accessToken: !accessToken ? ['Access Token Not Found'] : null
  }

  if (!errors.accessToken) {
    const response = {
      accessToken,
    }

    return [200, response]
  }
  
  return [400, { error: errors }]
})
