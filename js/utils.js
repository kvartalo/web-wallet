

function selectAndCopy(e) {
  e.focus();
  e.select()
  let copyText = e;
  copyText.select();
  document.execCommand("copy");
  toastr.success("data copied");
}
