let camInitialized = false;
let scanner;
let camera;

function stopScanQR() {
  if (camInitialized) {
    scanner.stop(camera);
    return;
  }
}

function startScanQR() {
  document.getElementById('qrscannerBox').className = 'card';
  if (camInitialized) {
    scanner.start(camera);
    return;
  }

  // https://github.com/schmich/instascan
  scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false });
  scanner.addListener('scan', function (content) {
    console.log('scanned!');
    console.log(content);
    toastr.success(content + " llegit");
    $('#myTab a[href="#send"]').tab('show');
    document.getElementById("toAddr").value = content;
    document.getElementById('toAddr').className = 'form-control';
    document.getElementById('qrscannerBox').className = 'card invisible';
    beep();
    $("#amount").focus()
  });
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      camera = cameras[0];
      scanner.start(camera);
      camInitialized = true;
    } else {
      console.error('No es pot localitzar cap càmara');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

function cancelScanQR() {
  document.getElementById('qrscannerBox').className = 'card invisible';
  document.getElementById('toAddr').className = 'form-control';
}

