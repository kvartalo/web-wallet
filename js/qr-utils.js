let camInitialized = false;

function scanQR() {
  document.getElementById('qrscannerBox').className = 'card';
  if (camInitialized) {
  	return;
  }

  // https://github.com/schmich/instascan
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function (content) {
    console.log('scanned!');
    console.log(content);
    toastr.success(content + " scanned");
    $('#myTab a[href="#send"]').tab('show');
    document.getElementById("toAddr").value = content;
    document.getElementById('qrscannerBox').className = 'card invisible';
  });
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
      camInitialized=true;
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

function cancelScanQR() {
  document.getElementById('qrscannerBox').className = 'card invisible';
}

