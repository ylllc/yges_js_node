// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';

// Launcher Test ------------------------ //

const PROCS=100;
const LIMIT=30;
const WAIT=500;

let count_start=0;
let count_done=0;
let count_abort=0;

const scenaria=[
	{
		title:'Launcher',
		proc:async (tool)=>{
			let lnc=tool.Launcher.CreateLauncher({
				name:'test launcher',
				happen:tool.Launcher.HappenTo,
			});
			lnc.Limit=0;
			Test.chk_strict(0,lnc.CountActive(),'empty launcher');
			Test.chk_strict(0,lnc.CountHeld(),'empty launcher');

			for(let i=0;i<PROCS;++i){
				lnc.Launch({
					cb_start:(user)=>{
						user.until=new Date(Date.now()+WAIT);
						++count_start;
					},
					cb_poll:(user)=>{
						return new Date()<user.until;
					},
					cb_done:(user)=>{
						++count_done;
					},
					cb_abort:(user)=>{
						++count_abort;
					}
				});
			}
			Test.chk_strict(0,count_start,'bgn - start');
			Test.chk_strict(0,count_done,'bgn - done');
			Test.chk_strict(0,count_abort,'bgn - abort');

			Test.chk_strict(0,lnc.CountActive(),'held launcher');
			Test.chk_strict(PROCS,lnc.CountHeld(),'held launcher');
			lnc.Limit=LIMIT;

			tool.Launcher.Delay(WAIT/2,(user)=>{
				Test.chk_strict(LIMIT,lnc.CountActive(),'start launcher: '+lnc.CountActive());
				Test.chk_strict(PROCS-LIMIT,lnc.CountHeld(),'start launcher: '+lnc.CountHeld());
			});

			await lnc.ToPromise(false);

			Test.chk_strict(0,lnc.CountActive(),'done launcher');
			Test.chk_strict(0,lnc.CountHeld(),'done launcher');

			Test.chk_strict(PROCS,count_start,'end - start');
			Test.chk_strict(PROCS,count_done,'end - done');
			Test.chk_strict(0,count_abort,'end - abort');
			lnc.Abandon();

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
