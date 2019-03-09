let camInitialized = false;
let scanner;
let cameras;
let cameraIndex;

function stopScanQR() {
  if (camInitialized) {
    scanner.stop(cameras[cameraIndex]);
    return;
  }
}

function startScanQR() {
  document.getElementById('qrscannerBox').className = 'card';

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
    $("#amount").focus()
  });
  Instascan.Camera.getCameras().then(function (_cameras) {
    cameras = _cameras;
    if (_cameras.length > 0) {
      cameraIndex = cameras.length - 1;
      scanner.start(cameras[cameraIndex]);
      camInitialized = true;
      if (cameras.length > 1) {
        $("#changeCameraButton").removeClass("invisible") 
      }
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
  $("#changeCameraButton").addClass("invisible") 
  stopScanQR();
}

function changeCameraButton() {
  stopScanQR()
  cameraIndex = (cameraIndex+1)%cameras.length;
  scanner.start(cameras[cameraIndex]);
}