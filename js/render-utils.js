
function generateHistoryElement(from, to, value, date) {
  let html = '';
  html += `
  <li class="list-group-item">
    <a href="#">`+from+`</a> --> <a href="#">`+to+`</a>
    <div class="float-right">
      <small>`+date+`</small>
      <span class="badge color_primary">`+value+` STC</span>
    </div>
  </li>
  `;
  return html;
}

function printHistory(elems) {
  let html = '';
  for(let i=elems.length-1; i>=0; i--) {
        html += generateHistoryElement(elems[i].from, elems[i].to, elems[i].value, elems[i].date);
  }
  document.getElementById('historyBox').innerHTML = html;
}
