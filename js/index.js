var web3 = new Web3(new Web3.providers.HttpProvider('https://testnet-rpc.gochain.io'));
const buf = b => ethUtil.toBuffer(b)
const sha3 = b => web3.utils.soliditySha3(b)
const uint256 = n => "0x"+n.toString(16).padStart(64,'0')
const uint8 = n => "0x"+n.toString(16)

const RELAYURL = 'http://127.0.0.1:3000';
const TOKENADDR = '0x9BD08b875A9Bf7Fc6889390bE4704458cD695074';

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
	toastr.success("New wallet created! Address: " + obj.address);
}
myAddr = localStorage.getItem("myAddr");
console.log("myAddr", myAddr);


// show myAddr QR
new QRCode(document.getElementById('qrcode'), myAddr);
// show myAddr
document.getElementById('myAddrBox').value=myAddr;

function getBalance() {
	console.log("getting balance");
	document.getElementById('spinnerBalance').className = 'spinner-border';
	// show current myAddr balance
	axios.get(RELAYURL + '/balance/' + myAddr)
	  .then(function (res) {
	    myBalance = res.data.balance;
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
		    toastr.success("transaction created");
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

getBalance();


/*
TODO (for minimal version):
- scan QR with cam
- better UX flow
*/
