// globalRequest.js
import { taSecure_Login, taSecure_POST } from '@/plugins/ta_secure/ta_secure';

const backend_url = window.$config?.backend_url || ''
const backend_url_login = window.$config?.backend_url_login || ''
console.log('backend_url=', backend_url)
console.log('backend_url_login=', backend_url_login)

// Main exported function
export default function globalRequest(type='taSecure_POST', op, params, onSuccess, onError) {
  console.log(`[globalRequest] ${type} Running: ${op}`, params);

  if (type === 'taSecure_POST') {
    taSecure_POST(backend_url, op, params)
      .then((res) => {
        console.log('[globalRequest] taSecure_POST response', res)
        if(res && res.data){
          onSuccess(JSON.stringify(res.data));
        } else {
          onSuccess(JSON.stringify(res))
        }
      })
      .catch((err) => {
        console.error(`[globalRequest] taSecure_POST Error`, err);
        if (onError) onError(err);
      });
  } else if (type === 'taSecure_GET') {
    taSecure_GET(backend_url, op, params)
      .then((res) => {
        console.log('[globalRequest] taSecure_GET response', res)
        if(res && res.data){
          onSuccess(JSON.stringify(res.data));
        } else {
          onSuccess(JSON.stringify(res))
        }
      })
      .catch((err) => {
        console.error(`[globalRequest] taSecure_GET Error`, err);
        if (onError) onError(err);
      });
  } else if (type === 'taSecure_Login') {
    const { username, password } = params;
    taSecure_Login(backend_url_login, username, password)
      .then((res) => {
        onSuccess(res);
      })
      .catch((err) => {
        console.error(`[globalRequest] Error`, err);
        if (onError) onError(err);
      });

  } else if (type === 'window.moffas.do_request') {
    window.moffas.do_request(
      op,
      params,
      res => onSuccess(res),
      err => {
        console.error(`[globalRequest] Error`, err);
        if (onError) onError(err);
      }
    )
  }
}