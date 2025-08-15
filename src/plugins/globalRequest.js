// globalRequest.js
import { taSecure_POST } from '@/plugins/ta_secure/ta_secure';

const backend_url = 'https://your-backend.com/api'; // 🔁 Set your actual backend here

// Main exported function
export default function globalRequest(type='taSecure_POST', op, params, onSuccess, onError) {
  console.log(`[globalRequest] ${type} Running: ${op}`, params);

  if (type === 'taSecure_POST') {
    taSecure_POST(backend_url, op, params)
      .then((res) => {
        onSuccess(JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error(`[globalRequest] Error`, err);
        if (onError) onError(err);
      });
  } else if (type === 'taSecure_GET') {
    taSecure_GET(backend_url, op, params)
      .then((res) => {
        onSuccess(JSON.stringify(res.data));
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