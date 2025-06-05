// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2025 Yggdrasil Leaves, LLC.          //
//        All rights reserved.            //

import YgEs from './common.js';
import Agent from './agent.js';
import Log from './logger.js';

// Network Drivers ---------------------- //
(()=>{ // local namespace 

//const _default_spec={
//	QuickCall:false,
//	CallOnce:{
//		Limit:false,
//		Reply:null,
//		Timeout:null,
//	},
//}
//
//function _transport_new(opt={}){
//
//	const hurting=opt.Hurting??0.0;
//	const unorderable=opt.Unorderable??false;
//	const delay_min=opt.DelayMin??0;
//	const delay_max=opt.DelayMax??0;
//
//	const onOpen=opt.OnOpen??((agent)=>{});
//	const onClose=opt.OnClose??((agent)=>{});
//	const onReady=opt.OnReady??((agent)=>{});
//	const onPack=opt.OnPack??((tp,ep_from,remote_epid_to,payload)=>{
//		return JSON.stringify({SenderEPID:ep_from.GetInstanceID(),/*ReceiverEPID:remote_epid_to,*/Payload:payload});
//	});
//	const onUnpack=opt.OnUnpack??((tp,pack)=>{
//		return JSON.parse(pack);
//	});
//	const onExtractSenderEPID=opt.OnExtractSenderEPID??((tp,data)=>{
//		return data.SenderEPID;
//	});
////	const onExtractReceiverEPID=opt.OnExtractReceiverEPID??((data)=>{
////		return data.ReceiverEPID;
////	});
//	const onExtractPayloadArray=opt.OnExtractPayloadArray??((data)=>{
//		return data.Payload;
//	});
//	const onExtractPayloadType=opt.OnExtractPayloadType??((payload)=>null);
//	const onExtractSessionID=opt.OnExtractSessionID??((payload)=>null);
//	const onSend=opt.OnSend??((tp,ep_from,remote_epid_to,pack)=>{
//		tp.GetLogger().Tick(()=>'terminated transport: '+pack);
//	});
//	const plss=opt.PayloadSpecs??{}
//	const plrs=opt.PayloadReceivers??null
//
//	for(let plt in plss){
//		plss[plt]=YgEs.SetDefault(plss[plt],_default_spec);
//		plss[plt]._private_={
//			UnlockTarget:[],
//		}
//	}
//
//	let prm=Object.assign({},opt,{
//		AgentBypasses:['GetPayloadSpec','GetEndPoint','ExtractPayloadType','Send','Receive',
//			'AttachSession','DetachSession'],
//		OnOpen:(agent)=>{
//			onOpen(agent);
//		},
//		OnClose:(agent)=>{
//			for(let sh of Object.values(tp._private_.session)){
//				sh.Close();
//			}
//			tp._private_.session={}
//
//			onClose(agent);
//			if(tp._private_.host)tp._private_.host.Close();
//		},
//		OnReady:(agent)=>{
//			onReady(agent);
//			if(tp._private_.host)tp._private_.host.Open();
//		},
//	});
//	if(!prm.Name)prm.Name='YgEs.Transport.Driver';
//
//	let tp=YgEs.AgentManager.StandBy(prm);
//	tp._private_.endpoint={}
//	tp._private_.session={}
//
//	for(let plt in plss){
//		let pls_s=plss[plt];
//		if(pls_s.CallOnce.Limit && pls_s.CallOnce.Reply!=null){
//			let pls_d=plss[pls_s.CallOnce.Reply];
//			if(!pls_d){
//				tp.GetLogger().Warn('PayloadType '+pls_s.CallOnce.Reply+' not defined for unlock PayloadType '+plt);
//			}
//			else{
//				pls_d._private_.UnlockTarget.push(plt);
//			}
//		}
//
//		pls_s._private_.OnReceived=(ep,ep_from)=>{
//			for(let plt2 of pls_s._private_.UnlockTarget){
//				ep.UnlockOnce(ep_from,plt2);
//			}
//		}
//	}
//
//	tp.GetPayloadSpec=(plt)=>{
//		return plss[plt]??null;
//	}
//	tp.GetEndPoint=(epid)=>{
//		if(epid!=null)return tp._private_.endpoint[epid]??null;
//		if(!tp._private_.host)return null;
//		return tp._private_.host.GetAgent();
//	}
//	tp.ExtractPayloadType=(payload)=>{
//		return onExtractPayloadType(payload);
//	}
//	tp.IsUnorderable=()=>unorderable;
//	tp.MakeDelay=()=>{
//		if(delay_max<1)return 0;
//		return delay_min+Math.random()*(delay_max-delay_min);
//	}
//
//	const checkReady=()=>{
//		if(!tp.IsReady()){
//			tp.GetLogger().Fatal('Transport '+tp.Name+' is not ready');
//			return false;
//		}
//		return true;
//	}
//
//	const handleFetch=tp.Fetch;
//	tp.Fetch=()=>{
//		let h=handleFetch();
//		h.Connect=tp.Connect;
//		return h;
//	}
//
//	tp._private_.connect=(ep)=>{
//		let epid=ep.GetInstanceID();
//		if(tp._private_.endpoint[epid]){
//			tp.GetLogger().Notice('EndPoint '+epid+' was overriden in Transport ('+tp.Name+')');
//		}
//		tp._private_.endpoint[epid]=ep;
//	}
//	tp._private_.disconnect=(ep)=>{
//		let epid=ep.GetInstanceID();
//		if(!tp._private_.endpoint[epid])return;
//		delete tp._private_.endpoint[epid];
//	}
//
//	tp._private_.send=(ep_from,remote_epid_to,sendq)=>{
//		if(!checkReady())return;
//		try{
//			let local_epid=ep_from.GetInstanceID();
//			tp.GetLogger().Tick(()=>'Transport sending '+local_epid+'=>'+remote_epid_to,sendq);
//
//			let pack=onPack(tp,ep_from,remote_epid_to,sendq);
//			if(hurting>0){
//				if(Math.random()<hurting){
//					// packet short test 
//					pack=pack.substring(0,Math.random()*pack.substring.length);
//				}
//			}
//
//			// send now 
//			onSend(tp,ep_from,remote_epid_to,pack);
//		}
//		catch(e){
//			tp.GetLogger().Fatal('Transport error at send: '+e.toString(),YgEs.FromError(e));
//		}
//	}
//
//	tp.Launch=(remote_epid_to,payload)=>{
//		if(!tp._private_.host){
//			tp.GetLogger().Fatal('Host not attached for send');
//			return;
//		}
//		return tp._private_.host.Launch(remote_epid_to,payload);
//	}
//
//	tp.Kick=(remote_epid_to=null)=>{
//		if(!tp._private_.host){
//			tp.GetLogger().Fatal('Host not attached for send');
//			return;
//		}
//		return tp._private_.host.Kick(remote_epid_to);
//	}
//
//	tp.Send=(remote_epid_to,payload)=>{
//		if(!tp._private_.host){
//			tp.GetLogger().Fatal('Host not attached for send');
//			return;
//		}
//		return tp._private_.host.Send(remote_epid_to,payload);
//	}
//
//	tp.Receive=(local_epid_from,local_epid_to,pack)=>{
//		if(!checkReady())return;
//
//		tp.GetLogger().Tick(()=>'Transport received to '+local_epid_to+': '+pack);
//
//		let data=onUnpack(tp,pack);
////		let remote_epid_from=onExtractSenderEPID(tp,data);
//		let ep_to=tp.GetEndPoint(local_epid_to);
//
//		if(!ep_to){
//			tp.GetLogger().Notice(()=>((local_epid_to==null)?'Host':('EndPoint '+local_epid_to))+' not found in Transport '+tp.Name);
//			return;
//		}
//
//		try{
//			let pla=onExtractPayloadArray(data);
//			if(!Array.isArray(pla)){
//				tp.GetLogger().Notice(()=>'No payloads: ',data);
//			}
//			else for(let pl of pla){
//
//				let sid=onExtractSessionID(pl);
//				if(sid){
//					// receive for a session 
//					let sess=tp._private_.session[sid];
//					if(!sess){
//						tp.GetLogger().Notice(()=>'Unknown session: '+sid);
//					}
//					else{
//						let plt=onExtractPayloadType(pl);
//						sess.GetAgent()._private_.receive(ep_to,local_epid_from,plt,pl);
//					}
//				}
//				else if(!plrs){
//					// receive plain payload 
//					ep_to._private_.receive(local_epid_from,pl);
//				}
//				else{
//					// receive by payload type 	
//					let plt=onExtractPayloadType(pl);
//					let pls=(plt==null)?null:plss[plt];
//					let plr=(plt==null)?null:plrs[plt];
//					if(!plr){
//						tp.GetLogger().Notice(()=>'Receiver not defined: '+plt);
//					}
//					else if(!pls?.QuickCall){
//						// call queue 
//						tp.GetLogger().Tick(()=>'Payload queued '+local_epid_from+' => '+local_epid_to,pl);
//						ep_to._private_.recvq.push({
//							From:local_epid_from,
//							Payload:pl,
//							Spec:pls,
//							Call:()=>{
//								pls._private_.OnReceived(ep_to,local_epid_from);
//								plr(ep_to,local_epid_from,pl);
//							},
//						});
//					}
//					else{
//						// call now 
//						pls._private_.OnReceived(ep_to,local_epid_from);
//						plr(ep_to,local_epid_from,pl);
//					}
//				}
//			}
//		}
//		catch(e){
//			tp.GetLogger().Fatal('Transport error at unpack: '+e.toString(),YgEs.FromError(e));
//		}
//	}
//
//	tp.AttachSession=(sess)=>{
//		let sid=sess.GetInstanceID();
//		if(tp._private_.session[sid]){
//			tp.GetLogger().Warn(()=>'Session '+sid+' already attached');
//			return sess;
//		}
//		tp._private_.session[sid]=sess.Open();
//		return sess;
//	}
//
//	tp.DetachSession=(sess)=>{
//		let sid=sess.GetInstanceID();
//		let sh=tp._private_.session[sid];
//		if(!sh){
//			tp.GetLogger().Warn(()=>'Session '+sid+' not attached');
//			return;
//		}
//		sh.Close();
//		delete tp._private_.session[sid];
//	}
//
//	tp._private_.host=opt.HasHost?EndPoint.Create(tp,{
//		Log:tp.GetLogger(),
//		Launcher:tp.GetLauncher(),
//		HappenTo:tp.GetHappeningManager(),
//		OnReceived:opt.OnReceived,
//		EPID:null,
//	}).Fetch():null;
//
//	return tp;
//}
//
//function _loopback_new(opt={}){
//
//	let prm=Object.assign({},opt,{
//		Name:'YgEs.Transport.Loopback',
//		OnSend:(tp,ep_from,remote_epid_to,pack)=>{
//			tp.Receive(remote_epid_to,pack);
//		},
//	});
//	if(opt.Log)prm.Log=opt.Log;
//	if(opt.Launcher)prm.Launcher=opt.Launcher;
//	if(opt.HappenTo)prm.HappenTo=opt.HappenTo;
//
//	let tp=_transport_new(prm);
//	return tp;
//}
//
//function _terminate_new(opt={}){
//
//	let prm=Object.assign({},opt,{
//		Name:'YgEs.Transport.Terminate',
//	});
//	if(opt.Log)prm.Log=opt.Log;
//	if(opt.Launcher)prm.Launcher=opt.Launcher;
//	if(opt.HappenTo)prm.HappenTo=opt.HappenTo;
//
//	return _transport_new(prm);
//}



function _recvctrl_new(){

	let ct={
	}
	return ct;
}

function _recvctrlset_new(){

	let ctset={target:{}}
	ctset.Get=(k)=>{
		return ctset.target[k]??null;
	}
	ctset.Ref=(k)=>{
		let t=ctset.target[k];
		if(!t)t=ctset.target[k]=_recvctrl_new();
		return t;
	}
	ctset.Each=(cb)=>{
		for(let k in ctset.target)cb(k,ctset.target[k]);
	}
	return ctset;
}

function _receiver_new(opt={}){

	let log=opt.Log??Log;

	let unorderable=opt.Unorderable??false;
	let delay_min=opt.DelayMin??0;
	let delay_max=opt.DelayMax??0;
	let dub_ratio=opt.DubRatio??0;
	let dub_interval_min=opt.DubIntervalMin??0;
	let dub_interval_max=opt.DubIntervalMax??0;

	let prm=YgEs.Customize(opt,{
		Name:'YgEs.Receiver',
		Log:{Class:'YgEs.Logger'},
		Launcher:{Class:'YgEs.Laungher'},
		HappenTo:{Class:'YgEs.HappeningManager'},
		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
		TraceAgent:{Mono:true,Init:null},
		TraceStMac:{Mono:true,Init:null},
		TraceProc:{Mono:true,Init:null},
	},log);

	prm.AgentBypasses=['Receive']

	const onOpen=opt.OnOpen??((agent)=>{});
	prm.OnOpen=(agent)=>{
		onOpen(agent);
	}

	const onClose=opt.OnClose??((agent)=>{});
	prm.OnClose=(agent)=>{
		onClose(agent);
	}

	const onReady=opt.OnReady??((agent)=>{});
	prm.OnReady=(agent)=>{
		onReady(agent);
	}

	const onGate=opt.OnGate??((recver,from,packed)=>packed);

	const onDecode=opt.OnDecode??((recver,from,packed)=>{
		try{
			return JSON.parse(packed);
		}
		catch(e){
			return null;
		}
	});

	let priv={
		// control set 
		cset:_recvctrlset_new(),
		// attaching Transport 
		tp:null,
	}

	let recver=Agent.StandBy(prm);
	recver._private_.recv=priv;

	const launch=recver.GetLauncher().CreateLauncher({Limit:unorderable?-1:1});

	const checkReady=()=>{
		if(!recver.IsReady()){
			log.Fatal('Receiver ('+recver.Name+') is not ready');
			return false;
		}
		return true;
	}

//	const onReceived=(recver,from,contents)=>{
//
//		let ep=recver._private_.ep[target];
//		if(!ep){
//			log.Notice('Receiver ('+recver.Name+') not have an EndPoint for received for '+target,contents);
//			return;
//		}
//
//		for(let pl of contents){
//			ep._private_.Receive(ep,from,pl.Type,pl.Body);
//		}
//
//	}

	const callRecv=(from,contents)=>{
		priv.tp.agent._private_.tp.recv(from,contents);

		if(dub_ratio<=0)return;
		if(Math.random()>=dub_ratio)return;

		let delay=(dub_interval_max<1)?0:
			(dub_interval_min+Math.random()*(dub_interval_max-dub_interval_min));
		launch.Delay(delay,()=>callRecv(from,contents));
	}

//	recver.Attach=(name,ep)=>{
//		if(recver._private_.ep[name]){
//			log.Warn('Receiver ('+recver.Name+') received from '+from+' for '+target,contents);
//		}
//
//		recver._private_.ep[name]=ep.GetAgent();
//	}
//
//	recver.Detach=(name)=>{
//		if(!recver._private_.ep[name])return;
//		delete recver._private_.ep[name];
//	}

	recver.Receive=(from,packed)=>{

		if(!priv.tp){
			log.Tick('Receiver ('+recver.Name+') not attached to a Transport, abandon it',packed);
			return;
		}
		if(!recver.IsReady()){
			log.Tick('Receiver ('+recver.Name+') received out of the service, abandon it',packed);
			return;
		}

		packed=onGate(recver,from,packed);
		if(!packed){
			log.Tick('Receiver ('+recver.Name+') received invalid from '+from,packed);
			return;
		}

		let contents=onDecode(recver,from,packed);
		if(!contents){
			log.Tick('Receiver ('+recver.Name+') received broken from '+from,packed);
			return;
		}

		log.Tick('Receiver ('+recver.Name+') received from '+from,contents);

		if(delay_max<1){
			callRecv(from,contents);
		}
		else{
			let delay=(delay_max<1)?0:
				(delay_min+Math.random()*(delay_max-delay_min));
			launch.Delay(delay,()=>callRecv(from,contents));
		}

//		if(delay_max<1){
//			priv.tp.agent._private_.tp.recv(from,contents);
//		}
//		else{
//			let delay=(delay_max<1)?0:
//				(delay_min+Math.random()*(delay_max-delay_min));
//			launch.Delay(delay,()=>onReceived(recver,from,target,contents));
//		}
//		if(dubbing>0 && Math.random()<dubbing){
//
//			log.Tick('Receiver ('+recver.Name+') dub test from '+from+' for '+target,contents);
//
//			let delay=(delay_max<1)?0:
//				(delay_min+Math.random()*(delay_max-delay_min));
//			launch.Delay(delay,()=>onReceived(recver,from,target,contents));
//		}
//
//////		let remote_epid_from=onExtractSenderEPID(tp,data);
////		let ep_to=tp.GetEndPoint(local_epid_to);
////
////		if(!ep_to){
////			tp.GetLogger().Notice(()=>((local_epid_to==null)?'Host':('EndPoint '+local_epid_to))+' not found in Transport '+tp.Name);
////			return;
////		}
////
////		try{
////			let pla=onExtractPayloadArray(data);
////			if(!Array.isArray(pla)){
////				tp.GetLogger().Notice(()=>'No payloads: ',data);
////			}
////			else for(let pl of pla){
////
////				let sid=onExtractSessionID(pl);
////				if(sid){
////					// receive for a session 
////					let sess=tp._private_.session[sid];
////					if(!sess){
////						tp.GetLogger().Notice(()=>'Unknown session: '+sid);
////					}
////					else{
////						let plt=onExtractPayloadType(pl);
////						sess.GetAgent()._private_.receive(ep_to,local_epid_from,plt,pl);
////					}
////				}
////				else if(!plrs){
////					// receive plain payload 
////					ep_to._private_.receive(local_epid_from,pl);
////				}
////				else{
////					// receive by payload type 	
////					let plt=onExtractPayloadType(pl);
////					let pls=(plt==null)?null:plss[plt];
////					let plr=(plt==null)?null:plrs[plt];
////					if(!plr){
////						tp.GetLogger().Notice(()=>'Receiver not defined: '+plt);
////					}
////					else if(!pls?.QuickCall){
////						// call queue 
////						tp.GetLogger().Tick(()=>'Payload queued '+local_epid_from+' => '+local_epid_to,pl);
////						ep_to._private_.recvq.push({
////							From:local_epid_from,
////							Payload:pl,
////							Spec:pls,
////							Call:()=>{
////								pls._private_.OnReceived(ep_to,local_epid_from);
////								plr(ep_to,local_epid_from,pl);
////							},
////						});
////					}
////					else{
////						// call now 
////						pls._private_.OnReceived(ep_to,local_epid_from);
////						plr(ep_to,local_epid_from,pl);
////					}
////				}
////			}
////		}
////		catch(e){
////			tp.GetLogger().Fatal('Transport error at unpack: '+e.toString(),YgEs.FromError(e));
////		}
	}

	return recver;
}

function _sender_new(opt={}){

	let log=opt.Log??Log;

	let unorderable=opt.Unorderable??false;
	let delay_min=opt.DelayMin??0;
	let delay_max=opt.DelayMax??0;
	let dub_ratio=opt.DubRatio??0;
	let dub_interval_min=opt.DubIntervalMin??0;
	let dub_interval_max=opt.DubIntervalMax??0;

	let prm=YgEs.Customize(opt,{
		Name:'YgEs.Sender',
		Log:{Class:'YgEs.Logger'},
		Launcher:{Class:'YgEs.Laungher'},
		HappenTo:{Class:'YgEs.HappeningManager'},
		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
		TraceAgent:{Mono:true,Init:null},
		TraceStMac:{Mono:true,Init:null},
		TraceProc:{Mono:true,Init:null},
	},log);

	prm.AgentBypasses=['Send']

	const onOpen=opt.OnOpen??((agent)=>{});
	prm.OnOpen=(agent)=>{
		onOpen(agent);
	}

	const onClose=opt.OnClose??((agent)=>{});
	prm.OnClose=(agent)=>{
		onClose(agent);
	}

	const onReady=opt.OnReady??((agent)=>{});
	prm.OnReady=(agent)=>{
		onReady(agent);
	}

	const onEncode=opt.OnEncode??((sender,contents)=>{
		return JSON.stringify(contents);
	});

	const onSend=opt.OnSend??((sender,packed)=>{
		log.Fatal('OnSend is not impremented in Sender',packed);
	});

	let priv={
	}

	let sender=Agent.StandBy(prm);
	sender._private_.sender=priv;

	const launch=sender.GetLauncher().CreateLauncher({Limit:unorderable?-1:1});

	const checkReady=()=>{
		if(!sender.IsReady()){
			log.Fatal('Sender ('+sender.Name+') is not ready');
			return false;
		}
		return true;
	}

	const callSend=(packed)=>{
		onSend(sender,packed);
		if(dub_ratio<=0)return;
		if(Math.random()>=dub_ratio)return;

		let delay=(dub_interval_max<1)?0:
			(dub_interval_min+Math.random()*(dub_interval_max-dub_interval_min));
		launch.Delay(delay,()=>callSend(packed));
	}

	sender.Send=(contents)=>{
		if(!checkReady())return;

		let packed=onEncode(sender,contents);

		if(delay_max<1){
			callSend(packed);
		}
		else{
			let delay=(delay_max<1)?0:
				(delay_min+Math.random()*(delay_max-delay_min));
			launch.Delay(delay,()=>callSend(packed));
		}
	}

	return sender;
}

function _loopback_new(receiver,opt={}){

	let log=opt.Log??Log;
	let name=opt.Name??'YgEs.Sender.Loopback';
	let prm=YgEs.Customize(opt,{
		Name:name,
		Log:{Class:'YgEs.Logger'},
		Launcher:{Class:'YgEs.Laungher'},
		HappenTo:{Class:'YgEs.HappeningManager'},
		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
	},log);

	prm.OnSend=(sender,packed)=>{
		if(!receiver)return;
		receiver.Receive('Loopback',packed);
	}

	if(!receiver){
		log.Fatal('receiver not defined for '+name);
	}
	else prm.Dependencies.push(receiver);

	let sender=_sender_new(prm);

	return sender;
}

function _terminate_new(opt={}){

	let log=opt.Log??Log;
	let prm=YgEs.Customize(opt,{
		Name:'YgEs.Sender.Terminate',
		Log:{Class:'YgEs.Logger'},
		Launcher:{Class:'YgEs.Laungher'},
		HappenTo:{Class:'YgEs.HappeningManager'},
		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
	},log);

	prm.OnSend=(sender,packed)=>{
		log.Tick('Sending terminated',packed);
	}

	return _sender_new(prm);
}

function _tpctrl_new(){

	let ct={
		SendQ:[],
	}
	return ct;
}

function _tpctrlset_new(){

	let ctset={target:{}}
	ctset.Get=(k)=>{
		return ctset.target[k]??null;
	}
	ctset.Ref=(k)=>{
		let t=ctset.target[k];
		if(!t)t=ctset.target[k]=_tpctrl_new();
		return t;
	}
	ctset.Each=(cb)=>{
		for(let k in ctset.target)cb(k,ctset.target[k]);
	}
	return ctset;
}

function _transport_new(opt={}){

	let log=opt.Log??Log;
	let prm=YgEs.Customize(opt,{
		Name:'YgEs.Transport',
		Log:{Class:'YgEs.Logger'},
		Launcher:{Class:'YgEs.Laungher'},
		HappenTo:{Class:'YgEs.HappeningManager'},
		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
		TraceAgent:{Mono:true,Init:null},
		TraceStMac:{Mono:true,Init:null},
		TraceProc:{Mono:true,Init:null},
	},log);
	prm.PayloadSpecs=opt.PayloadSpecs??{}
	prm.PayloadHooks=opt.PayloadHooks??{}

	prm.AgentBypasses=[
		'GetPayloadSpecs',
		'AttachReceiver','DetachReceiver',
		'AttachSender','DetachReceiver',
		'AttachSelector',
		'GetEndPoint','Connect','Disconnect',
		'NewProtocol','ExpireProtocol',
	]

	const onOpen=opt.OnOpen??((agent)=>{});
	prm.OnOpen=(agent)=>{
		onOpen(agent);

		// open attached 
		for(let k in priv.recver){
			priv.recver[k].Open();
		}
		for(let k in priv.sender){
			priv.sender[k].Open();
		}
	}

	const onClose=opt.OnClose??((agent)=>{});
	prm.OnClose=(agent)=>{
		onClose(agent);

		// close attached 
		for(let k in priv.sender){
			priv.sender[k].Close();
		}
		for(let k in priv.recver){
			priv.recver[k].Close();
		}
	}

	const onReady=opt.OnReady??((agent)=>{});
	prm.OnReady=(agent)=>{
		onReady(agent);
	}

	let priv={
		// control set 
		cset:_tpctrlset_new(),
		// attached Receiver 
		recver:{},
		// attached Sender
		sender:{},
		// connected EndPoint 
		ep:{},
		// active Protocol 
		prot:{},
		// selector 
		selector:null,

		launch:(pid,from,target,type,body)=>{
			if(!checkReady())return;

			if(!priv.selector){
				log.Fatal(()=>'Transport ('+tp.Name+') has no selector to send',sq);
				return;
			}

			let sn=priv.selector(tp,target);
			if(!sn){
				log.Fatal(()=>'Transport ('+tp.Name+') has no sender to send to '+target,sq);
				return;
			}

			let cset=priv.cset.Ref(sn);

			let content={PID:pid,From:from,Type:type,Body:body}

			log.Tick(()=>'Transport ('+tp.Name+') launch to '+target,content);

			// queue this payload until kick() called 
			cset.SendQ.push(content);
		},
		kick:(target)=>{
			if(!checkReady())return;

			if(!priv.selector){
				log.Fatal(()=>'Transport ('+tp.Name+') has no selector to send',sq);
				return;
			}

			let sn=priv.selector(tp,target);
			if(!sn){
				log.Fatal(()=>'Transport ('+tp.Name+') has no sender to send to '+target,sq);
				return;
			}

			let sender=priv.sender[sn];
			if(!sender){
				log.Fatal(()=>'Transport ('+tp.Name+') not recognized sender named '+sn,sq);
				return;
			}

			// SendQ required 
			let cset=priv.cset.Get(sn);
			if(!cset)return;

			// flush SendQ 
			let sq=cset.SendQ;
			if(sq.length<1)return;
			cset.SendQ=[]
	
			sender.Send(sq);
		},
		kickAll:()=>{
			if(!checkReady())return;
			priv.cset.Each((target,obj)=>{priv.kick(target);});
		},
		recv:(from,contents)=>{
			if(!tp.IsReady()){
				log.Tick('Transport ('+tp.Name+') received out of the service, abandon it',contents);
				return;
			}

			for(let pl of contents){
				let plt=pl.Type;
				let pls=prm.PayloadSpecs[plt];
				if(!pls){
					log.Notice(()=>'undefined payload type: '+plt);
					continue;
				}

				let pid=pl.PID;
				if(!pid){
					// request from a guest 
					let cb=prm.PayloadHooks[plt]?.OnRequest;
					if(!cb){
						log.Notice(()=>'no hooks OnRequest of payload type: '+plt);
					}
					else{
						cb(tp,pl);
					}
				}
				else{
					let cb=null;
					let prot=priv.prot[pid];
					if(!prot){
						// handshaking 
						cb=prm.PayloadHooks[plt]?.OnHanding;
						if(!cb){
							log.Notice(()=>'no hooks OnHanding of payload type: '+plt,pl);
						}
						else{
							let epn=cb(tp,pl);
							if(epn==null){
								log.Tick(()=>'no handing EndPoint',pl);
							}
							else{
								prot=tp.NewProtocol(epn,pid);
								if(prot){
									log.Tick(()=>'handing accepted by EndPoint ('+epn+')',pl);
								}
							}
						}
					}
					if(!prot)continue;

					if(pls.UnlockOnce){
						for(let n of pls.UnlockOnce){
							prot.Unlock(n);
						}
					}

					// receivements 
					cb=prm.PayloadHooks[plt]?.OnReplied;
					if(cb && !cb(tp,prot,pl)){
						log.Tick(()=>'end of Protocol ('+pid+')',pl);
						tp.ExpireProtocol(pid);
					}
				}
			}
		},
	}

	let tp=Agent.StandBy(prm);
	tp._private_.tp=priv;

	const checkReady=()=>{
		if(!tp.IsReady()){
			log.Fatal('Transport ('+tp.Name+') is not ready');
			return false;
		}
		return true;
	}

	tp.GetPayloadSpecs=()=>prm.PayloadSpecs;

	tp.AttachReceiver=(name,recver)=>{

		log.Trace(()=>'Receiver ('+recver.Name+') attaching as '+name+' on Transport ('+tp.Name+')');

		if(recver._private_.recv.tp){
			log.Warn('Receiver ('+recver.Name+') already connected, cut off it');
			recver._private_.recv.tp.agent.DetachReceiver(recver._private_.recv.tp.name);
		}
		if(priv.recver[name]){
			log.Warn('Receiver['+name+'] already exists, replace it');
			tp.DetachReceiver(name);
		}

		priv.recver[name]=tp.IsOpen()?recver.Open():recver.Fetch();
		recver._private_.recv.tp={
			name:name,
			agent:tp,
		}
	}
	tp.DetachReceiver=(name)=>{
		let recver=priv.recver[name];
		if(!recver)return;

		if(!recver._private_.recv.tp){
			log.Warn(()=>'Receiver ('+recver.Name+') already detached');
		}
		else if(name!=recver._private_.recv.tp.name){
			log.Warn(()=>'Receiver ('+recver.Name+') attached as other name ('+recver._private_.recv.tp.name+' => '+name+')');
		}
		else if(tp!=recver._private_.recv.tp.agent){
			log.Warn(()=>'Receiver ('+recver.Name+') attached to other Transport ('+tp.Name+' => '+recver._private_.recv.tp.agent.Name+')');
		}

		recver._private_.recv.tp=null;

		log.Trace(()=>'Receiver ('+recver.Name+') detaching from Transport ('+tp.Name+')');

		recver.Close();
		delete priv.recver[name];
	}

	tp.AttachSender=(name,sender)=>{

		log.Trace(()=>'Sender ('+sender.Name+') attaching as '+name+' on Transport ('+tp.Name+')');

		if(priv.sender[name]){
			log.Warn('Sender['+name+'] already exists, replace it');
			tp.DetachSender(name);
		}
		priv.sender[name]=
			tp.IsOpen()?sender.Open():sender.Fetch();
	}
	tp.DetachSender=(name)=>{
		let sender=priv.sender[name];
		if(!sender)return;

		log.Trace(()=>'Sender ('+sender.Name+') detaching from Transport ('+tp.Name+')');

		sender.Close();
		delete priv.sender[name];
	}

	tp.AttachSelector=(cb_sel)=>{
		priv.selector=cb_sel;
	}

	tp.GetEndPoint=(name)=>priv.ep[name];
	tp.Connect=(name,ep)=>{

		log.Trace(()=>'EndPoint('+ep.Name+') connecting as '+name+' on Transport ('+tp.Name+')');

		if(priv.ep[name]){
			log.Warn('EndPoint['+name+'] already exists, replace it');
			tp.Disconnect(name);
		}

		ep=ep.GetAgent();
		let ep_priv=ep._private_.ep;

		if(ep_priv.tp){
			log.Warn('EndPoint['+name+'] already connected, reconnect it');
			ep_priv.tp.handle.Disconnect(ep_priv.tp.name);
		}

		priv.ep[name]=ep;
		ep_priv.tp={
			name:name,
			handle:ep.IsOpen()?tp.Open():tp.Fetch(),
		}
	}
	tp.Disconnect=(name)=>{
		let ep=priv.ep[name];
		if(!ep)return;

		ep=ep.GetAgent();
		let ep_priv=ep._private_.ep;

		if(!ep_priv.tp){
			// already disconnected 
			log.Warn('EndPoint['+name+'] already disconnected');
		}
		else if(name!=ep_priv.tp.name){
			log.Warn('EndPoint['+name+'] connected with other name');
		}
		else if(tp!=ep_priv.tp.handle.GetAgent()){
			log.Warn('EndPoint['+name+'] connected to other instance');
		}
		else{
			// disconnect now 

			log.Trace(()=>'EndPoint('+ep.Name+') disconnected from Transport ('+tp.Name+')');
			ep_priv.tp.handle.Close();
		}

		delete priv.ep[name];
		ep_priv.tp=null;
	}

	tp.NewProtocol=(epn,pid=undefined)=>{
		let ep=priv.ep[epn];
		if(!ep){
			log.Fatal('EndPoint('+epn+') not found in this Transport ('+tp.Name+')');
			return null;
		}


		if(pid==undefined){
			do{
				pid=YgEs.NextID();
			}while(priv.prot[pid]);
		}

		let prot=_protocol_new(pid,ep,log);
		priv.prot[pid]=prot;

		return prot;
	}
	tp.ExpireProtocol=(pid)=>{
		if(!priv.prot[pid])return;
		delete priv.prot[pid];
	}

	return tp;
}

function _protocol_new(pid,ep,log){

	let priv={
		pid:pid,
		ep:ep,
		calling:{},
	}

	let prot={
		Name:'YgEs.Protocol',
		_private_:{prot:priv},

		GetPID:()=>pid,
		GetEndPoint:()=>ep,

		Release:()=>{
			let tp=ep.GetTransportInstance();
			if(!tp)return null;
			tp.ExpireProtocol(prot.GetPID());
		},

		Launch:(target,type,body)=>{
			let tp=ep.GetTransportInstance();
			if(!tp)return;

			const plss=tp.GetPayloadSpecs();
			if(!plss){
				log.Fatal('PayloadSpecs not defined');
				return;
			}
			let pls=plss[type];
			if(!pls){
				log.Fatal('PayloadSpec['+type+'] not defined');
				return;
			}

			if(pls.CallOnce?.Limit){
				// this payload type is locked until reply or timeout 
				let now=Date.now();
				let cng=priv.calling[type];
				if(cng){
					// already calls with same payload type 
					if(cng.Timeout==null || cng.Timeout>now){
						log.Notice(()=>'Protocol ('+pid+') locked type '+type,body);
						return;
					}
				}
				else cng=priv.calling[type]={}
				cng.Timeout=(pls.CallOnce.Timeout)?(now+pls.CallOnce.Timeout):null;
			}

			ep.Launch(target,type,body,prot);
		},
		Kick:(target)=>{
			ep.Kick(target);
		},
		KickAll:()=>{
			ep.KickAll();
		},
		Send:(target,type,body)=>{
			prot.Launch(target,type,body);
			prot.Kick(target);
		},
		Unlock:(type)=>{
			if(!priv.calling[type])return;
			log.Tick(()=>'Protocol ('+pid+') unlock '+type);
			delete priv.calling[type];
		},
	}

	return prot;
}

function _session_new(opt={}){

//	let log=opt.Log??Log;
//	let prm=YgEs.Customize(opt,{
//		Name:'YgEs.Session',
//		Log:{Class:'YgEs.Logger'},
//		Launcher:{Class:'YgEs.Laungher'},
//		HappenTo:{Class:'YgEs.HappeningManager'},
//		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
//	},log);

	let sess=Agent.StandBy(prm);
//	sess._private_.host=null;
//	sess._private_.members={}
//
	return sess;
}

function _endpoint_new(opt={}){

	let log=opt.Log??Log;

	let prm=YgEs.Customize(opt,{
		Name:'YgEs.EndPoint',
		Log:{Class:'YgEs.Logger'},
		Launcher:{Class:'YgEs.Laungher'},
		HappenTo:{Class:'YgEs.HappeningManager'},
		Dependencies:{List:true,Init:[],Class:'YgEs.Agent'},
		TraceAgent:{Mono:true,Init:null},
		TraceStMac:{Mono:true,Init:null},
		TraceProc:{Mono:true,Init:null},
	},log);

	prm.AgentBypasses=['GetTransportName','Launch','Kick','KickAll','Send','Unlock']

	const onOpen=opt.OnOpen??((agent)=>{});
	prm.OnOpen=(agent)=>{
		onOpen(agent);
	}

	const onClose=opt.OnClose??((agent)=>{});
	prm.OnClose=(agent)=>{

		if(priv.tp){
			priv.tp.handle.Disconnect(priv.tp.name);
			priv.tp=null;
		}

		onClose(agent);
	}

	const onReady=opt.OnReady??((agent)=>{});
	prm.OnReady=(agent)=>{
		onReady(agent);
	}

	let priv={
		// connected Transport 
		tp:null,
	}

	let ep=Agent.StandBy(prm);
	ep._private_.ep=priv;

//	for(let type in plss){
//		ep._private_.plss[type]={
//			Unlock:[],
//		}
//	}
//	for(let type in plss){
//		let pls=plss[type];
//		// unlock target types by received type 
//		if(pls.CallOnce?.Reply)ep._private_.plss[pls.CallOnce.Reply].Unlock.push(type);
//	}
//
//	ep._private_.Receive=(ep,from,type,body)=>{
//		if(!checkReady())return;
//		let cset=ep._private_.cset.Get(from);
//
//		log.Tick('EndPoint ('+ep.Name+') received from '+from);
//
//		if(!plss){
//			// for no payload definitions 
//			onReceived(ep,from,type,body);
//			return;
//		}
//		let pls=plss[type];
//		if(!pls){
//			ep.GetLogger().Fatal(()=>'Undefined Payload: '+type,body);
//			return;
//		}
//
//		if(pls.CallOnce?.Limit && pls.CallOnce?.Reply!=null){
//			let pls2=ep._private_.plss[pls.CallOnce.Reply];
//			if(!pls2){
//				tp.GetLogger().Warn('PayloadType '+pls.CallOnce.Reply+' not defined for unlock PayloadType '+type,body);
//			}
//			else{
//				for(let t2 of pls2.Unlock){
//					ep.Unlock(from,t2);
//				}
//			}
//		}
//
////		pls_s._private_.OnReceived=(ep,ep_from)=>{
////			for(let plt2 of pls_s._private_.UnlockTarget){
////				ep.UnlockOnce(ep_from,plt2);
////			}
////		}
//
//		let plr=plrs[type];
//		if(!plr){
//			ep.GetLogger().Fatal(()=>'Undefined receiver func for Payload '+type,body);
//			return;
//		}
//		plr(ep,from,type,body);
//	}

	const checkReady=()=>{
		if(!ep.IsReady()){
			log.Fatal('EndPoint ('+ep.Name+') is not ready');
			return false;
		}
		return true;
	}

	const checkConnected=()=>{
		if(!priv.tp){
			log.Fatal('EndPoint ('+ep.Name+') is not connected to a Transport');
			return false;
		}
		return true;
	}

//	ep.GetInstanceID=()=>epid;

	ep.GetTransportName=()=>{
		if(!priv.tp)return undefined;
		return priv.tp.name;
	}
	ep.GetTransportInstance=()=>{
		if(!priv.tp)return undefined;
		return priv.tp.handle.GetAgent();
	}

	ep.Launch=(target,type,body,prot=null)=>{
		if(!checkConnected())return;

		let tp=priv.tp.handle.GetAgent();
		let tp_priv=tp._private_.tp;
		let pid=prot?prot.GetPID():null;
		let from=priv.tp?.name;
		tp_priv.launch(pid,from,target,type,body);
	}
	ep.Kick=(target)=>{
		if(!checkConnected())return;

		let tp=priv.tp.handle.GetAgent();
		let tp_priv=tp._private_.tp;
		tp_priv.kick(target);
	}
	ep.KickAll=(target)=>{
		if(!checkConnected())return;

		let tp=priv.tp.handle.GetAgent();
		let tp_priv=tp._private_.tp;
		tp_priv.kickAll(target);
	}
	ep.Send=(target,type,body,prot=null)=>{
		ep.Launch(target,type,body,prot);
		ep.Kick(target);
	}

	return ep;
}

let Network=YgEs.Network={
	Name:'YgEs.Network',
	User:{},
	_private_:{},

	CreateSender:_sender_new,
	CreateReceiver:_receiver_new,
	CreateTransport:_transport_new,
	CreateSession:_session_new,
	CreateEndPoint:_endpoint_new,

	CreateLoopback:_loopback_new,
	CreateTerminator:_terminate_new,
}

})();
export default YgEs.Network;
