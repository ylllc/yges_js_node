// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

// Common Store ------------------------- //

// export target 
let YgEs={
	Name:'YgEs',
	User:{},
	_private_:{},
};

(()=>{ // local namespace 

let _prevID=(1234567890+Date.now())&0x7fffffff;
let _deltaID=727272727; // 31bit prime number, except 2 

YgEs.InitID=(init,delta=null)=>{
	_prevID=init;
	if(delta)_deltaID=delta;
}

YgEs.NextID=()=>{
	_prevID=(_prevID+_deltaID)&0x7fffffff;
	return _prevID;
}

YgEs.CreateEnum=(src)=>{

	let ll={}
	for(let i=0;i<src.length;++i)ll[src[i]]=i;
	return ll;
}

YgEs.SetDefault=(dst,def,log=null)=>{

	if(Array.isArray(def) || typeof def!=='object'){
		if(log)log.Fatal('def broken in YgEs.SetDefault()');
		return dst;
	}
	if(dst==null)dst={}

	for(let k in def){
		dst[k]=(dst[k]===undefined)?def[k]:
			YgEs.SetDefault(dst[k],def[k],log);
	}
	return dst;
}

function _customize_mono(src,def,log){

	if(src!=null && typeof src==='object'){
		// mono only 
		if(log)log.Warn('src is invalid in YgEs.Customize()',src);
		return def.Init;
	}
	if(def.Valid && !def.Valid(ss)){
		// invalid 
		if(log)log.Warn('src is invalid in YgEs.Customize()',src);
		return def.Init;
	}

	// valid 
	return src;
}

function _customize_class(src,def,log){

	if(def.Valid && !def.Valid(src)){
		// invalid 
		if(log)log.Warn('src is invalid in YgEs.Customize()',src);
		return def.Init;
	}

	return src;
}

function _customize_struct(src,def,log){

	if(src==null)src={}
	else if(typeof src!=='object'){
		if(log)log.Warn('src is doubtful definition in YgEs.Customize()',src);
		src={}
	}

	let dst={}
	for(let k in def){
		dst[k]=_customize_any(src[k],def[k],log);
	}
	for(let k in src){
		if(def[k])continue;
		dst[k]=src[k];
	}
	return dst;
}

function _customize_dict(src,def,log){

	const subdef=Object.assign(def,{List:undefined,Dict:undefined});
	let dst={}
	for(let k in src){
		// customize each entries 
		let r=_customize_any(src[k],subdef,log);
		if(r)dst[k]=r;
	}
	return dst;
}

function _customize_list(src,def,log){

	const subdef=Object.assign(def,{List:undefined,Dict:undefined});
	let dst=[]
	for(let ss of src){
		// customize each entries 
		let r=_customize_any(ss,subdef,log);
		if(r)dst.push(r);
	}
	return dst;
}

function _customize_any(src,def,log){

	if(def==null || typeof def!=='object'){
		// simple definition is a mono default value 
		return src??def;
	}
	if(src===undefined){
		// default valie 
		return def.Init;
	}
	if(def.List && Array.isArray(src)){
		// definition is an array 
		return _customize_list(src,def,log);
	}
	if(def.Dict && (src==null || typeof src==='object')){
		// definition is a dictionary 
		return _customize_dict(src,def,log);
	}
	if(def.Class && (src == null || typeof src==='object')){
		// definition is an instance 
		return _customize_class(src,def,log);
	}
	if(def.Mono){
		// definition is a mono value 
		return _customize_mono(src,def,log);
	}
}

YgEs.Customize=(src,def,log=null)=>{

	if(Array.isArray(def)){
		// array is not ruled
		if(log)log.Warn('def is doubtful definition in YgEs.Customize()',def);
		return {}
	}
	return _customize_struct(src,def,log);
}

YgEs.FromError=(err)=>{
	return {
		Name:err.name,
		Msg:err.message,
		Cause:err.cause,
		File:err.fileName,
		Line:err.lineNumber,
		Col:err.columnNumber,
		Stack:err.stack,
		Src:err,
	}
}

YgEs.JustString=(val)=>{
	switch(typeof val){
		case 'undefined': return 'undefined';
		case 'boolean': return val?'true':'false';
		case 'string': return val;
		case 'number': return val.toString();

		case 'object':
		if(val===null)return 'null';
		else if(Array.isArray(val)){
			let sub=[]
			for(let v of val)sub.push(YgEs.JustString(v));
			return '['+sub.join(',')+']';
		}
		else{
			let sub=[]
			for(let k in val)sub.push([JSON.stringify(k),YgEs.JustString(val[k])]);
			let sub2=[]
			for(let s of sub)sub2.push(s.join(':'));
			return '{'+sub2.join(',')+'}';
		}
		break;
	}
	return val.toString();
}

YgEs.Inspect=(val)=>{
	switch(typeof val){
		case 'undefined': return 'undefined';
		case 'number': return val.toString();

		case 'object':
		if(val===null)return 'null';
		else if(Array.isArray(val)){
			let sub=[]
			for(let v of val)sub.push(YgEs.Inspect(v));
			return '['+sub.join(',')+']';
		}
		else{
			let sub=[]
			for(let k in val)sub.push([JSON.stringify(k),YgEs.Inspect(val[k])]);
			let sub2=[]
			for(let s of sub)sub2.push(s.join(':'));
			return '{'+sub2.join(',')+'}';
		}
		break;
	}
	return JSON.stringify(val);
}

})();
export default YgEs;
