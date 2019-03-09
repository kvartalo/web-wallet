
function downloadBackup() {
	// get data
	let mySeed = localStorage.getItem('mySeed');
	let data = btoa(mySeed);
	var d = new Date();
	let filename = `kvartalo-`
		+ d.getFullYear()
		+ `-`
		+ (Number(d.getMonth())+Number(1))
		+ `-`
		+ d.getDate()
		+ `_`
		+ d.getHours()
		+ `h`
		+ d.getMinutes()
		+ `m`
		+ `.backup`;

	// download data
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function uploadBackup() {
	console.log("upload backup");
	// document.getElementById('uploadForm').click();
	console.log("a");
	let f = document.getElementById('backup-upload').files[0];
	console.log(f);
	var r = new FileReader();

	r.onload = function(e) {
		var contents = e.target.result;
		console.log( "Got the file.n"
		      +"name: " + f.name + "n"
		      +"type: " + f.type + "n"
		      +"size: " + f.size + " bytesn"
		      + "starts with: " + contents.substr(1, contents.indexOf("n"))
		);
		console.log(contents);
		console.log(atob(contents));
		importSeed(atob(contents));
	}
	r.readAsText(f);

}


function showSeed() {
	if (localStorage.getItem("myAddr")===null) {
		window.location.assign("/");
	}
	let mySeed = localStorage.getItem("mySeed");
	console.log("mySeed", mySeed);

	document.getElementById("seed").innerHTML = mySeed;
}


function importInputSeed() {
	var seed = document.getElementById("seed-input").value;
	importSeed(seed);
}

function importSeed(seed) {
	let obj = generateKeysMnemonic(seed);

	console.log(obj);
	localStorage.setItem("myAddr", obj.address);
	localStorage.setItem("mySeed", obj.mnemonic);
	console.log("seed", obj.mnemonic);
	toastr.success("Nova cartera creada! Adreça: " + obj.address);

	window.location.assign("/");
}
