function resetWallet() {
	var r = confirm("Si no has fet una còpia de seguretat no podràs recuperar la cartera. Estàs segur d'esborrar la memòria?");
	if (r == true) {
	  toastr.info("Generant una nova cartera");
	  localStorage.clear();
	  location.reload();
	} else {
	  toastr.info("Heu cancel·lat. Wallet reset canceled");
	}
}

function generateKeysMnemonic(mnemonic) {
	if (mnemonic == undefined) {
		mnemonic = bip39.generateMnemonic();
	}

	const root = hdkey.fromMasterSeed(mnemonic);
	const masterPrivateKey = root.privateKey;
	const masterPubKey = root.publicKey;
	var path = "m/44'/60'/0'/0/0";
	const addrNode = root.derive(path);
	let privK = addrNode._privateKey;
	const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
	let address = ethUtil.privateToAddress(addrNode._privateKey);
	let addressHex = bytesToHex(address);
	let privKHex = bytesToHex(privK);
	localStorage.setItem(addressHex, privKHex);

	return {address: addressHex, mnemonic: mnemonic};
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
