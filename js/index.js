const myAddr = '0xabcd0123456789';

function scanQR() {
  document.getElementById('qrscannerBox').className = 'card';
  // https://github.com/schmich/instascan
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function (content) {
    console.log('scanned!');
    console.log(content);
  });
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

function generateHistoryElement(from, to, value, date) {
  let html = '';
  html += `
  <li class="list-group-item">
    <a href="#">`+from+`</a> --> <a href="#">`+to+`</a>
    <div class="float-right">
      <small>`+date+`</small>
      <span class="badge color_primary">`+value+` STC</span>
    </div>
  </li>
  `;
  return html;
}

function printHistory(elems) {
  let html = '';
  for(let i=elems.length-1; i>=0; i--) {
        html += generateHistoryElement(elems[i].from, elems[i].to, elems[i].value, elems[i].date);
  }
  document.getElementById('historyBox').innerHTML = html;
}

// fake data
let fakeHistoryElems = [
  {
    from: 'Ciutat invisible',
    to: '0xabcd0123456789',
    value: 10,
    date: '2019-01-18, 18.40h'
  },
  {
    from: '0xabcd0123456789',
    to: 'Kop de mà',
    value: 2,
    date: '2019-01-18, 19.25h'
  },
  {
    from: '0xabcd0123456789',
    to: 'Lleialtat-Bar',
    value: 1.5,
    date: '2019-01-20, 19.25h'
  },
  {
    from: '0xabcd0123456789',
    to: 'Lleialtat-Bar',
    value: 1.5,
    date: '2019-01-20, 19.40h'
  },
  {
    from: '0xabcd0123456789',
    to: 'Can Batlló',
    value: 3,
    date: '2019-01-20, 21.35h'
  },
];


new QRCode(document.getElementById('qrcode'), myAddr);
document.getElementById('addressBox').value=myAddr;

printHistory(fakeHistoryElems);
