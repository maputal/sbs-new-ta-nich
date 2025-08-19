import { aes256Decrypt, aes256Encrypt, generateRandomString, hmacSha256Base64 } from '@/plugins/ta_secure/ta_crypto';
import { taSecure_Handshake } from '@/plugins/ta_secure/ta_handshake';


export const taSecure_Login = async (backend_url, username,password) => {
    const handshake_result = await taSecure_Handshake(backend_url);
    if(handshake_result.success){
        try {
            const request_id = generateRandomString(16); // Generate a random 10-character string
            const unix_now = Math.floor(Date.now() / 1000); // Get the current Unix timestamp
            const request_time = unix_now.toString();

            const encToken =  request_time+"."+request_id

            const encKey = hmacSha256Base64(handshake_result.data.secret,btoa(encToken))
            console.log("encToken : ",encToken);
            console.log("encKey : ",encKey);

            const payload = JSON.stringify({
                username,
                password
            })
            console.log("payload : ",payload);
            const encResult = aes256Encrypt(btoa(payload), encKey); // Encrypt the payload
            console.log("encresult : ",encResult);
            const post_data = encResult.ivHex+":"+encResult.encryptedBase64
            console.log("post_data : ",post_data);

            const security_hash = hmacSha256Base64(encKey, btoa(post_data)); // Generate the security hash

            const response = await fetch(backend_url + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TA-Request-Timestamp': request_time,
                'TA-Request-ID': request_id,
                'TA-Ticket-ID': handshake_result.data.ticket_id,
                'TA-Security-HASH': security_hash,
            },
               body: JSON.stringify({ data:post_data  }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            const responseData = await response.json();
            const encryptedResponse = responseData.data;

            if (!encryptedResponse) {
                 new Error('Respons server tidak valid, tidak ada data.');
            }
            // split encryptedResponse pakai ':'
            const encryptedParts = encryptedResponse.split(":");

            if (encryptedParts.length !== 2) {
                throw new Error('Respons server tidak valid, format data tidak valid.');
            }
            const iv_hex = encryptedParts[0];
            const encryptedData_b64 = encryptedParts[1];


            const decryptedResponse_json = aes256Decrypt(iv_hex, encryptedData_b64, encKey);
            console.log('Decrypted Response:', decryptedResponse_json);
            const decryptedResponse = JSON.parse(decryptedResponse_json);

            if (!decryptedResponse["session_salt"]) {
                throw new Error('Respons server tidak valid, session_salt tidak ditemukan.');
            }
            const sessionSalt = decryptedResponse["session_salt"];
            const sessionId = decryptedResponse["session_id"];

            const sessionSecret = hmacSha256Base64(handshake_result.data.secret,btoa(sessionSalt))
            const res =  {
              success: true,
              data: {
                sessionId: sessionId,
                sessionSecret: sessionSecret,
              },
            }
            console.log("res: ",res)
            window.sessionStorage.setItem('session_id', sessionId);
            window.sessionStorage.setItem('session_secret', sessionSecret);
            return res
        } catch (err) {
            console.error("Gagal Login: ", err);
            return { success: false, error: err.message };
        }
    }
}

export const taSecure_POST = async (backend_url, op,param) => {
    try {
        const sessionId = window.sessionStorage.getItem('session_id');
        const sessionSecret = window.sessionStorage.getItem('session_secret');

        const request_id = generateRandomString(16); // Generate a random 10-character string
        const unix_now = Math.floor(Date.now() / 1000); // Get the current Unix timestamp
        const request_time = unix_now.toString();

        const encToken =  request_time+"."+request_id

        const encKey = hmacSha256Base64(sessionSecret,btoa(encToken))
        console.log("encToken : ",encToken);
        console.log("encKey : ",encKey);

        const payload = JSON.stringify({
            op: op,
            param: param,
        })
        console.log("payload : ",payload);
        const encResult = aes256Encrypt(btoa(payload), encKey); // Encrypt the payload
        console.log("encresult : ",encResult);
        const post_data = encResult.ivHex+":"+encResult.encryptedBase64
        console.log("post_data : ",post_data);

        const security_hash = hmacSha256Base64(encKey, btoa(post_data)); // Generate the security hash

        const response = await fetch(backend_url + '/secure/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'TA-Request-Timestamp': request_time,
            'TA-Request-ID': request_id,
            'TA-Session-ID': sessionId,
            'TA-Security-HASH': security_hash,
        },
            body: JSON.stringify({ data:post_data  }),
        });

        const responseData = await response.json();
        console.log("responseData: ",responseData)
        let res = {}

        if (response.ok) {
            // throw new Error(`Server error: ${response.status} ${response.statusText}`);        
            const encryptedResponse = responseData.data;

            if (!encryptedResponse) {
                    new Error('Respons server tidak valid, tidak ada data.');
            }
            // split encryptedResponse pakai ':'
            const encryptedParts = encryptedResponse.split(":");

            if (encryptedParts.length !== 2) {
                throw new Error('Respons server tidak valid, format data tidak valid.');
            }
            const iv_hex = encryptedParts[0];
            const encryptedData_b64 = encryptedParts[1];


            const decryptedResponse_json = aes256Decrypt(iv_hex, encryptedData_b64, encKey);
            console.log('Decrypted Response:', decryptedResponse_json);
            const decryptedResponse = JSON.parse(decryptedResponse_json);

            res =  {
                success: true,
                data:decryptedResponse,
            }
        } else {
            res =  {
                success: false,
                error_message: responseData.error_message,
                error_code: responseData.error_code,
                trace_id: responseData.trace_id,
            }
        }
        console.log("res: ",res)
        return res
    } catch (err) {
        console.error("Gagal POST: ", err);
        console.log("Gagal POST2: ", err);
        return { success: false, error: err.message };
    }
}