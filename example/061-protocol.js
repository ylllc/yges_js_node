// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2025 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

import Network from '../api/network.js';
import Timing from '../api/timing.js';
import Engine from '../api/engine.js';
import HappeningManager from '../api/happening.js';
import Log from '../api/logger.js';

// Example: Protocol Simulation --------- //

// start the Engine 
Engine.Start();

// for environment 
let log_local=Log.CreateLocal('NetworkTest',Log.LEVEL.DEBUG);
let launcher=Engine.CreateLauncher();
let hap_local=HappeningManager.CreateLocal({
	OnHappen:(hm,hap)=>{log_local.Fatal(hap.GetProp());},
});

// payload definition 
const pld_specs={
	HELLO:{},
	HI:{},
}

// receiver setting
const recvopt={
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
	// (for tough test) maybe cutoff during receiving 
	OnGate:(recver,from,packed)=>{
//		if(Math.random()<0.25)return packed.substring(0,Math.random()*packed.length);
		return packed;
	},
}

// receiver 
let recv_host=Network.CreateReceiver(recvopt);
let recv_guest=Network.CreateReceiver(recvopt);

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
	PayloadSpecs:pld_specs,
	PayloadHooks:{
		HELLO:{
			OnRequest:(tp,payload)=>{

				// create a Protocol for continue communicating 
				let prot=tp.NewProtocol('host');
				if(!prot)return;

				log_local.Info('Protocol ('+prot.GetPID()+') created by requested',payload);

				// replying 
				// (host does not know guest's EndPoint name) 
				prot.Send(null,'HI','Hi, '+payload.From);
			},
		},
		HI:{
			OnHanding:(tp,payload)=>{

				// calling by,
				// - first replied from requested 
				// - restart communicating in an abandoned Protocol 

				log_local.Info('Protocol accepted',payload);

				// specify handing EndPoint 
				return 'guest';
			},
			OnReplied:(tp,prot,payload)=>{

				log_local.Info('Replied on Protocol '+prot.GetPID(),payload);

				// continue this Protocol 
				return true;
			},
		},
	},
}

let tp_host=Network.CreateTransport(Object.assign(tpopt,{Dependencies:[recv_host,send_host]}));
tp_host.AttachReceiver('port_host',recv_host);
tp_host.AttachSender('port_host',send_host);
tp_host.AttachSelector((tp,to)=>'port_host');
let tp_guest=Network.CreateTransport(Object.assign(tpopt,{Dependencies:[recv_guest,send_guest]}));
tp_guest.AttachReceiver('port_guest',recv_guest);
tp_guest.AttachSender('port_guest',send_guest);
tp_guest.AttachSelector((tp,to)=>'port_guest');

// endpoint setting
const epopt={
	Log:log_local,
	Launcher:launcher,
	HappenTo:hap_local,
}

let ep_host=Network.CreateEndPoint(epopt).Open();
let ep_guest=Network.CreateEndPoint(epopt).Open();

tp_host.Connect('host',ep_host);
tp_guest.Connect('guest',ep_guest);

(async ()=>{

	// wait for endpoints ready 
	await Timing.SyncKit(1000,()=>ep_host.IsReady()).ToPromise();
	await Timing.SyncKit(1000,()=>ep_guest.IsReady()).ToPromise();

	// start a communicating 
	ep_guest.Send(null,'HELLO','hello, Host');

	await Timing.DelayKit(1500).ToPromise();

	ep_guest.Close();
	ep_host.Close();

	launcher.Sync((dmy)=>{
		Engine.ShutDown();
	});
})();
