var web3 = new Web3(new Web3.providers.HttpProvider(''));
const buf = b => ethUtil.toBuffer(b)
const sha3 = b => web3.utils.soliditySha3(b)
const uint256 = n => "0x"+n.toString(16).padStart(64,'0')
const uint8 = n => "0x"+n.toString(16)

const RELAYURL = 'https://rkv.tukutu.xyz';
const TOKENADDR = '0x224FA23ff195C3Acb4A5ea41D2a5295ebe87A0fe';

let myAddr = "";
let myBalance = 0;
let myNonce = 0;

console.log("myAddr", localStorage.getItem("myAddr"));
console.log("mySeed", localStorage.getItem("mySeed"));
if (localStorage.getItem("myAddr")===null) {
	// myAddr = newRandKey();
	let obj = generateKeysMnemonic();
	/*
	 How privK is stored in localStorage:
	 [key] -> [value]
	 'myAddr' -> addr
	 addr -> e(privK)	encrypted by passphrase private key, at this moment is not encrypted
	 */
	localStorage.setItem("myAddr", obj.address);
	localStorage.setItem("mySeed", obj.mnemonic);
	console.log("seed", obj.mnemonic);
	toastr.success("Nova cartera creada! Adreça: " + obj.address);
}
myAddr = localStorage.getItem("myAddr");
console.log("myAddr", myAddr);


// show myAddr QR
new QRCode(document.getElementById('qrcode'), myAddr);
// show myAddr
document.getElementById('myAddrBox').value=myAddr;
document.getElementById('myAddrLabel').innerHTML=myAddr.slice(2,9);

function getBalance() {
	console.log("recuperant saldo");
	document.getElementById('spinnerBalance').className = 'spinner-border';
	// show current myAddr balance
	axios.get(RELAYURL + '/balance/' + myAddr)
	  .then(function (res) {
	    myBalance = Number(res.data.balance);
	    console.log(res.data);
	    console.log("balance " + myBalance);
	    document.getElementById('myBalanceBox').innerHTML=myBalance;
	    document.getElementById('spinnerBalance').className += 'invisible';
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	    document.getElementById('spinnerBalance').className += 'invisible';
	  });
}


function transact() {
	let toAddr = document.getElementById("toAddr").value;
	if(toAddr==undefined) {
		toastr.error("adreça invàlida");
		return;
	}
	if(toAddr=="") { // TODO check also if it's a valid eth address
		toastr.error("adreça invàlida");
		return;
	}
	let amount = Number(document.getElementById("amount").value);
	if(amount>myBalance) {
		toastr.error("no hi ha prou saldo");
		return;
	}
	if(amount<=0) {
		toastr.error("la quantitat no es correcte");
		return;
	}
	document.getElementById('spinnerTx').className = 'spinner-border';
	axios.get(RELAYURL + '/tx/nonce/' + myAddr)
	  .then(function (res) {
		    myNonce = res.data.nonce;
		    console.log(res.data);
		    console.log("myNonce " + myNonce);
		  // after getting nonce, generate & sign & send transaction
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
		    toastr.success("transferència realitzada");
			  document.getElementById('spinnerTx').className += 'invisible';
		  })
		  .catch(function (error) {
		    console.log(error);
		    toastr.error(error);
		    document.getElementById('spinnerTx').className += 'invisible';
		  })

	  }) // nonce get error catch
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	    document.getElementById('spinnerTx').className += 'invisible';
	  })
}

function onSendDataChanged() {

	const toAddr = $("#toAddr").val()
	const toAmount = Number($("#amount").val())

	const enabled = (
		toAddr.length > 0
		&& toAmount > 0
		&& toAmount <= myBalance
	);

	$("#sendbutton").prop('disabled',!enabled)
}

$("#toAddr").on("change paste keyup", function() {
  onSendDataChanged();
});

$("#amount").on("change paste keyup", function() {
  onSendDataChanged();
});

function onSendTabActivated() {
	$('#amountlabel').val("Quantitat ("+myBalance+"KVT disponibles)")
	document.getElementById("amount").value = "";
	document.getElementById("toAddr").value = "";
	document.getElementById('toAddr').className = 'form-control invisible';
	document.getElementById('toAddr').className = 'form-control invisible';
	document.getElementById('qrscannerBox').className = 'visible';
	startScanQR();
}

function onHistoryTabActivated() {
	loadHistory()
	stopScanQR();
}

function onRecieveTabActivated() {
	stopScanQR();
}

function onConfigTabActivated() {
	stopScanQR();
}


onSendDataChanged();
loadHistory();
getBalance();

/*
	todo
	- web-wallet
		- allow to share address with url
		- add address searcher (to view history of searched address)
	- smart contracts + web-wallet
		- add 2 decimals to smart contract
		- add name/alias to address (in smart contracts)

*/
