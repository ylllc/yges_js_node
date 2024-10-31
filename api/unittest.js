// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

// Unit Test Utility for Node.JS //

import assert from 'node:assert';
import test from 'node:test';

export default {

	chk:(cond,msg)=>{assert(cond,msg)},
	chk_loose:(v1,v2,msg)=>{assert(v1==v2,msg)},
	chk_strict:(v1,v2,msg)=>{assert(v1===v2,msg)},

	run:(scn)=>{

		// when there is even one pickup 
		// unselected tests are ignored. 
		var puf=false;
		for(var t of scn){
			if(!t.pickup)continue;
			puf=true;
			break;
		}

		for(var t of scn){
			if(puf && !t.pickup)continue;
			if(t.filter!==undefined && !t.filter)continue;
			test(t.title,t.proc);
		}
	},
};
