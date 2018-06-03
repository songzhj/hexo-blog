var AlloyFlow=function(d){this.start_time=null;this.workflow=d.workflow;this.wf_len=this.workflow.length;this.timer=null;this.interval=d.interval||15;this.onStart=d.onStart||function(){};this.onProgress=d.onProgress||function(){};this.onEnd=d.onEnd||function(){};if(typeof this.workflow[0]==="function"){this.stopSeries=false;this.isSeries=true;this.workIndex=0}else{var c=0,a,b;for(;c<this.wf_len;c++){var e=this.workflow[c].start;if(typeof e!=="number"){a=0;b=e.length;for(;a<b;a++){this.workflow.splice(c,0,{work:this.workflow[c].work,start:e[a]})}c+=b;this.workflow.splice(c--,1);this.wf_len--;this.wf_len+=b}}this.workflow.sort(function(g,f){return g.start-f.start});this.maxTime=this.workflow[this.wf_len-1].start}};AlloyFlow.prototype={start:function(){this.onStart();if(this.isSeries){this.stopSeries=false;this.workIndex=0;this._startSeries();return}var a=this;this._forEach(this.workflow,function(b){b.done=false});this.start_time=new Date();clearInterval(this.timer);this.timer=setInterval(function(){a._forEach(a.workflow,function(b){var c=new Date()-a.start_time;if(c>=b.start){if(!b.done){b.done=true;b.work.call(a,c);a.onProgress()}else{if(c>a.maxTime+a.interval+a.interval){clearInterval(a.timer);a.onEnd()}}}})},this.interval)},_startSeries:function(){this.workflow[this.workIndex].call(this)},_forEach:function(b,d){if(Array.prototype.forEach){return b.forEach(d)}var c=0,a=b.length;for(;c<a;c++){d(b[c])}},stop:function(){if(this.isSeries){this.stopSeries=true}else{clearInterval(this.timer)}},gotoTime:function(a){this.start_time=new Date(new Date().getTime()-a);this._forEach(this.workflow,function(b){if(b.start>a){b.done=false}})},gotoIndex:function(a){this.workIndex=a;if(this.stopSeries){return}this.workflow[this.workIndex].apply(this,arguments);this.onProgress();if(this.workIndex===this.wf_len-1){this.workIndex=0;this.stopSeries=true;this.onEnd()}},next:function(c,b){if(arguments.length===2){var a=this;setTimeout(function(){a._nextTask(c)},b)}else{this._nextTask(c)}},callback:function(){this._nextTask.apply(this,arguments)},_nextTask:function(){if(this.stopSeries){return}this.workIndex++;this.workflow[this.workIndex].apply(this,arguments);this.onProgress();if(this.workIndex===this.wf_len-1){this.workIndex=0;this.stopSeries=true;this.onEnd()}}};if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=AlloyFlow};