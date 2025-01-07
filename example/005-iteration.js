// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

// Examples: Iterators ------------------ //

import Util from '../api/util.js';
import log from '../api/logger.js';

// a famous problem 
// variables in looping scope are broken in delayed callbacks. 
for(var i=0;i<5;++i){
	setTimeout(()=>{
		log.Warn('bad loop: '+i);
	},100);
}

// usually, such as this CRAZY coding for avoid the problem. 
for(var i=0;i<5;++i){
	((i_)=>{
		setTimeout(()=>{
			log.Notice('good loop: '+i_);
		},100);
	})(i);
}

// SafeStepIter() is masking the CRAZY coding. 
Util.SafeStepIter(0,5,1,(i)=>{
	setTimeout(()=>{
		log.Info('safe loop: '+i);
	},100);
});

// can backword 
Util.SafeStepIter(0,-5,-2,(i)=>{
	setTimeout(()=>{
		log.Info('back skip loop: '+i);
	},100);
});

// return false to break safe loop.
Util.SafeStepIter(0,5,1,(i)=>{
	setTimeout(()=>{
		log.Info('braking in the safe loop: '+i);
	},100);
	return i<3;
});

// unstoppable iterations are blocked. 
Util.SafeStepIter(0,5,-1,(i)=>{
	setTimeout(()=>{
		log.Emerg('buggy loop: '+i);
	},100);
});

// can iterate an array likewise 
var a=[5,2.3,'x',5,-11]
Util.SafeArrayIter(a,(v)=>{
	setTimeout(()=>{
		log.Info('array iteration: '+v);
	},100);
});

// can iterate an object likewise 
var b={'a':'B',4.4:-0.6,true:false}
Util.SafeDictIter(b,(k,v)=>{
	setTimeout(()=>{
		log.Info('object iteration: '+k+':'+v);
	},100);
});
