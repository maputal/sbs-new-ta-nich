var moffas = moffas || {};

moffas.scram = {};


moffas.scram.generateClientFirst =  function(user) {
    var nonce = moffas.util.generateNonce(16);
    var text ='n,,n='+user+',r='+nonce;
    return [nonce,text];
}

moffas.scram.verifyServerFirst =  function(nonce,serverfirst){
    var s1c = serverfirst.split(',')
    while((i=s1c.shift())!== undefined ) {
        var iname=i.substr(0,1);
        var ival =i.substr(2);
        if (iname == 'r') {
            snonce = ival;
        }
    }
    // check nonce
    n = nonce.length;
    if (nonce != snonce.substr(0,n)) return false;
    return true;
}

moffas.scram.generateClientFinal = function(password,clientfirst,serverfirst) {
    var aeskey;
    var text;
    var ss;

    var c1c = clientfirst.split(',');
    var gh = c1c.shift()+",";
    gh += c1c.shift()+',';
    var c1b = c1c.join(',');
    var s1c = serverfirst.split(',');
    var nonce='';
    var salt = '';
    var iter=4096;

    while((i=s1c.shift())!== undefined ) {
        var iname=i.substr(0,1);
        var ival =i.substr(2);
        if (iname == 's') {
            salt = CryptoJS.enc.Base64.parse(ival);
        }
        else if (iname == 'r') {
            nonce = ival;
        }
        else if (iname == 'i') {
            iter = parseInt(ival);
        }
    }
    var c2 = 'c='+btoa(gh)+',r='+nonce
    var AuthMessage = c1b+','+serverfirst+','+c2;

    var SaltedPassword = null;
    if (password) {
        // console.log("password authentication");
        SaltedPassword = CryptoJS.PBKDF2(password, salt, {
            keySize: 8,
            hasher:     CryptoJS.algo.SHA256,
            iterations: iter
        });
    }
    else {
        // console.log("no password. cannot proceed.");
        return false;
    }

    var sp64 = CryptoJS.enc.Base64.stringify(SaltedPassword);
    // console.log("sp64 : "+sp64);
    var ClientKey = CryptoJS.HmacSHA256("Client Key",SaltedPassword);
    var ck64 = CryptoJS.enc.Base64.stringify(ClientKey);
    var StoredKey = CryptoJS.SHA256(CryptoJS.enc.Base64.parse(ck64));
    var sk64 = CryptoJS.enc.Base64.stringify(StoredKey);
    var ClientSignature = CryptoJS.HmacSHA256(AuthMessage,StoredKey);
    var cs64 = CryptoJS.enc.Base64.stringify(ClientSignature);
    var cp64 = moffas.util.base64xor(ck64,cs64);
    var ServerKey = CryptoJS.HmacSHA256("Server Key",SaltedPassword);
    var svk64 = CryptoJS.enc.Base64.stringify(ServerKey);
    var ServerSignature = CryptoJS.HmacSHA256(AuthMessage,ServerKey);
    var ss64 = CryptoJS.enc.Base64.stringify(ServerSignature);

    text = c2+",p="+cp64,
    ss = ss64;
    var aeskey = CryptoJS.PBKDF2(nonce, SaltedPassword, {
        keySize: 8,
        hasher:     CryptoJS.algo.SHA256,
        iterations: iter
    });
    var aesk64 = CryptoJS.enc.Base64.stringify(aeskey);
    // console.log("aesk : "+aesk64);
    return [text,ss64,aesk64]
}

moffas.scram.verifyServerFinal = function(ss,serverfinal) {
    if (serverfinal == ('v='+ss)) {
        return true;
    } else {
        return false;
    }
}

// =======================================================================//
moffas.scram.start = function (user, auth_type, onSuccess, onError) {
    // console.log("scram.start start.");
    var url = moffas.config.url + "/auth";
    if (moffas.config.dev) {
        url = moffas.config.urldev+ "/auth";
    }


    // console.log(auth_type);

    var res = moffas.scram.generateClientFirst(user);
    var nonce = res[0];
    var clientfirst = res[1];

    var data = {
        "data" : clientfirst,
        "AuthType" : auth_type,
    };

    var jdata = JSON.stringify(data);
    //console.log('First jdata : '+jdata);

    var inError =  function(status,errortext){
        // console.log("inError");
        // console.log("status : "+status);
        // console.log("error text : "+errortext);
        if (status == 400) {
            // console.log("400: malformed request");
            var e = Error("malformed data");
            e.name = "protocolError";
            onError(e);
        }
        else if (status == 401) {
            // console.log("401 : unauthenticated.");
            var e = Error(errortext);
            e.name = "unauthenticated";
            onError(e);
        }
        else if (status == 403) {
            // console.log("403:Denied");
            window.localStorage.removeItem("moffas.token");
            var e = Error(errortext);
            e.name = "rejected";
            onError(e);
        }
        else if (status == "parseerror") {
            // console.log("Invalid response.");
            var e = Error("invalid response");
            e.name = "protocolError";
            onError(e);
        }
        else {
            // console.log("error : "+status+":"+errortext);
            onError(Error("error : "+status+":"+errortext));
        }
    }

    var inSuccess = function(data) {
        // console.log("inSuccess");
        // console.log("data : "+JSON.stringify(data));
        try {
            var success = true;
            var serverfirst = data.response;
            if (moffas.scram.verifyServerFirst(nonce,serverfirst)) {
                // console.log(auth_type);

                window.localStorage.setItem("clientfirst",res[1]);
                window.localStorage.setItem("serverfirst",serverfirst);
                // console.log("first success");
            }
            else {
                // console.log("Invalid Nonce");
                var e = Error("invalid nonce");
                e.name = "protocolError";
                onError(e);
                success = false;
            }
        } catch(err) {
            // console.log("Invalid Response : "+data.response);
            var e = Error("Invalid response");
            e.name = "protocolError";
            onError(e);
            success = false;
        }
        if (success) {
            onSuccess(data);
        }
    }


    // EXECUTE HTTP REQUEST
    var exechttp = function(access_token) {
        var xhr = new XMLHttpRequest();
        var onReady = function() {
            // console.log("xhttp ready state: "+this.readyState.toString());
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = xhr.responseText;
                    var tocontinue = true;
                    // console.log("response :"+response);
                    try {
                        var j = JSON.parse(response);
                    } catch(e) {
                        // console.log(e); // error in the above string (in this case, yes)!
                        tocontinue=false;
                        inError("parseerror",response);
                    }
                    if (tocontinue) {
                        inSuccess(j);
                    }
                }
                else {
                    inError(this.status,xhr.responseText);
                }
            }
        }
        xhr.onreadystatechange = onReady;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("authorization", "Bearer "+access_token);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("Content-encoding", "gzip");
        var head = moffas.util.generateHeader(url,jdata);
        for (var k in head){
            xhr.setRequestHeader(k,head[k]);
        }
        xhr.send(jdata);
    }
    exechttp();
}

