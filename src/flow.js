let joinStr = '_flowEval'
let codeSplit = []
let stepData = []
let stepindex = 0
import {JSHINT} from 'jshint'
import esparse from './esparse'
export default function init(code) {
  initData()
  codeSplit = code.split(/\n|\r|\r\n/)
  let parseMsg = esparse(code)
  let checkCodeArray = aopFunc(code.split(/\n|\r|\r\n/),parseMsg)
  run(checkCodeArray,code)
  return oredrBackData(stepData, codeSplit)
}

function checkJsKeyWord(array) {
  let backArray = []
  array.forEach((word)=> {
    let check = keyWordReg.test(word)
    if (!check) {
      backArray.push(word)
    }
  })
  return backArray
}

function run(codeLineArray,code) {
  let codeStr = codeLineArray.join('\n')
    window.eval(codeStr)

}



function joint(words, index) {
  words = clearString(words).unique()
  let str = ""
  words.forEach((word)=> {
    let me = `${joinStr}('${word}',${word},${index-1})`
    str+=';;try{'+me+'}catch(_$_){};;'
  })
  return str
}


function _flowEval(name, word, index) {
  stepindex += 1
  stepData.push({name, word, index, stepindex})
}
window._flowEval = _flowEval
function aopFunc(codeArray,dataArr){
  console.log(codeArray)
  console.log(dataArr)
  dataArr.forEach(function(item){
    let str = joint(item.words,item.end.line)
    codeArray[item.end.line - 1] = codeArray[item.end.line - 1].instertByIndex(str,item.end.column)
  })
  return codeArray
}

function oredrBackData(stepData, lineCode) {
  let back = []
  lineCode.forEach((item, index) => {
    back.push({
      code: item,
      data: []
    })
    stepData.forEach((itemStepData, stepIndex) => {
      if (index === itemStepData.index) {
        back[index].data.push(itemStepData)
      }
    })
  })
  return back
}

function removeNullInArray(array){
  let backarray = []
  array.forEach((item)=>{
    if (item) {
      backarray.push(item)
    }
  })
  return backarray
}

function initData() {
  codeSplit = []
  stepData = []
  stepindex = 0
}

function clearString(words) {
  let newWords = []
  words.forEach((word)=> {
    if (word.indexOf('"') == 0 || word.indexOf("'") == 0) {
    } else {
      newWords.push(word)
    }
  })
  return newWords
}

String.prototype.instertByIndex = function (str, index) {
  if(index>this.length){
    return ''
  }
  let before = this.substring(0,index)
  let after = this.substring(index)
  return `${before}${str}${after}`
}




Array.prototype.unique = function () {
  var res = [];
  var json = {};
  for (var i = 0; i < this.length; i++) {
    if (!json[this[i]]) {
      res.push(this[i]);
      json[this[i]] = 1;
    }
  }
  return res;
}

Array.prototype.del=function(index){
  if(isNaN(index)||index>=this.length){
    return false;
  }
  for(var i=0,n=0;i<this.length;i++){
    if(this[i]!=this[index]){
      this[n++]=this[i];
    }
  }
  this.length-=1;
}

