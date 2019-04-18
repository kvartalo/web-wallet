let fakeVotingData = [
	{
		question: "Option A or B?",
		options: [
			"a",
			"b"
		]
	},
	{
		question: "Rice or Macaroni?",
		options: [
			"rice",
			"macaroni",
			"both",
			"nop"
		]
	}
];

// this will be getted from an url
let votingData = {};

function printEvents(el) {
	let html = "";
	html += `<p>Votacions en curs:</p>`;
	html += `<div class="list-group">`;
	for (let i=0; i<el.length; i++) {
		html += `
	  <a onclick="showEvent(`+ i +`)" href="#" class="list-group-item list-group-item-action">
			<i class="fa fa-file-text-o" aria-hidden="true"></i> ` + el[i].question + `
	  </a>
	  `;
	}
	html += `</div>`;
	document.getElementById("governance-box").innerHTML = html;
}

function onGovernanceTabActivated() {
	votingData = fakeVotingData;
	printEvents(votingData);
}

function showEvent(id) {
	let html = "";
	html += `<div onclick="onGovernanceTabActivated()" class="btn outline_primary">Back</div>
		<br><br>`;

	html += `<p><b>` + votingData[id].question + `</b></p>`;
	for(let i=0; i<votingData[id].options.length; i++) {
	html += `
	<div class="funkyradio">
	  <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios`+i+`" value="` + votingData[id].options[i] + `">
	  <label class="form-check-label" for="exampleRadios`+i+`">
	    `+ votingData[id].options[i] +`
	  </label>
	</div>
	`;
	}
	html += `<br><br>`;
	html += `<div onclick="emitVote()" class="btn color_primary float-right">Vote!</div>`;

	document.getElementById("governance-box").innerHTML = html;
}

function emitVote() {

}
