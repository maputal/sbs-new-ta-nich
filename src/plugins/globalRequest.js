// globalRequest.js
import { taSecure_POST } from '@/plugins/ta_secure/ta_secure';

const backend_url = 'https://your-backend.com/api'; // 🔁 Set your actual backend here

function dummyResponse(op, params, onSuccess) {
  console.warn(`[globalRequest] Dummy mode for: ${op}`);
  const dummyData = {
    data: [
      { group_id: 1, group_name: 'Dummy Group 1' },
      { group_id: 2, group_name: 'Dummy Group 2' },
    ],
    total_data: 2
  };
  setTimeout(() => {
    onSuccess(JSON.stringify(dummyData));
  }, 500);
}

// Main exported function
export default function globalRequest(type, op, params, onSuccess, onError) {
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
      onSuccess, 
      onError
    )
      .then((res) => {
        onSuccess(JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error(`[globalRequest] Error`, err);
        if (onError) onError(err);
      });
  }else {
    dummyResponse(op, params, onSuccess);
  }
}