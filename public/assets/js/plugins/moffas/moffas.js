var moffas = moffas || {}
moffas.data = moffas.data || {}
if(moffas.build_production === true){
  console.log = function () {}
}

moffas.do_async_request = async function (op, reqpayload, onSuccess, onError) {
  console.log('do_request : ' + op)
  var payload = JSON.stringify(reqpayload)

  var url = moffas.config.url + '/do'
  if (moffas.config.dev) {
    url = moffas.config.urldev + '/do'
  }
  var token = window.localStorage.getItem('moffas.token')
  var iseq = parseInt(window.localStorage.getItem('moffas.seq')) + 1
  window.localStorage.setItem('moffas.seq', iseq)
  var aesk64 = window.localStorage.getItem('moffas.key')
  var seq = iseq.toString(16)
  // console.log("Do start!");
  // console.log("Op : " + op);
  // console.log("seq : " + seq);
  console.log("plain payload op '" + op + "': " + payload)

  //var pstr = JSON.stringify(payload);
  var imsg = { op: op, seq: seq, payload: payload }
  var pstr = JSON.stringify(imsg)
  var res = moffas.util.encrypt(pstr, aesk64, seq)
  var epload = res[0]
  var hash64 = res[1]
  // console.log("payload : "+pstr);
  // console.log("encrypted payload : [" + res[0] + "]");
  // console.log("hash : " + res[1]);

  var msg = { token: token, seq: seq, payload: epload, hash: hash64 }
  var jdata = JSON.stringify(msg)
  // console.log("msg : " + jdata);

  var inError = function (status, errortext) {
    // console.log("inError");
    // console.log(status);
    // console.log(errortext);
    var jerr = {
      status: status,
      errortext: errortext,
    }
    onError(jerr)
  }

  var inSuccess = function (data) {
    console.log('inSuccess')
    console.log(JSON.stringify(data))
    // moffas.data.unmid_count = data.unmid_count
    // moffas.data.task_count = data.task_count
    // moffas.data.pten_count = data.pten_count
    // console.log('unmid_count : ' + moffas.data.unmid_count)
    // console.log('task_count : ' + moffas.data.task_count)
    // console.log('pten_count : ' + moffas.data.pten_count)
    var hash64 = data.hash
    var pload = moffas.util
      .decrypt(data.payload, aesk64, seq, hash64)
      .toString(CryptoJS.enc.Utf8)
    if (pload) {
      // console.log("payload : " + payload);
      console.log("data op '" + op + "':" + pload)
      onSuccess(pload)
    } else {
      // console.log("invalid hash : "+hash64);
      var e = Error('Invalid Hash')
      e.name = 'protocolError'
      onError(e)
    }
  }

  // EXECUTE HTTP REQUEST
  var exechttp = function () {
    var xhr = new XMLHttpRequest()
    var onReady = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var response = xhr.responseText
          var tocontinue = true
          // console.log("response :" + response);
          try {
            var j = JSON.parse(response)
          } catch (e) {
            // console.log(e); // error in the above string (in this case, yes)!
            tocontinue = false
            inError('parseerror', response)
          }
          if (tocontinue) {
            inSuccess(j)
          }
        } else {
          inError(this.status, xhr.responseText)
        }
      }
    }
    xhr.onreadystatechange = onReady
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    var head = moffas.util.generateHeader(url, jdata)
    for (var k in head) {
      xhr.setRequestHeader(k, head[k])
    }
    xhr.send(jdata)
  }
  exechttp()
}

