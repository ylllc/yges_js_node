// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

import YgEs from './common.js';
import Timing from './timing.js';
import fs from 'fs';
import {glob} from 'node:fs';

// Low Level File Control for Node.js --- //
(()=>{ // local namespace 

function _initStat(path,stat){

	var t={
		getPath:()=>path,
		getLowLevel:()=>stat,
		isFile:()=>{
			if(!stat)return null;
			return stat.isFile();
		},
		isDir:()=>{
			if(!stat)return null;
			return stat.isDirectory();
		},
		isSymLink:()=>{
			if(!stat)return null;
			return stat.isSymbolicLink();
		},
		getDevID:()=>{
			if(!stat)return null;
			return stat.dev;
		},
		getInode:()=>{
			if(!stat)return null;
			return stat.ino;
		},
		getMode:()=>{
			if(!stat)return null;
			return stat.mode;
		},
		getGID:()=>{
			if(!stat)return null;
			return stat.gid;
		},
		getUID:()=>{
			if(!stat)return null;
			return stat.uid;
		},
		getSize:()=>{
			if(!stat)return null;
			return stat.size;
		},
		getAccessTime:()=>{
			if(!stat)return null;
			return stat.atime;
		},
		getModifyTime:()=>{
			if(!stat)return null;
			return stat.mtime;
		},
		getChangeTime:()=>{
			if(!stat)return null;
			return stat.ctime;
		},
		getBirthTime:()=>{
			if(!stat)return null;
			return stat.birthtime;
		},
	}
	return t;
}

YgEs.FS={
	name:'YgEs_FileLowLevel',
	User:{},

	exists:(path)=>{
		return fs.existsSync(path);
	},
	mkdir:(path,opt={})=>{
		return fs.promises.mkdir(path,opt);
	},
	stat:(path,opt={})=>{
		return Timing.toPromise(async (ok,ng)=>{
			Timing.fromPromise(
				fs.promises.stat(path,opt),
				(res)=>{ok(_initStat(path,res));},
				(err)=>{ok(null);}
			);
		});
	},
	isDir:(path)=>{
		return Timing.toPromise(async (ok,ng)=>{
			Timing.fromPromise(
				mif.stat(proc),
				(res)=>{ok(res.isDir());},
				(err)=>{ok(false);}
			);
		});
	},
	isFile:(path)=>{
		return Timing.toPromise(async (ok,ng)=>{
			Timing.fromPromise(
				mif.stat(proc),
				(res)=>{ok(res.isFile());},
				(err)=>{ok(false);}
			);
		});
	},
	load:(path,opt)=>{
		return fs.promises.readFile(path,opt);
	},
	save:(path,data,opt)=>{
		return fs.promises.writeFile(path,data,opt);
	},
	remove:(path,opt)=>{
		return fs.promises.rm(path,opt);
	},

	glob:(dir,ptn='*')=>{
		return Timing.toPromise(async (ok,ng)=>{
			glob(ptn,{cwd:dir},(e,r)=>{
				if(e)ng(e);
				else ok(r);
			});
		});
	},
}

})();
export default YgEs.FS;
