// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

// Examples: StateMachine --------------- //

import Engine from '../api/engine.js';
import StateMachine from '../api/stmac.js';
import Timing from '../api/timing.js';
import Log from '../api/logger.js';

let states={
	'StateA':{
		cb_start:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' start');
		},
		poll_up:(ctx,user)=>{
			// goto next phase 
			return (++user.Count<10)?null:true;
		},
		cb_ready:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' ready');
		},
		poll_keep:(ctx,user)=>{
			// goto StateB 
			return (++user.Count<20)?null:'StateB';
		},
		cb_stop:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' stop');
		},
		poll_down:(ctx,user)=>{
			// goto next state 
			return (++user.Count<30)?null:true;
		},
		cb_end:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' end');
		},
	},
	'StateB':{
		cb_start:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' start');
		},
		poll_up:(ctx,user)=>{
			// goto next phase 
			return (++user.Count<40)?null:true;
		},
		cb_ready:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' ready');
		},
		poll_keep:(ctx,user)=>{
			// goto end
			return (++user.Count<50)?null:true;
		},
		cb_stop:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' stop');
		},
		poll_down:(ctx,user)=>{
			// next state is interrupted by StateC 
			return (++user.Count<60)?null:'StateC';
		},
		cb_end:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' end');
		},
	},
	'StateC':{
		cb_start:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' start');
		},
		poll_up:(ctx,user)=>{
			// next phase is interrupted by StateD 
			// and stop this state now 
			return (++user.Count<70)?null:'StateD';
		},
		cb_ready:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' ready');
		},
		poll_keep:(ctx,user)=>{
			// skipped by interruption 
			return (++user.Count<80)?null:true;
		},
		cb_stop:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' stop');
		},
		poll_down:(ctx,user)=>{
			// goto next state 
			return (++user.Count<90)?null:true;
		},
		cb_end:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' end');
		},
	},
	'StateD':{
		cb_start:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' start');
		},
		poll_up:(ctx,user)=>{
			// goto next phase 
			return (++user.Count<100)?null:true;
		},
		cb_ready:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' ready');
		},
		poll_keep:(ctx,user)=>{
			// goto end 
			return (++user.Count<110)?null:true;
		},
		cb_stop:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' stop');
		},
		poll_down:(ctx,user)=>{
			// goto next state (is end)
			return (++user.Count<120)?null:true;
		},
		cb_end:(ctx,user)=>{
			Log.Info(ctx.GetCurState()+' end');
		},
	},
}

// start the Engine 
Engine.Start();

let opt1={
	launcher:Engine.CreateLauncher(),
	user:{name:'Test1',Count:1}, // share in states 
	cb_done:(user)=>{
		Log.Info(user.name+' done');

		// run from StateB 
		// and abort after 200msec 
		let ctrl=StateMachine.Run('StateB',states,opt2);
		Timing.Delay(200,()=>{ctrl.Abort();});
	},
	cb_abort:(user)=>{
		Log.Info(user.name+' abort');
	},
}
let opt2={
	launcher:Engine.CreateLauncher(),
	user:{name:'Test2',Count:1}, // share in states 
	cb_done:(user)=>{
		Log.Info(user.name+' done');
	},
	cb_abort:(user)=>{
		Log.Info(user.name+' abort');
	},
}

StateMachine.Run('StateA',states,opt1);

opt1.launcher.Sync((dmy)=>{
	Engine.ShutDown();
});
