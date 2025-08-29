// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2025 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

import Network from '../api/network.js';
import Timing from '../api/timing.js';
import Engine from '../api/engine.js';
import HappeningManager from '../api/happening.js';
import Log from '../api/logger.js';

// Example: Transport Simulation -------- //
Log.Showable=Log.LEVEL.TRACE;

// start the Engine 
Engine.Start();

// for environment 
let log_local=Log.CreateLocal('NetworkTransportTest');
let launcher=Engine.CreateLauncher();
let hap_local=HappeningManager.CreateLocal({
	OnHappen:(hm,hap)=>{log_local.Fatal(hap.GetProp());},
});

// payload definition 
const pld_specs={
	Hello:{},
}

// receiver setting
const recvopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
	Trace_Agent:false,
	Trace_StMac:false,
	Trace_Proc:false,
	// (for tough test) insert random msec delay 
	DelayMin:0,
	DelayMax:400,
	// (for tough test) maybe break ordering by delay 
//	Unorderable:true,
	// (for tough test) ratio of dubbed packet on received 
//	DubRatio:0.25,
//	DubIntervalMin:0,
//	DubIntervalMax:500,
	// (for tough test) maybe cutoff during receiving 
	OnGate:(recver,packed)=>{
//		if(Math.random()<0.25)return packed.substring(0,Math.random()*packed.length);
		return packed;
	},
}

// receiver 
let recv=Network.CreateReceiver(recvopt);

recv.SetTracing_Receiver(false);

// sender setting
const sendopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
	// (for tough test) insert random msec delay 
	DelayMin:0,
	DelayMax:400,
	// (for tough test) maybe break ordering by delay 
	Unorderable:false,
	// (for tough test) ratio of short packet on sending 
	Hurting:0.0,
}

// loopback sender 
let loopback=Network.CreateLoopback(recv,sendopt);
// terminate sender 
let term=Network.CreateTerminator(sendopt);

loopback.SetTracing_Sender(false);
term.SetTracing_Sender(false);

// transport setting
const tpopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
	TraceAgent:false,
	TraceStMac:false,
	TraceProc:false,
	PayloadSpecs:pld_specs,
	PayloadHooks:{
		Hello:{
			OnRequest:(tp,payload)=>{

				// target EndPoint 
				let ep=tp.GetEndPoint(payload.To);
				if(!ep){
					log_local.Fatal('Transport ('+tp.Name+') does not have an EndPoint named '+target,payload);
				}
				else{
					ep.GetAgent().User.OnRecvMsg(ep,payload);
				}
			},
		},
	},
}

let tp=Network.CreateTransport(tpopt);
tp.SetTracing_Transport(false);
tp.SetTracing_Agent(false);

tp.AttachReceiver('lb',recv);
tp.AttachSender('lb',loopback);
tp.AttachSender('tm',term);
tp.SetSelector((tp,target)=>{
	return (target=='')?'tm':'lb';
});

// endpoint setting
const eopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
	User:{
		OnRecvMsg:(ep,payload)=>{

			Log.Info('received from '+payload.From+'; '+payload.Body);
		},
	},
}

// loopback endpoints 
let ep1=Network.CreateEndPoint(eopt).Open();
let ep2=Network.CreateEndPoint(eopt).Open();

ep1.SetTracing_EndPoint(false);
ep2.SetTracing_EndPoint(false);

tp.Connect('EP1',ep1);
tp.Connect('EP2',ep2);

(async ()=>{

	// wait for endpoints ready 
	await Timing.SyncKit(1000,()=>ep1.IsReady()).ToPromise();
	await Timing.SyncKit(1000,()=>ep2.IsReady()).ToPromise();

	Log.Info('all ready');

	// send each other 
	// (when onorderable delay test, maybe receive B to A) 
	ep1.Send('EP2','Hello','Loopback Test1A');
	ep2.Send('EP1','Hello','Loopback Test2A');
	ep1.Send('EP2','Hello','Loopback Test1B');
	ep2.Send('EP1','Hello','Loopback Test2B');

	// send to Transport (but not reach to opposite EndPoint) 
	// EndPoint does not have an instance address to reply 
	// and can only send in one way 
	ep1.Launch('EP2','Hello','Communicate Test1');
	ep1.Send('EP1','Hello','Loopback Test1');
	ep2.Launch('EP1','Hello','Communicate Test2');
	ep2.Launch('','Hello','Terminate Test');
	ep2.KickAll();

	await Timing.DelayKit(1500).ToPromise();

	ep1.Close();
	ep2.Close();

	launcher.Sync((dmy)=>{
		Engine.ShutDown();
	});
})();