// =======================================================================//
moffas.scram.finalize = function (password,payload,onSuccess,onError) {
    // console.log("scram.finalize start.");
    var url = moffas.config.url + "/fin";
    if (moffas.config.dev) {
        url = moffas.config.urldev+ "/fin";
    }

    var clientfirst = window.localStorage.getItem("clientfirst");
    var serverfirst = window.localStorage.getItem("serverfirst");

    var res = null;
    res = moffas.scram.generateClientFinal(password,clientfirst,serverfirst);
    if (!res) {
        var e = Error("authentication Fail");
        e.name = "unauthenticated";
        onError(e);
        return;
    }

    var ss = res[1];
    var aesk64 = res[2];
    var scramdata = res[0];

    var res = moffas.util.encrypt(JSON.stringify(payload),aesk64,'0000');
    var pload = res[0];
    var phash = res[1];
    var data = {
        'seq':'0000',
        'data': scramdata,
        'payload': pload,
        'hash': phash,
        'password' : password,
    }
    var jdata = JSON.stringify(data);
    //console.log("Final jdata : "+jdata);
    var inError = function(status,errortext){
        // console.log("inError");
        // console.log("status : "+status);
        // console.log("error text : "+errortext);
        if (parseInt(status)!= 401) {
            window.localStorage.removeItem("clientfirst");
            window.localStorage.removeItem("serverfirst");
        }
        if (parseInt(status) == 400) {
            // console.log("malformed data");
            var e = Error("Invalid Request");
            e.name = "protocolError";
            onError(e);
        }
        else if (parseInt(status) == 401) {
            // console.log("unauthenticated");
            var e = Error(errortext);
            e.name = "unauthenticated";
            onError(e);
        }
        else if (status == 403) {
            // console.log("Denied");
            var e = Error(errrortext);
            e.name = "rejected";
            onError(e);
        }
        else if (status = "parseerror") {
            // console.log("Invalid response");
            var e = Error("Invalid Response");
            e.name = "protocolError";
            onError(e);
        }
        else {
            var e = Error(status+":"+errortext.toString());
            e.name = "generalError";
            onError(e);
        }
    }

    var inSuccess = function(data) {
        // console.log("inSuccess");
        // console.log("data : "+JSON.stringify(data));

        var serverfinal =data.response;
        var ssfinal = "v="+ss;
        // console.log("server final  : "+serverfinal);
        // console.log("calculated ss : "+ssfinal);
        if (serverfinal == ssfinal) {
            // console.log("final success");

            if ("token" in data) {

                window.localStorage.removeItem("clientfirst");
                window.localStorage.removeItem("serverfirst");

                window.localStorage.setItem("moffas.token",data.token);
                window.localStorage.setItem("moffas.seq","0");
                window.localStorage.setItem("moffas.key",aesk64);
            }
            onSuccess(data);
        }
        else {
            window.localStorage.removeItem("clientfirst");
            window.localStorage.removeItem("serverfirst");

            var e = Error("invalidServerSignature");
            e.name = "protocolError";
            onError(e);
        }
    }

    // EXECUTE HTTP REQUEST
    var exechttp = function(access_token) {
        var xhr = new XMLHttpRequest();
        var onReady = function() {
            // console.log("xhttp ready state: "+this.readyState.toString());
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = xhr.responseText;
                    var tocontinue = true;
                    // console.log("response :"+response);
                    try {
                        var j = JSON.parse(response);
                    } catch(e) {
                        // console.log(e); // error in the above string (in this case, yes)!
                        tocontinue=false;
                        inError("parseerror",response);
                    }
                    if (tocontinue) {
                        inSuccess(j);
                    }
                }
                else {
                    inError(this.status,xhr.responseText);
                }
            }
        }
        xhr.onreadystatechange = onReady;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("authorization", "Bearer "+access_token);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("Content-encoding", "gzip");
        var head = moffas.util.generateHeader(url,jdata);
        for (var k in head){
            xhr.setRequestHeader(k,head[k]);
        }
        xhr.send(jdata);
    }
    exechttp();
}