moffas.do_request = function (op, reqpayload, onSuccess, onError) {
  console.log('do_request : ' + op)
  var payload = JSON.stringify(reqpayload)

  var url = moffas.config.url + '/do'
  if (moffas.config.dev) {
    url = moffas.config.urldev + '/do'
  }
  var token = window.localStorage.getItem('moffas.token')
  var iseq = parseInt(window.localStorage.getItem('moffas.seq')) + 1
  window.localStorage.setItem('moffas.seq', iseq)
  var aesk64 = window.localStorage.getItem('moffas.key')
  var seq = iseq.toString(16)
  // console.log("Do start!");
  // console.log("Op : " + op);
  // console.log("seq : " + seq);
  console.log("plain payload op '" + op + "': " + payload)

  //var pstr = JSON.stringify(payload);
  var imsg = { op: op, seq: seq, payload: payload }
  var pstr = JSON.stringify(imsg)
  var res = moffas.util.encrypt(pstr, aesk64, seq)
  var epload = res[0]
  var hash64 = res[1]
  // console.log("payload : "+pstr);
  // console.log("encrypted payload : [" + res[0] + "]");
  // console.log("hash : " + res[1]);

  var msg = { token: token, seq: seq, payload: epload, hash: hash64 }
  var jdata = JSON.stringify(msg)
  // console.log("msg : " + jdata);

  var inError = function (status, errortext) {
    // console.log("inError");
    // console.log(status);
    // console.log(errortext);
    var jerr = {
      status: status,
      errortext: errortext,
    }
    onError(jerr)
  }

  var inSuccess = function (data) {
    console.log('inSuccess')
    console.log(JSON.stringify(data))
    // moffas.data.unmid_count = data.unmid_count
    // moffas.data.task_count = data.task_count
    // moffas.data.pten_count = data.pten_count
    // console.log('unmid_count : ' + moffas.data.unmid_count)
    // console.log('task_count : ' + moffas.data.task_count)
    // console.log('pten_count : ' + moffas.data.pten_count)
    var hash64 = data.hash
    var pload = moffas.util
      .decrypt(data.payload, aesk64, seq, hash64)
      .toString(CryptoJS.enc.Utf8)
    if (pload) {
      // console.log("payload : " + payload);
      console.log("data op '" + op + "':" + pload)
      onSuccess(pload)
    } else {
      // console.log("invalid hash : "+hash64);
      var e = Error('Invalid Hash')
      e.name = 'protocolError'
      onError(e)
    }
  }

  // EXECUTE HTTP REQUEST
  var exechttp = function () {
    var xhr = new XMLHttpRequest()
    var onReady = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var response = xhr.responseText
          var tocontinue = true
          // console.log("response :" + response);
          try {
            var j = JSON.parse(response)
          } catch (e) {
            // console.log(e); // error in the above string (in this case, yes)!
            tocontinue = false
            inError('parseerror', response)
          }
          if (tocontinue) {
            inSuccess(j)
          }
        } else {
          inError(this.status, xhr.responseText)
        }
      }
    }
    xhr.onreadystatechange = onReady
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.setRequestHeader('Content-encoding', 'gzip')
    var head = moffas.util.generateHeader(url, jdata)
    for (var k in head) {
      xhr.setRequestHeader(k, head[k])
    }
    xhr.send(jdata)
  }
  exechttp()
}

moffas.login_start = function (userid, onProceed, onUnauth, onDenied, onError) {
  window.localStorage.clear()
  // console.log("moffas login");
  var inError = function (err) {
    // console.log("error : "+err.toString());

    if (err.name == 'rejected') {
      onDenied()
    } else if (err.name == 'unauthenticated') {
      onUnauth()
    } else {
      onError(err)
    }
  }
  var inProceed = function (data) {
    // console.log("Proceed : "+data.toString());
    onProceed(data)
  }
  moffas.scram.start(userid, 'login', inProceed, inError)
}

moffas.fin = function (password, payload, onSuccess, onWrongPassword, onError) {
  var inError = function (err) {
    // console.log("Error : "+JSON.stringify(err));
    if (err.name == 'unauthenticated') {
      onWrongPassword()
    } else {
      onError(err)
    }
  }
  var inSuccess = function (data) {
    if ('token' in data) {
      // console.log("auth success.");
      onSuccess(data)
    } else {
      onError(data)
    }
  }
  moffas.scram.finalize(password, payload, inSuccess, inError)
}

moffas.logout = function (onDone) {
  var onD = function () {
    window.localStorage.clear()
    window.location = ''
    onDone()
  }
  moffas.do_request('logout', '{}', onD, onD)
  //var onS = function(){}
  //var onE = function(){}
}
