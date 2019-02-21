

function selectAndCopy(e) {
  e.focus();
  e.select()
  let copyText = e;
  copyText.select();
  document.execCommand("copy");
  toastr.success("data copied");
}

function bytesToHex(buff) {
  return `0x${buff.toString('hex')}`;
}

function hexToBytes(hex) {
  if (hex.substr(0, 2) === '0x') {
    return Buffer.from(hex.substr(2), 'hex');
  }

  return Buffer.from(hex, 'hex');
}

function unixtimeToDate(timestamp) {
	var date = new Date(timestamp*1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var days = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();

	var formattedTime = year + '/' + month + '/' + days + ', ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return formattedTime;
}
