// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';

// Engine Procedure Test ---------------- //

let count_start=0;
let count_done=0;
let count_abort=0;

const scenaria=[
	{
		title:'Root Async Proc',
		proc:async (tool)=>{
			let proc=tool.Launcher.Launch({
				happen:tool.Launcher.HappenTo,
				cb_start:(user)=>{
					user.lock=true;
					++count_start;
				},
				cb_poll:(user)=>{
					return user.lock;
				},
				cb_done:(user)=>{
					++count_done;
				},
				cb_abort:(user)=>{
					++count_abort;
				}
			});
			Test.chk_strict(1,count_start,'bgn - start');
			Test.chk_strict(0,count_done,'bgn - done');
			Test.chk_strict(0,count_abort,'bgn - abort');
			Test.chk_strict(true,proc.IsStarted(),'bgn - started');
			Test.chk_strict(false,proc.IsFinished(),'bgn - finished');
			Test.chk_strict(false,proc.IsAborted(),'bgn - aborted');
			Test.chk_strict(false,proc.IsEnd(),'bgn - end');

			proc.User.lock=false;
			await proc.ToPromise(false);

			Test.chk_strict(1,count_start,'end - start');
			Test.chk_strict(1,count_done,'end - done');
			Test.chk_strict(0,count_abort,'end - abort');
			Test.chk_strict(true,proc.IsStarted(),'end - started');
			Test.chk_strict(true,proc.IsFinished(),'end - finished');
			Test.chk_strict(false,proc.IsAborted(),'end - aborted');
			Test.chk_strict(true,proc.IsEnd(),'end - end');

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
