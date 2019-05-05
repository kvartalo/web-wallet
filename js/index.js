var web3 = new Web3(new Web3.providers.HttpProvider(''));
const buf = b => ethUtil.toBuffer(b)
const sha3 = b => web3.utils.soliditySha3(b)
const uint256 = n => "0x"+n.toString(16).padStart(64,'0')
const uint8 = n => "0x"+n.toString(16)



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
	downloadBackup();
}
myAddr = localStorage.getItem("myAddr");
console.log("myAddr", myAddr);


// show myAddr QR
new QRCode(document.getElementById('qrcode'), myAddr);
$("#qrcode > img").css({"margin":"auto"});
// show myAddr
document.getElementById('myAddrBox').value=myAddr;
document.getElementById('myAddrLabel').innerHTML=myAddr.slice(2,9);




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
	let amount = Number(100*Number(document.getElementById("amount").value));
	amount = Number(amount.toFixed(0));
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
				$('.nav-tabs a[href="#history"]').tab('show');
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
	const toAmountStr = $("#amount").val()
	const toAmount = Number(toAmountStr)

	const enabled = (
		toAddr.length > 0
		&& toAmount > 0
		&& toAmount <= myBalance/100
		&& /^[0-9]+((\.)[0-9]{0,2}){0,1}$/.test(toAmountStr)
	);

	$("#sendButton").prop('disabled',!enabled)
}

$("#toAddr").on("change paste keyup", function() {
  onSendDataChanged();
});

$("#amount").on("change paste keyup", function() {
  onSendDataChanged();
});


function onSendTabActivated() {
	document.getElementById("amount").value = "";
	document.getElementById("toAddr").value = "";
	document.getElementById('toAddr').className = 'form-control invisible';
	document.getElementById('toAddr').className = 'form-control invisible';
	document.getElementById('qrscannerBox').className = 'visible';
	startScanQR();
}

function onHistoryTabActivated() {
	getBalance();
	stopScanQR();
}

function onRecieveTabActivated() {
	stopScanQR();
}

function onConfigTabActivated() {
	stopScanQR();
}

function refreshBalance() {
	getBalance();
	setTimeout(function(){
		refreshBalance();
	}, 5000);
}


if (localStorage.getItem("poll_1")) {
	$("#wallet-maincard").show();
	onSendDataChanged();
	refreshBalance();	
} else {
	$("#sendpoll").click( function() {
		const oks =
			($("#poll_q1").val() == 3) + 
			($("#poll_q2").val() == 2) +
			($("#poll_q3").val() == 1) ;

		if (oks == 3) {
			localStorage.setItem("poll_1","done");
			$("#poll-maincard").hide();
			$("#wallet-maincard").show();
			onSendDataChanged();
			refreshBalance();	
		} else {
			alert("Torna-ho a intentar!");
		}
	});	

	$("#poll-maincard").show();
}

/*
	todo
	- web-wallet
		- allow to share address with url
		- add address searcher (to view history of searched address)
	- smart contracts + web-wallet
		- add 2 decimals to smart contract
		- add name/alias to address (in smart contracts)

*/
