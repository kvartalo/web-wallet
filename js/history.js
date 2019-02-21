function generateHistoryElement(ownAddr, from, to, value, date) {
	if (from==ownAddr) {
		from="Me";
	} else if (to==ownAddr) {
		to = "Me";
	}
  let html = '';
  html += `
  <li class="list-group-item">
    <a href="#">`
    html += from+`</a> -->`
    html += `<a href="#">`
    html += to+`</a>
	<br>
      <small>`+unixtimeToDate(date)+`</small>
    <div class="float-right">
      <span class="badge color_primary">
      `+ value+` STC</span>
    </div>
  </li>
  `;
  return html;
}


function getHistory(addr) {
	axios.get(RELAYURL + '/history/' + addr)
	  .then(function (res) {
	    console.log(res.data);
	    printHistory(addr, res.data.transfers);
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	  });
}

function printHistory(ownAddr, transfers) {
  let html = '';
  // for(let i=transfers.length-1; i>=0; i--) {
  for(let i=0; i<transfers.length; i++) {
	  if(transfers[i].Value>0) {
		html += generateHistoryElement(ownAddr, transfers[i].From, transfers[i].To, transfers[i].Value, transfers[i].Timestamp);
	  }
  }
  document.getElementById('historyBox').innerHTML = html;
}

function loadHistory() {
	getHistory(myAddr);
}

