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
  value: `var A = '((112 + 2) * (32 + (43 + 45 - 46) * 12))';
var expression = RPN(init_expression(A))
function is_op(val) {
    var op_string = '+-*/()';
    return op_string.indexOf(val) > -1;
}

function init_expression(expression) {
    var expression = expression.replace(/\s/g, ''),
        input_stack = [];
    input_stack.push(expression[0]);
    for (var i = 1; l = expression.length, i<l; i++) {
        if (is_op(expression[i]) || is_op(input_stack.slice(-1))) {
            input_stack.push(expression[i]);
        } else {
            input_stack.push(input_stack.pop()+expression[i]);
        }
    }
    return input_stack;
}

function op_level (op) {
    if (op == '+' || op == '-') {
        return 0;
    }
    if (op == '*' || op == '/') {
        return 1;
    }
    if (op == '(') {
        return 3;
    }
    if (op == ')') {
        return 4;
    }
}

function RPN (input_stack) {
    var out_stack = [], op_stack = [], match = false, tmp_op;
    while (input_stack.length > 0 ) {
        var sign = input_stack.shift();
        if (!is_op(sign)) {
            out_stack.push(sign);
        } else if (op_level(sign) == 4) {
            match = false;
            while (op_stack.length > 0 ) {
                tmp_op = op_stack.pop();
                if ( tmp_op == '(') {
                    match = true;
                    break;
                } else {
                    out_stack.push(tmp_op);
                }
            }
            if (match == false) {
                return 'lack left';
            }
        } else {
            while ( op_stack.length > 0 && op_stack.slice(-1) != '(' && op_level(sign) <= op_level(op_stack.slice(-1))) {
                out_stack.push(op_stack.pop());
            }
            op_stack.push(sign);
        }
    }
    while (op_stack.length > 0 ){
        var tmp_op = op_stack.pop();
        if (tmp_op != '(') {
            out_stack.push(tmp_op);
        } else {
            return 'lack right';
        }
    }
    return out_stack;
}

function cal(expression) {
    var i, j,
        RPN_exp = [],
        ans;
    while (expression.length > 0) {
        var sign = expression.shift();
        if (!is_op(sign)) {
            RPN_exp.push(sign);
        } else {
            j = parseFloat(RPN_exp.pop());
            i = parseFloat(RPN_exp.pop());
            RPN_exp.push(cal_two(i, j, sign));
        }
    }
    return RPN_exp[0];
}

function cal_two(i, j, sign) {
    switch (sign) {
        case '+':
            return i + j;
            break;
        case '-':
            return i - j;
            break;
        case '*':
            return i * j;
            break;
        case '/':
            return i / j;
            break;
        default:
            return false;
    }
}



if (expression == 'lack left' || expression == 'lack right') {
    console.log(expression);
} else {
    console.log(cal(expression));
}`,
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




