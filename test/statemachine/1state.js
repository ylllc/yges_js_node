// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import StateMachine from '../../api/stmac.js';

// 1 State Test ------------------------- //

const states={
	'Test':{
		OnStart:(ctx,proc)=>{
			Test.ChkStrict(++proc.User.Count,2,'cb_start called illegular');
		},
		OnPollInUp:(ctx,proc)=>{
			Test.ChkGreat(++proc.User.Count,2,'poll_up called illegular');
			Test.ChkLessEq(proc.User.Count,10,'poll_up called illegular');
			return (proc.User.Count<10)?null:true;
		},
		OnReady:(ctx,proc)=>{
			Test.ChkStrict(++proc.User.Count,11,'cb_ready called illegular');
		},
		OnPollInKeep:(ctx,proc)=>{
			Test.ChkGreat(++proc.User.Count,11,'poll_keep called illegular');
			Test.ChkLessEq(proc.User.Count,20,'poll_keep called illegular');
			return (proc.User.Count<20)?null:true;
		},
		OnStop:(ctx,proc)=>{
			Test.ChkStrict(++proc.User.Count,21,'cb_stop called illegular');
		},
		OnPollInDown:(ctx,proc)=>{
			Test.ChkGreat(++proc.User.Count,21,'poll_down called illegular');
			Test.ChkLessEq(proc.User.Count,30,'poll_down called illegular');
			return (proc.User.Count<30)?null:true;
		},
		OnEnd:(ctx,proc)=>{
			Test.ChkStrict(++proc.User.Count,31,'cb_end called illegular');
		},
	},
}

let opt={
	User:{Count:1}, // share in states 
	OnDone:(proc)=>{
		Test.ChkStrict(++proc.User.Count,32,'cb_done called illegular');
	},
	OnAbort:(proc)=>{
		Test.Never('states abend');
	},
}

const scenaria=[
	{
		Title:'1 State Running',
		Proc:async (tool)=>{
			opt.Launcher=tool.Launcher;
			opt.HappenTo=tool.Launcher.HappenTo;

			// run with undefined state 
			// abort soon 
			let smc=StateMachine.Run('Test',states,opt);

			let info=smc.GetInfo();
			Test.ChkStrict(null,info.Prev);
			Test.ChkStrict('Test',info.Cur);
			Test.ChkStrict(null,info.Next);
			Test.ChkStrict(3,info.User.Count);

			await tool.Launcher.ToPromise();

			info=smc.GetInfo();
			Test.ChkStrict('Test',info.Prev);
			Test.ChkStrict(null,info.Cur);
			Test.ChkStrict(null,info.Next);
			Test.ChkStrict(32,info.User.Count);
		},
	},
]

Test.Run(scenaria);
