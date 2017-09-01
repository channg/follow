var esprima = require('esprima');
let allPasre = []
export default function (code) {
  allPasre = []
  let parse = esprima.parseScript(code,{loc: true}, function (item) {
    if(item.type=='ExpressionStatement'){
      beforeExpressionStatement(item)
    }
  });
  toParse(parse)
  return allPasre
}

function toParse(parse, notAss){
  if(parse){
    if(parse.type === 'Program') {
      parseProgram(parse)
    }else if(parse.type === 'VariableDeclaration') {
      parseVariableDeclaration(parse)
    }else if(parse.type === 'ExpressionStatement') {
      parseExpressionStatement(parse)
    }else if(parse.type === 'AssignmentExpression') {
      parseAssignmentExpression(parse, notAss)
    }else if(parse.type === 'FunctionDeclaration') {
      parseFunctionDeclaration(parse)
    }else if(parse.type === 'BlockStatement') {
      parseBlockStatement(parse)
    }else if(parse.type === 'ObjectExpression') {
      parseObjectExpression(parse)
    }else if(parse.type === 'Property') {
      parseProperty(parse)
    }else if(parse.type === 'FunctionExpression') {
      parseFunctionExpression(parse)
    }else if(parse.type === 'ArrowFunctionExpression') {
      parseFunctionExpression(parse)
    }else if(parse.type === 'IfStatement') {
      parseIfStatement(parse)
    }else if(parse.type === 'ForStatement') {
      parseForStatement(parse)
    }else if(parse.type === 'WhileStatement') {
      parseWhileStatement(parse)
    }else if(parse.type === 'VariableDeclarator') {
      parseVariableDeclarator(parse)
    }else if(parse.type === 'ArrayExpression') {
      parseArrayExpression(parse)
    }else if(parse.type === 'CallExpression') {
      parseCallExpression(parse)
    }else if(parse.type === 'SwitchStatement') {
      parseSwitchStatement(parse)
    }else if(parse.type === 'SwitchCase') {
      parseSwitchCase(parse)
    }else if(parse.type === 'NewExpression') {
      parseNewExpression(parse)
    }
  }
}
function getWords(parse,array) {
  if(parse.type== 'Identifier') {
    array.push(parse.name)
  }else if(parse.type== 'VariableDeclarator') {
    toParse(parse.init)
    getWords(parse.id, array)
  }else if(parse.type== 'CallExpression') {
    if(parse.arguments&&parse.arguments.length>0){
      parse.arguments.forEach(function(item){
        getWords(item,array)
      })
    }
    getWords(parse.callee,array)
  }else if(parse.type === 'MemberExpression') {
    getWords(parse.object,array)
  }else if (parse.type === 'BinaryExpression') {
    getWords(parse.left, array)
    getWords(parse.right, array)
  }else if (parse.type === 'VariableDeclaration') {
    if(parse.declarations&&parse.declarations.length>0){
      parse.declarations.forEach(function (item) {
        getWords(item, array)
      })
    }
  }else if (parse.type === 'UpdateExpression') {
    if(parse.argument){
      getWords(parse.argument,array)
    }
  }
}

function parseVariableDeclaration(parse) {

  let end = parse.loc.end
  let words = []
  if(parse.declarations&&parse.declarations.length>0) {
    parse.declarations.forEach((item) => {
      toParse(item)
      getWords(item,words)
    })
  }
  if(words.length>0){
    allPasre.push({words,end})
  }
}


function parseAssignmentExpression(parse, notAss) {
  if(parse.left){
    toParse(parse.left)
  }
  if(parse.right){
    toParse(parse.right)
  }
  if (notAss) {

  }else {
    let end = parse.loc.end
    let words = []
    getWords(parse.left,words)
    getWords(parse.right,words)
    if(words.length>0){
      allPasre.push({words,end})
    }
  }
}

function parseFunctionDeclaration(parse){
  setFunctionParams(parse)
  let end = parse.loc.end
  let words = []
  getWords(parse.id,words)
  allPasre.push({words,end})
  if(parse.body) {
    toParse(parse.body)
  }
}

function parseProgram(parse) {
  if(parse.body&&parse.body.length > 0) {
    parse.body.forEach((item)=>{
      toParse(item)
    })
  }
}

function parseBlockStatement(parse) {
  if(parse.body&&parse.body.length > 0) {
    parse.body.forEach((item)=>{

      toParse(item)
    })
  }
}

function parseObjectExpression(parse){
  if(parse.properties&&parse.properties.length>0) {
    parse.properties.forEach(function(item){
      toParse(item)
    })
  }
}

function parseProperty (parse) {
  toParse(parse.value)
}

function setFunctionParams(parse){
  let end = parse.body.loc.start
  end.column += 1
  let words = ['arguments']
  if(parse.params&&parse.params.length>0) {
    parse.params.forEach(function(item){
      // getWords(item, words)
    })
  }
  if(words.length>0){
    allPasre.push({words,end})
  }
}

function parseFunctionExpression(parse){
  setFunctionParams(parse)
  if(parse.body) {
    toParse(parse.body)
  }
}

function parseIfStatement(parse){
  let end = parse.consequent.loc.start
  end.column += 1
  let words = []
  getWords(parse.test,words)

  if(parse.consequent){
    toParse(parse.consequent)
  }
  if(parse.alternate){
    toParse(parse.alternate)
  }
  if(words.length>0){
    allPasre.push({words,end})
  }
}

function parseExpressionStatement(parse){
  toParse(parse.expression)
  let end = parse.loc.end
  let words = []
  getWords(parse.expression,words)
  if(words.length>0){
    allPasre.push({words,end})
  }
  // beforeExpressionStatement(parse)
}

function parseForStatement(parse) {
  let end = parse.body.loc.start
  end.column += 1
  let words = []
  getWords(parse.init,words)
  if(parse.body){
    toParse(parse.body)
  }
  if(words.length>0){
    allPasre.push({words,end})
  }
}

function parseWhileStatement(parse){
  let end = parse.body.loc.start
  end.column += 1
  let words = []
  getWords(parse.test,words)
  if(parse.body){
    toParse(parse.body)
  }
  if(words.length>0){
    allPasre.push({words,end})
  }
}

function parseVariableDeclarator(parse) {
  if(parse.init){
    toParse(parse.init)
  }
}

function parseArrayExpression(parse){
  if(parse.elements&&parse.elements.length>0) {
    parse.elements.forEach(function (item) {
      toParse(item)
    })
  }
}
function parseCallExpression(parse) {
  if(parse.arguments&&parse.arguments.length>0){
    parse.arguments.forEach(function (item) {
      toParse(item)
    })
  }
}
function parseSwitchStatement(parse) {
  if(parse.cases&&parse.cases.length>0){
    parse.cases.forEach(function (item) {
      toParse(item)
    })
  }
}

function parseSwitchCase (parse) {
  if(parse.consequent&&parse.consequent.length>0){
    parse.consequent.forEach(function (item) {
      toParse(item)
    })
  }
}
function parseNewExpression(parse){
  let notAss = true
  if(parse.arguments&&parse.arguments.length>0){
    parse.arguments.forEach(function (item) {
      toParse(item, notAss)
    })
  }
}

function beforeExpressionStatement(parse){
  let end = parse.loc.start
  let words = ['__enter__']
  if(words.length>0){
    allPasre.push({words,end,before:true})
  }
}