import $ from 'jquery'
import flow from './flow'
import vm from './vm'
import amazei from 'amazeui'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
$('#code').keydown(function(e){
  onKeyDown(e)
})

function onKeyDown(e) {
  if (e.keyCode === 9) { // tab key
    e.preventDefault();  // this will prevent us from tabbing out of the editor

    // now insert four non-breaking spaces for the tab key
    var editor = document.getElementById("code");
    var doc = editor.ownerDocument.defaultView;
    var sel = doc.getSelection();
    var range = sel.getRangeAt(0);

    var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  if (e.keyCode === 13) { // tab key
    e.preventDefault();  // this will prevent us from tabbing out of the editor

    // now insert four non-breaking spaces for the tab key
    var editor = document.getElementById("code");
    var doc = editor.ownerDocument.defaultView;
    var sel = doc.getSelection();
    var range = sel.getRangeAt(0);

    var tabNode = document.createTextNode("\n");
    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
var editor = CodeMirror($('#codemirror-pre').get(0),{
  value: `var length = 10;
function fn() {
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);`,
  mode:  "javascript"
});

$('.run').click(function(){
  console.log(editor.getValue())
  vm.run()
  let jscode = editor.getValue()
  let data = flow(jscode)
  vm.showData = data
})
$('.edit').click(function(){
  vm.toEdit()
})




