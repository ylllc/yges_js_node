// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

import assert from 'node:assert';
import test from 'node:test';

import YgEs from './common.js';
import Timing from './timing.js';
import HappeningManager from './happening.js';
import Engine from './engine.js';
import Log from './logger.js';

// Unit Test Utility for Node.JS -------- //

function _cpmsg(msg,v1,op,v2){
	if(!msg)msg='Test Mismatch:';
	return ''+msg+' ('+YgEs.inspect(v1)+' '+op+' '+YgEs.inspect(v2)+')';
}

export default {
	name:'YgEs_UnitTest',
	User:{},

	never:(msg=null)=>{assert(false,msg)},
	chk:(cond,msg=null)=>{assert(cond,msg)},
	chk_loose:(v1,v2,msg=null)=>{assert(v1==v2,_cpmsg(msg,v1,'==',v2))},
	chk_strict:(v1,v2,msg=null)=>{assert(v1===v2,_cpmsg(msg,v1,'===',v2))},
	chk_less:(v1,v2,msg=null)=>{assert(v1<v2,_cpmsg(msg,v1,'<',v2))},
	chk_less_eq:(v1,v2,msg=null)=>{assert(v1<=v2,_cpmsg(msg,v1,'<=',v2))},
	chk_great:(v1,v2,msg=null)=>{assert(v1>v2,_cpmsg(msg,v1,'>',v2))},
	chk_great_eq:(v1,v2,msg=null)=>{assert(v1>=v2,_cpmsg(msg,v1,'>=',v2))},

	run:(scn)=>{

		// when there is even one pickup 
		// unselected tests are ignored. 
		let puf=false;
		for(let t of scn){
			if(!t.pickup)continue;
			puf=true;
			break;
		}

		Timing.toPromise((ok,ng)=>{
			for(let t of scn){
				if(puf && !t.pickup)continue;
				if(t.filter!==undefined && !t.filter)continue;

				test(t.title,async ()=>{
					Engine.start();
					let launcher=Engine.createLauncher();
					await t.proc({
						Launcher:launcher,
						Log:Log.createLocal(t.title,Log.LEVEL.DEBUG),
					});
					launcher.abort();
					if(!launcher.HappenTo.isCleaned())throw YgEs.inspect(launcher.HappenTo.getInfo());
					Engine.stop();
				});
			}
		});
	},
};
