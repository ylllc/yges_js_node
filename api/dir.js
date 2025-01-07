// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import YgEs from './common.js';
import HappeningManager from './happening.js';
import AgentManager from './agent.js';
import Timing from './timing.js';
import FS from './fs_ll.js';

// Directory Control -------------------- //
(()=>{ // local namespace 

function _target(dir,prepare,parent){

	var ws={
		name:'YgEs_DirTarget',
		happen:Dir.HappenTo.CreateLocal(),

		cb_open:(wk)=>{
			var done=false;
			Timing.FromPromise(
				FS.MkDir(dir,{recursive:prepare}),
				(res)=>{
					done=true;
				},
				(err)=>{
					ws.happen.HappenError(err);
				}
			);
			wk.WaitFor(()=>{return done;});
		},
	};
	if(parent)ws.delendencies=[parent.Fetch()]
	var wk=AgentManager.StandBy(ws);

	wk.GetPath=()=>dir;
	wk.Exists=()=>FS.Exists(dir);
	wk.Relative=(path)=>dir+'/'+path;
	wk.SubDir=(path,prepare)=>_target(dir+'/'+path,prepare,wk);
	wk.Glob=(ptn='*')=>FS.Glob(dir,ptn);

	return wk;
}

let Dir=YgEs.Dir={
	name:'YgEs.DirControl',
	User:{},
	HappenTo:HappeningManager,

	Exists:(path)=>FS.Exists(path),
	IsDir:(path)=>FS.IsDir(path),

	Stat:(path,opt={})=>FS.Stat(path,opt),
	MkDir:(path,opt={})=>FS.MkDir(path,opt),

	Target:(dir,prepare)=>_target(dir,prepare,null),
}

})();
export default YgEs.Dir;
