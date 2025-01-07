// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

// Examples: Agent ---------------------- //

import Engine from '../api/engine.js';
import AgentManager from '../api/agent.js';
import Timing from '../api/timing.js';
import Log from '../api/logger.js';
import HappeningManager from '../api/happening.js';

// start the Engine 
Engine.Start();

// for Worker environment 
let launcher=Engine.CreateLauncher();
let hap_local=HappeningManager.CreateLocal({
	happen:(hap)=>{Log.Fatal(hap.GetProp());},
});

// Worker1 
let workset1={
	launcher:launcher,
	happen:hap_local,
	user:{Count:0},
	cb_open:(worker)=>{
		Log.Info('Worker1 open');
		worker.WaitFor(()=>{
			return ++worker.User.Count>=10;
		});
	},
	cb_back:(worker)=>{
		Log.Info('Worker1 back');
		worker.WaitFor(()=>{
			return --worker.User.Count<=0;
		});
	},
	cb_ready:(worker)=>{
		Log.Info('Worker1 ready');
	},
	cb_close:(worker)=>{
		Log.Info('Worker1 close');
		worker.WaitFor(()=>{
			return --worker.User.Count<=0;
		});
	},
	cb_finish:(worker)=>{
		Log.Info('Worker1 finish');
	},
}

// Worker2 
// has dependency, Worker1 required 
let workset2={
	launcher:launcher,
	happen:hap_local,
	user:{Count:0},
	dependencies:{w1:AgentManager.Launch(workset1)},
	cb_open:(worker)=>{
		Log.Info('Worker2 open');
		worker.User.Count=0;
	},
	cb_ready:(worker)=>{
		Log.Info('Worker2 ready');
	},
	cb_close:(worker)=>{
		Log.Info('Worker2 close');
	},
	cb_finish:(worker)=>{
		Log.Info('Worker2 finish');
	},
};

(async ()=>{
	// Worker1 runs 
	let wh1=AgentManager.Run(workset1);
	Timing.Delay(300,()=>{wh1.Close();});
	await Timing.SyncKit(20,()=>{return !wh1.IsBusy();}).promise();

	// Worker1 reopen&restart 
	await Timing.DelayKit(100,()=>{wh1.Open();}).promise();
	await Timing.DelayKit(150,()=>{
		Log.Info('Worker1 restart');
		wh1.Restart();
	}).promise();
	await Timing.DelayKit(500,()=>{wh1.Close();}).promise();
	await Timing.SyncKit(20,()=>{return !wh1.IsBusy();}).promise();

	// Worker2 open 
	// and depndencies too 
	let wh2=AgentManager.Run(workset2);
	Timing.Delay(200,()=>{wh2.Close();});

	launcher.Sync((dmy)=>{
		Engine.ShutDown();
	});
})();
