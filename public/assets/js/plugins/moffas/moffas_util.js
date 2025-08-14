var moffas = moffas || {};

moffas.util = {};

moffas.util.Date_toYMD =  function(date) {
	var year, month, day;
	year = String(date.getFullYear());
	month = String(date.getMonth() + 1);
	if (month.length == 1) {
		month = "0" + month;
	}
	day = String(date.getDate());
	if (day.length == 1) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
}

moffas.util.getPosition =  function(onSuccess,onError) {
	// console.log("moffas_getPosition");
	var options = { maximumAge: 60000, timeout: 30000, enableHighAccuracy: true };

	function processLoc(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		var acc = position.coords.accuracy;
		var tstamp = position.timestamp;

		window.localStorage.setItem("curPosLat",""+lat);
		window.localStorage.setItem("curPosLong",""+long);
		window.localStorage.setItem("curPosAcc",""+acc);
		window.localStorage.setItem("curPosTimestamp",""+tstamp);
		// console.log("get Position done!");
		// console.log(position);
		onSuccess(position);
	}

	function onError_i(error) {
		navigator.notification.alert('code: '    + error.code    + '\n' +
		'message: ' + error.message + '\n');
		error.moffas_src = "geolocation";
		onError(error);
	}

	navigator.geolocation.getCurrentPosition(processLoc, onError_i, options);
	// console.log("return from get Position");
}

moffas.util.encrypt = function(msg,aesk64,seq){
  var key = CryptoJS.enc.Base64.parse(aesk64)

  var iv = CryptoJS.lib.WordArray.random(128/8);

  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = /*salt.toString()+ */iv.toString() + encrypted.toString();
  var thash = CryptoJS.HmacSHA256(transitmessage+seq,key);
  var thash64 = CryptoJS.enc.Base64.stringify(thash);
  return [transitmessage,thash64];
};

moffas.util.decrypt = function(transitmessage,aesk64,seq,hash){
  var key = CryptoJS.enc.Base64.parse(aesk64)

  var thash64 = hash;
  chash = CryptoJS.HmacSHA256(transitmessage+seq,key);
  chash64 = CryptoJS.enc.Base64.stringify(chash);
  // console.log("transitmessage : "+transitmessage);
  // console.log("thash : "+thash64);
  // console.log("chash : "+chash64);
  if (thash64 != chash64) {
    return false;
  }

  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
  var encrypted = transitmessage.substring(32);

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  return decrypted;
};


moffas.util.generateNonceEX = function(length,charset) {
  var text = "";
  for(var i = 0; i < length; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
}

moffas.util.base64xor = function (a,b){
  x = atob(a);
  y = atob(b);
  la = x.length;
  lb = y.length;
  if (lb == 0) {
    return a;
  }
  var z = '';
  var i=0;
  var j = 0;
  for (i = 0;i<la;i++) {
    c=String.fromCharCode(x.charCodeAt(i) ^ y.charCodeAt(j));
    j++;
    if (j == lb) {
      j = 0;
    }
    z+=c;
  }
  return btoa(z);
}

moffas.util.generateNonce = function(length) {
    var text = "";
    var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

moffas.util.generateHeader = function(url,body) {
    var tstamp = new Date().toISOString();
    var l = document.createElement("a");
    l.href = url;
    var URL = l.pathname;
    var tots = URL+tstamp+moffas.config.api_key+body.replace(/\s/g,'');
    
    var sig =CryptoJS.SHA256(tots);
    var sigx = sig.toString(CryptoJS.enc.Hex);
    var head = {
        "URL" : URL,
        "BDI-Timestamp" : tstamp,
        "BDI-Key" : moffas.config.bdi_key,
        "BDI-Signature" : sigx,
    };
    return head;
}
