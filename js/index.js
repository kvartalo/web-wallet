const RELAYURL = 'http://127.0.0.1:3000';

let myAddr = "";
let myBalance = 0;
console.log("l", localStorage.getItem("myAddr"));
if (localStorage.getItem("myAddr")===null) {
	myAddr = newRandKey();
	/*
	 How privK is stored in localStorage:
	 [key] -> [value]
	 'myAddr' -> addr
	 addr -> e(privK)	encrypted by passphrase private key, at this moment is not encrypted
	 */
	localStorage.setItem("myAddr", myAddr);
	toastr.success("New wallet created! Address: " + myAddr);
}
myAddr = localStorage.getItem("myAddr");
console.log("myAddr", myAddr);

function resetWallet() {
	var r = confirm("Your private keys will be lost. Are you sure to reset your wallet?");
	if (r == true) {
	  toastr.info("Starting to reset the wallet");
	  localStorage.clear();
	  location.reload();
	} else {
	  toastr.info("Wallet reset canceled");
	}
}

function newRandKey() {
    const w = ethWallet.generate();
    const privK = w._privKey;
    const address = ethUtil.privateToAddress(privK);
    const addressHex = bytesToHex(address);
    const privKHex = bytesToHex(privK);
    localStorage.setItem(addressHex, privKHex);
    return addressHex;
}

// show myAddr QR
new QRCode(document.getElementById('qrcode'), myAddr);
// show myAddr
document.getElementById('myAddrBox').value=myAddr;

// show current myAddr balance
axios.get(RELAYURL + '/balance/' + myAddr, function(res) {
	myBalance = res.balance;
	document.getElementById('myBalanceBox').value=myBalance;
});

// fake data
let fakeHistoryElems = [
  {
    from: 'Shop 1',
    to: myAddr,
    value: 10,
    date: '2019-01-18, 18.40h'
  },
  {
    from: myAddr,
    to: 'Shop 2',
    value: 2,
    date: '2019-01-18, 19.25h'
  },
  {
    from: myAddr,
    to: 'Shop2',
    value: 1.5,
    date: '2019-01-20, 19.25h'
  },
  {
    from: myAddr,
    to: 'Shop3',
    value: 1.5,
    date: '2019-01-20, 19.40h'
  },
  {
    from: myAddr,
    to: 'Shop1',
    value: 3,
    date: '2019-01-20, 21.35h'
  },
];
printHistory(fakeHistoryElems);


/*
TODO (for minimal version):
- generate mnemonic
- allow mnemonic backup
- allow import mnemonic
- create and sign transactions
- scan QR with cam
*/
