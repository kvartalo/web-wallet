function generateHistoryElement(ownAddr, from, to, value, date) {
	if (from==ownAddr) {
		from="Jo";
	} else if (to==ownAddr) {
		to = "Jo";
	}
	if (from.length == 42) {
		from = from.slice(2,8)+"…"+from.slice(36)
	}
	if (to.length == 42) {
		to = to.slice(2,8)+"…"+to.slice(36)
	}


  let html = '';
  html += `
  <li class="list-group-item">
    <a href="#">`
    html += from+`</a> → `
    html += `<a href="#">`
    html += to+`</a>
	<br>
      <small>`+unixtimeToDate(date)+`</small>
    <div class="float-right">
      <span class="badge color_primary">
			`;

	if (to=="Jo") {
	      html += '+' + value;
	} else {
	      html += '-' + value;
	}
      html += ` KVT</span>
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
	    generateHistoryChart(addr, res.data.transfers);
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	  });
}

function printHistory(ownAddr, transfers) {
  let html = '';
  for(let i=0; i<transfers.length; i++) {
	  if(transfers[i].Value>0) {
		html += generateHistoryElement(ownAddr, transfers[i].From, transfers[i].To, transfers[i].Value, transfers[i].Timestamp);
	  }
  }
  document.getElementById('historyBox').innerHTML = html;
}

function generateHistoryChart(ownAddr, transfers) {
	// prepare data
	let ab = 0; // acumulated balance
	let data = {
		labels: [],
		datasets: [{
			steppedLine: true,
			data: [],
			borderColor: [
				'#5ae1cd'
			]
		}]
	};
	for(let i=transfers.length-1; i>=0; i--) {
		if(transfers[i].Value>0) {
			// data.datasets[0].label = "saldo";
			if (transfers[i].From==ownAddr) {
				ab = ab - transfers[i].Value;
			} else if (transfers[i].To==ownAddr) {
				ab = ab + transfers[i].Value;
			}
			data.labels.push(unixtimeToDate(transfers[i].Timestamp));
			data.datasets[0].data.push(ab);

		}
	}

	// print chart
	var ctx = document.getElementById("historyChart").getContext('2d');
	var options= {
		legend : {
		  display: false
		},
		scales: {
			xAxes: [
				{
					display: false
				}
			],
		  yAxes: [
		    {
		      ticks: {
		        beginAtZero: true
		      }
		    }
		  ]
		}
	};
	var myLineChart = new Chart(ctx, {
	    type: 'line',
	    data: data,
	    options: options
	});
}

function loadHistory() {
	getHistory(myAddr);
	getBalance();
}
