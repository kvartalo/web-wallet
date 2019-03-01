
function showSeed() {
	if (localStorage.getItem("myAddr")===null) {
		window.location.assign("/");
	} 
	let mySeed = localStorage.getItem("mySeed");
	console.log("mySeed", mySeed);

	document.getElementById("seed").innerHTML = mySeed;
}


function importSeed() {
	var seed = document.getElementById("seed").value;

	let obj = generateKeysMnemonic(seed);

	console.log(obj);
	localStorage.setItem("myAddr", obj.address);
	localStorage.setItem("mySeed", obj.mnemonic);
	console.log("seed", obj.mnemonic);
	toastr.success("Nova cartera creada! Adreça: " + obj.address);

	window.location.assign("/");
}
