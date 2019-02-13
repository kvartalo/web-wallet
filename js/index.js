const RELAYURL = 'http://127.0.0.1:3000';
const TOKENADDR = '0x9BD08b875A9Bf7Fc6889390bE4704458cD695074';

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

function getBalance() {
	console.log("getting balance");
	// show current myAddr balance
	axios.get(RELAYURL + '/balance/' + myAddr)
	  .then(function (res) {
	    myBalance = res.data.balance;
	    console.log(res.data);
	    console.log("balance " + myBalance);
	    document.getElementById('myBalanceBox').innerHTML=myBalance;
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	  });
}

let myNonce = 0;
function getTxNonce() {
	axios.get(RELAYURL + '/tx/nonce/' + myAddr)
	  .then(function (res) {
	    myNonce = res.data.nonce;
	    console.log(res.data);
	    console.log("myNonce " + myBalance);
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	  })
}

var web3 = new Web3(new Web3.providers.HttpProvider('https://testnet-rpc.gochain.io'));
const buf = b => ethUtil.toBuffer(b)
const sha3 = b => web3.utils.soliditySha3(b)
const uint256 = n => "0x"+n.toString(16).padStart(64,'0')
const uint8 = n => "0x"+n.toString(16)
function transact() {
	let toAddr = document.getElementById("toAddr").value;
	if(toAddr==undefined) {
		toastr.error("no valid address");
		return;
	}
	if(toAddr=="") { // TODO check also if it's a valid eth address
		toastr.error("no valid address");
		return;
	}
	let amount = document.getElementById("amount").value;
	if(amount>myBalance) {
		toastr.error("not enough tokens");
		return;
	}
	if(amount<=0) {
		toastr.error("not valid amount");
		return;
	}
        let msg = "0x" + buf(uint8(0x19)).toString('hex') + buf(uint8(0)).toString('hex') + buf(TOKENADDR).toString('hex') + buf(uint256(myNonce)).toString('hex') + buf(myAddr).toString('hex') + buf(toAddr).toString('hex') + buf(uint256(amount)).toString('hex')
	let privK = localStorage.getItem(myAddr);
        let sig = ethUtil.ecsign(buf(sha3(msg)),buf(privK));
	let txData = {
		from: myAddr,
		to: toAddr,
		value: Number(amount),
		r: sig.r.toString('hex'),
		s: sig.s.toString('hex'),
		v: sig.v
	};
	console.log(txData);
	axios.post(RELAYURL + '/tx', txData)
	  .then(function (res) {
	    console.log(res.data);
	    toastr.success("transaction created");
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	  })
}

getBalance();
getTxNonce();


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
