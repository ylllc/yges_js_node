// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import YgEs from './common.js';
import Log from './logger.js';

// Happening Manager -------------------- //
(()=>{ // local namespace 

function _default_happened(hap){
	Log.Fatal(hap.ToString(),hap.GetProp());	
}
function _default_abandoned(hap){
	Log.Warn('* Abandoned * '+hap.ToString(),hap.GetProp());	
}
function _default_resolved(hap){
	Log.Debug('* Resolved * '+hap.ToString(),hap.GetProp());	
}

function _create_happening(cbprop,cbstr,cberr,init={}){

	let resolved=false;
	let abandoned=false;
	let cb_resolved=init.cb_resolved??_default_resolved;
	let cb_abandoned=init.cb_abandoned??_default_abandoned;

	let hap={
		name:init.name??'YgEs_Happening',
		User:init.user??{},

		GetProp:cbprop,
		ToString:cbstr,
		toString:cbstr,
		ToJSON:()=>JSON.stringify(hap.GetProp()),
		ToError:cberr,

		IsResolved:()=>resolved,
		Resolve:()=>{
			if(resolved)return;
			resolved=true;
			abandoned=false;
			if(cb_resolved)cb_resolved(hap);
		},

		IsAbandoned:()=>abandoned && !resolved,
		Abandon:()=>{
			if(resolved)return;
			if(abandoned)return;
			abandoned=true;
			if(cb_abandoned)cb_abandoned(hap);
		},
	}
	return hap;
}

function _create_manager(prm,parent=null){

	let issues=[]
	let children=[]

	let mng={
		name:prm.name??'YgEs_HappeningManager',
		CB_Happened:prm.happen??null,
		User:prm.user??{},

		CreateLocal:(prm={})=>{
			let cm=_create_manager(prm,mng);
			children.push(cm);
			return cm;
		},

		GetParent:()=>parent,
		GetChildren:()=>children,
		GetIssues:()=>issues,

		Abandon:()=>{
			for(let sub of children){
				sub.Abandon();
			}
			for(let hap of issues){
				hap.Abandon();
			}
			issues=[]
		},

		CountIssues:()=>{
			let ct=issues.length;
			for(let sub of children){
				ct+=sub.CountIssues();
			}
			return ct;
		},
		IsCleaned:()=>{
			if(issues.length>0)return false;
			for(let sub of children){
				if(!sub.IsCleaned())return false;
			}
			return true;
		},
		CleanUp:()=>{
			let tmp=[]
			for(let hap of issues){
				if(!hap.IsResolved())tmp.push(hap);
			}
			issues=tmp;

			for(let sub of children){
				sub.CleanUp();
			}
		},

		GetInfo:()=>{
			let info={name:mng.name,_issues:[],_children:[]}
			for(let hap of issues){
				if(hap.IsResolved())continue;
				info._issues.push({name:hap.name,prop:hap.GetProp()});
			}
			for(let sub of children){
				let si=sub.GetInfo();
				if(si._issues.length>0 || si._children.length>0)info._children.push(si);
			}
			return info;
		},

		Poll:(cb)=>{
			if(!cb)return;
			for(let hap of issues){
				if(hap.IsResolved())continue;
				if(hap.IsAbandoned())continue;
				cb(hap);
			}
			for(let sub of children){
				sub.Poll(cb);
			}
		},

		_callHappened:(hap)=>{
			if(mng.CB_Happened)mng.CB_Happened(hap);
			else if(parent)parent._callHappened(hap);
			else _default_happened(hap);
		},
		Happen:(hap)=>{
			issues.push(hap);
			mng._callHappened(hap);
			return hap;
		},
		HappenMsg:(msg,init={})=>{
			return mng.Happen(_create_happening(
				()=>{return {msg:''+msg}},
				()=>''+msg,
				()=>new Error(msg),
				init
			));
		},

		HappenProp:(prop,init={})=>{
			return mng.Happen(_create_happening(
				()=>prop,
				()=>JSON.stringify(prop),
				()=>new Error(JSON.stringify(prop)),
				init
			));
		},

		HappenError:(err,init={})=>{
			return mng.Happen(_create_happening(
				()=>{return YgEs.FromError(err)},
				()=>''+err,
				()=>err,
				init
			));
		},
	}
	return mng;
}

YgEs.HappeningManager=_create_manager('YgEs_GlobalHappeningManager');

})();
export default YgEs.HappeningManager;
