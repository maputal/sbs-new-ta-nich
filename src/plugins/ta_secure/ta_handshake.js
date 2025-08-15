import JSEncrypt from 'jsencrypt';
import { hmacSha256Base64, generateRandomString } from './ta_crypto';

// --- BAGIAN KONFIGURASI ---
// Public Key dari Backend Server (ganti dengan public key RSA 2048-bit Anda sendiri)
const backendPublicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2QOYBK5W0XHAHf9lCMNX
qxH62adEKWwuCutZQCUUUxGcWwHIpW9EZTwbv78p9jwJOijAyJM/Ba4b0P3/EWEa
+eiKwoYRxmUNhGrt+g99ad0C8rlXw1RSooq86WJ1LIog+vR4CxGGGvGNspiWZKTe
+dSHoo74DtGWjkgWVI/+yKPcuuOW5ntn+BsROCYI4K0DpSOeal9fpdRM1yxuLHcq
1gnmNEQeP09HzLz115EoG78vpjk/fEfnzTNYvWQR5QclpSijdTW/d82A9v580YVp
SCNLindbz4WwdMCXQTNwq1/OwbWbqTu6O7PKUwrUuN35Oj8yNSBiCcp/1G7EHE54
XuKhe031OGRs5fkGqnBgnJKTYzZoMKUIKNEEat0rGVBWMTpk79Bi5IpLWenP3bxV
o+2FK9ynglthDMslKnDXlCjr+nhViAhNz9eWO/IKd+mYfASXFUOvbI7NuljgI4C8
MXcw4mjnMCOChf6/p6U1c8W1BvpFVwv2hShrcBekdBQI6SkvPjaeiVwafFelfuNC
/t3LE7TSX1h3yREW6MhIGxwIrCYDeBnZFBcQc4MaTUv9yA0MJsaXTE1KXKIWXZ5t
3bKncqErYYnd6GrvdyjT+rtl0HvM9k7Vb0pOO/uyqoSYorCwZm1nWrRn2FoWuZBi
pX1ZvDI6CkSrkfHngBGYorkCAwEAAQ==
-----END PUBLIC KEY-----`;

// URL endpoint server
// --- AKHIR BAGIAN KONFIGURASI ---

/**
 * Fungsi untuk memulai proses RSA handshaking dengan server.
 * Mengenkripsi public key klien dan nonce, mengirimnya ke server,
 * lalu mendekripsi respons server untuk mendapatkan session ID dan secret.
 * @returns {Promise<{success: boolean, data?: {sessionId: string, sessionSecret: string}, error?: string}>}
 */


export const taSecure_Handshake = async (backend_url) => {
  try {
    // 1. Generate key-pair RSA baru untuk sesi klien
    const clientRsa = new JSEncrypt({ default_key_size: 2048 });
    const clientPublicKey = clientRsa.getPublicKey();
    const clientPrivateKey = clientRsa.getPrivateKey();

    // 2. Generate nonce (random string 16 karakter)
    const nonce = generateRandomString(16);
    console.log("Nonce yang dibuat:", nonce);
    console.log("Public Key Klien:", clientPublicKey);

    // 3. Buat payload JSON untuk dienkripsi
    const payloadObject = {
      nonce: nonce,
      pubkey: clientPublicKey,
    };
    const payloadString = JSON.stringify(payloadObject);
    console.log("Payload yang akan dienkripsi:", payloadString);

    // 4. Enkripsi payload menggunakan public key server
    const serverRsa = new JSEncrypt();
    serverRsa.setPublicKey(backendPublicKey);
    const encryptedPayload = serverRsa.encrypt(payloadString);

    if (!encryptedPayload) {
      throw new Error('Gagal mengenkripsi payload dengan public key server.');
    }
    console.log("Payload yang sudah dienkripsi:", encryptedPayload);

    // 5. Kirim data terenkripsi ke server
    const response = await fetch(backend_url + '/auth/handshake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: encryptedPayload }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    const encryptedResponse = responseData.data;

    if (!encryptedResponse) {
      throw new Error('Respons server tidak valid, tidak ada data.');
    }

    // 6. Dekripsi respons dari server menggunakan private key klien
    const decryptedResponseString = clientRsa.decrypt(encryptedResponse);
    if (!decryptedResponseString) {
      throw new Error('Gagal mendekripsi respons server dengan private key klien.');
    }

    const decryptedResponseObject = JSON.parse(decryptedResponseString);
    console.log("Respons yang didekripsi:", decryptedResponseObject);

    // 7. Verifikasi salt dan hash dan kembalikan session info
    const ticket_id = decryptedResponseObject.ticket_id


    const nonce64 = btoa(nonce)
    console.log("nonce64:", nonce64);
    const salt = decryptedResponseObject.salt

    const hash64 = hmacSha256Base64(nonce64,btoa(salt))
    console.log("Hash hasil perhitungan:", hash64);
    console.log("hash dari server: ", decryptedResponseObject.hash)

    if (decryptedResponseObject.hash !== hash64) {
      throw new Error('Nonce dari server tidak cocok. Potensi serangan MITM.');
    }

    return {
      success: true,
      data: {
        secret: hmacSha256Base64(nonce64,hash64),
        ticket_id: ticket_id,
      },
    };

  } catch (err) {
    console.error("Kesalahan Handshake:", err);
    return { success: false, error: err.message };
  }
};
