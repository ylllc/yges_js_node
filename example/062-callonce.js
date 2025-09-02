// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2025 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

import YgEs from '../api/common.js';
import Network from '../api/network.js';
import Timing from '../api/timing.js';
import Engine from '../api/engine.js';
import HappeningManager from '../api/happening.js';
import Log from '../api/logger.js';

// Example: Call Once API --------------- //
Log.Showable=Log.LEVEL.TRACE;

// start the Engine 
Engine.Start();

// for environment 
let log_local=Log.CreateLocal('NetworkTest');
let launcher=Engine.CreateLauncher();
let hap_local=HappeningManager.CreateLocal({
	OnHappen:(hm,hap)=>{log_local.Fatal(hap.GetProp());},
});

// payload definition 
const pld_specs={
	HELLO:{
		CallOnce:{
			// only 1 call until replied 
			Limit:true,
			// can call again after msec 
//			Timeout:1,
		},
	},
	HI:{
		UnlockOnce:['HELLO'],
	},
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
	OnGate:(recver,rawdata,prop)=>{
//		if(Math.random()<0.25)return rawdata.substring(0,Math.random()*rawdata.length);
		return rawdata;
	},
}

// receiver 
let recv_host=Network.CreateReceiver(recvopt);
let recv_guest=Network.CreateReceiver(recvopt);

recv_host.SetTracing_Receiver(false);
recv_guest.SetTracing_Receiver(false);

// sender setting
const sendopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
	TraceAgent:false,
	TraceStMac:false,
	TraceProc:false,
	// (for tough test) insert random msec delay 
	DelayMin:0,
	DelayMax:400,
	// (for tough test) maybe break ordering by delay 
//	Unorderable:true,
	// (for tough test) ratio of dubbed packet on received 
//	DubRatio:0.25,
//	DubIntervalMin:0,
//	DubIntervalMax:500,
}

// sender 
let send_host=Network.CreateLoopback(recv_guest,sendopt);
let send_guest=Network.CreateLoopback(recv_host,sendopt);

// transport setting
const tpopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
	TraceAgent:false,
	TraceStMac:false,
	TraceProc:false,
	PIDPrefix:'Exam061',
	PayloadSpecs:pld_specs,
}

let tp_host=Network.CreateTransport(Object.assign(tpopt,{
	PayloadHooks:{
		HELLO:{
			OnBound:(tp,payload,prop)=>{

				log_local.Info('Protocol accepted',payload);

				// specify handing EndPoint 
				return 'host';
			},
			OnRespond:(tp,prot,payload,prop)=>{

				log_local.Info('Replied on Protocol '+prot.GetPID(),payload);

				// reply the state 
				prot.Send(payload.From,'HI','OK');

				// this Protocol is over 
				return false;
			},
		},
	},
}));
tp_host.AttachReceiver('port_host',recv_host);
tp_host.AttachSender('port_host',send_host);
tp_host.SetSelector((tp,target,prop)=>'port_host');
tp_host.SetTracing_Transport(false);
tp_host.SetTracing_Agent(false);

let tp_guest=Network.CreateTransport(Object.assign(tpopt,{
	PayloadHooks:{
		HI:{
			OnRespond:(tp,prot,payload,prop)=>{

				log_local.Info('Replied on Protocol '+prot.GetPID(),payload);

				// this Protocol is continued 
				return true;
			},
		},
	},
}));
tp_guest.AttachReceiver('port_guest',recv_guest);
tp_guest.AttachSender('port_guest',send_guest);
tp_guest.SetSelector((tp,target,prop)=>'port_guest');
tp_guest.SetTracing_Transport(false);
tp_guest.SetTracing_Agent(false);

// endpoint setting
const epopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
}

let ep_host=Network.CreateEndPoint(epopt).Open();
let ep_guest1=Network.CreateEndPoint(epopt).Open();
let ep_guest2=Network.CreateEndPoint(epopt).Open();

ep_host.SetTracing_EndPoint(false);
ep_guest1.SetTracing_EndPoint(false);
ep_guest2.SetTracing_EndPoint(false);

tp_host.Connect('host',ep_host);
tp_guest.Connect('guest1',ep_guest1);
tp_guest.Connect('guest2',ep_guest2);

(async ()=>{

	// wait for endpoints ready 
	await Timing.SyncKit(1000,()=>ep_host.IsReady()).ToPromise();
	await Timing.SyncKit(1000,()=>ep_guest1.IsReady()).ToPromise();
	await Timing.SyncKit(1000,()=>ep_guest2.IsReady()).ToPromise();

	// create a Protocol to wait reply 
	let prot1=tp_guest.NewProtocol('guest1',{Name:'ProtocolTest1'});
	let prot2=tp_guest.NewProtocol('guest2',{Name:'ProtocolTest2'});

	// request to the host 
	prot1.Send(null,'HELLO');
	// 2nd request will blocked by CallOnce option 
	prot1.Send(null,'HELLO');
	// can request from an other Protocol 
	prot2.Send(null,'HELLO');

	await Timing.DelayKit(2000).ToPromise();

	// can 2nd request after HI replied 
	prot1.Send(null,'HELLO');

	await Timing.DelayKit(2000).ToPromise();

	ep_guest1.Close();
	ep_guest2.Close();
	ep_host.Close();

	launcher.Sync((dmy)=>{
		Engine.ShutDown();
	});
})();
