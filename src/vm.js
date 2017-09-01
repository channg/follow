import Vue from 'vue'
import $ from 'jquery'
import hljs from 'highlight.js'
export default new Vue({
  el:'#view',
  data: {
    message: 'Hello Vue!',
    showData: [
    ],
    codeEditShow: true,
    step: 1,
    codeIndex: 0,
    toIndexModel:[],
    err:{}
  },
  methods: {
    test(){
    },
    run(){
      this.codeEditShow = false
      this.$nextTick(function () {
        $('.hightlight code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
        $('.code-div .p').each(function(i, block) {
          hljs.highlightBlock(block);
        });
      })
    },
    toEdit(){
      this.step = 1
      this.codeEditShow = true
    },
    checkIsThisLine(item) {
      let backClass = " "
      let codeIndex = this.codeIndex
      item.data.forEach((step)=>{
        if(step.stepindex === this.step) {
          backClass = 'showdown'
          codeIndex = step.index
        }
      })
      this.codeIndex = codeIndex
      return backClass
    },
    trans(word) {
      console.log(word)
      if(typeof word === 'function') {
        let func = ""
        func = word.toString().replace(/;;try\{_flowEval\('[a-z0.9A-Z_$]*?',[a-z0.9A-Z_$]*?,[0-9]+\)\}catch\(_\$_\)\{\};;/g,'');
        return func
      }else if(typeof word === 'string'){
        return `'${word}'`
      }
      if(typeof word === 'undefined') {
        return 'undefined'
      }
      if(typeof word== 'object'){
        let objStr = `{\n`
        for(let params in word) {
          objStr+=`  ${params}:${word.params}\n`
        }
        objStr+=`\n}`
        if(word.toString() == '[object Arguments]'){
          let objStr = `{\n`
          Array.prototype.forEach.call(word, function (item,index) {
            item = item.toString().replace(/;;try\{_flowEval\('[a-z0.9A-Z_$]*?',[a-z0.9A-Z_$]*?,[0-9]+\)\}catch\(_\$_\)\{\};;/g,'');
            objStr+=`    ${index} : ${item}\n`
          })
          objStr+=`}`
          return objStr
        }
      }
      return word
    },
    nextStep(){
      if(this.step>=this.maxStepIndex){
        return
      }
      this.step++
      this.$nextTick(function () {
        $('.hightlight code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
      })
    },
    backStep(){
      if(this.step <= 1) {
        return
      }
      this.step--
      this.$nextTick(function () {
        $('.hightlight code').each(function(i, block) {
          hljs.highlightBlock(block);
        });

      })
    },
    isShowStepText(item){
      let show = false
      item.data.forEach((stepData)=>{
        if(stepData.stepindex == this.step){
          show = true
        }
      })
      return show
    },
    toAnyStep(item) {
      $('#doc-modal-1').modal('open')
      this.toIndexModel = item.data
    },
    goAnyStep(step){
      this.step = step.stepindex
      $('#doc-modal-1').modal('close')
      $('#doc-oc-demo2').offCanvas('open')

    }
  },
  computed: {
    lineComp(){
      if(this.showData[this.codeIndex]){
        if(this.showData[this.codeIndex].data){
          return this.showData[this.codeIndex].data
        }
      }
      return []
    },
    linePopOutherStep(){
      let backArray = []
      this.lineComp.forEach((step)=>{
        if(step.stepindex === this.step) {
          backArray.push(step)
        }
      })
      return backArray
    },
    linePopBeforeStep(){
      let backArray = []
      let that = this
      if(that.step>1){
        that.showData.forEach(function (item) {
          item.data.forEach(function (step) {
            if(step.stepindex === that.step-1 ){
              backArray.push(step)
            }
          })
        })
      }
      return backArray
    },
    steps(){
      return this.step
    },
    nowStepData(){
      let backObj = {}
      this.showData.forEach((lineData)=>{
        lineData.data.forEach((stepObj)=>{
          if(stepObj.stepindex === this.step){
            backObj = stepObj
          }
        })
      })
      return backObj
    },
    maxStepIndex(){
      let max = 1
      this.showData.forEach((lineData)=>{
        lineData.data.forEach((stepObj)=>{
          if(stepObj.stepindex > max){
            max = stepObj.stepindex
          }
        })
      })
      return max
    }
  }
})