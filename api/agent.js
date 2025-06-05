// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import YgEs from './common.js';
import HappeningManager from './happening.js';
import Log from './logger.js';
import Engine from './engine.js';
import StateMachine from './stmac.js';
import Util from './util.js';

// Agent -------------------------------- //
(()=>{ // local namespace 

// state 
const _state_names=Object.freeze(['IDLE','BROKEN','DOWN','REPAIR','UP','HALT','TROUBLE','HEALTHY']);

// make reverse lookup 
let ll={}
for(let i in _state_names)ll[_state_names[i]]=parseInt(i);
const _state_lookup=Object.freeze(ll);

function _standby(prm){

	const trace_proc=prm.TraceProc??null;
	const trace_stmac=prm.TraceStMac??null;
	const trace_agent=prm.TraceAgent??null;
	const depends=prm.Dependencies;

	let opencount=0;
	let ctrl=null;
	let ready=false;
	let halt=false;
	let restart=false;
	let aborted=false;
	let wait=[]
	let depended=[]

	let name=prm.Name??'YgEs.Agent';
	let log=prm.Log??Log;
	let happen=prm.HappenTo??HappeningManager;
	let launcher=prm.Launcher??Engine;
	let user=prm.User??{};
	let abps=prm.AgentBypasses??[];
	let ubps=prm.UserBypasses??[];

	let GetInfo=(site='')=>{
		let r={
			Name:name,
			CrashSite:site,
			State:ctrl?ctrl.GetCurState():'NONE',
			Busy:!!ctrl,
			Ready:ready,
			Halt:halt,
			Aborted:aborted,
			Restarting:restart,
			Handles:opencount,
			User:user,
			Waiting:[],
			Happening:happen.GetInfo(),
			Launcher:launcher.GetInfo(),
		}
		for(let w of wait)r.Waiting.push({Label:w.Label,Prop:w.Prop});
		return r;
	}

	let states={
		'IDLE':{
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1)return true;
				restart=false;

				happen.CleanUp();
				return happen.IsCleaned()?'UP':'REPAIR';
			},
		},
		'BROKEN':{
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1)return true;
				restart=false;

				return 'REPAIR';
			},
		},
		'REPAIR':{
			OnStart:(ctrl,proc)=>{

				if(trace_agent)log.Trace(()=>name+' start repairing');

				try{
					//start repairing 
					wait=[]
					if(prm.OnRepair)prm.OnRepair(agent);
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.Agent',
						Cause:'ThrownFromCallback',
						Info:GetInfo('OnRepair'),
					});
				}
			},
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1){
					happen.CleanUp();
					if(happen.IsCleaned()){
						if(trace_agent)log.Trace(()=>name+' cleaned up completely');
						return 'IDLE';
					}
					else{
						if(trace_agent)log.Trace(()=>name+' cannot clean');
						return 'BROKEN';
					}
				}

				// wait for delendencies 
				let cont=[]
				for(let d of wait){
					try{
						if(d.Chk(d.Prop))continue;
						cont.push(d);
					}
					catch(e){
						happen.Happen(e,{
							Class:'YgEs.Agent',
							Cause:'ThrownFromCallback',
							Info:GetInfo('wait for repair'),
						});
					}
				}
				wait=cont;
				if(wait.length>0)return;

				// wait for all happens resolved 
				happen.CleanUp();
				if(happen.IsCleaned())return 'UP';
			},
		},
		'DOWN':{
			OnStart:(ctrl,proc)=>{
				let back=false;
				try{
					wait=[]

					if(ctrl.GetPrevState()=='UP')back=true;

					if(trace_agent)log.Trace(()=>name+(back?'cancel opening':' start closing'));

					// down dependencles too 
					for(let h of depended)h.Close();
					depended=[]

					if(back){
						if(prm.OnBack)prm.OnBack(agent);
					}
					else{
						if(prm.OnClose)prm.OnClose(agent);
					}
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.Agent',
						Cause:'ThrownFromCallback',
						Info:GetInfo(back?'OnBack':'OnClose'),
					});
				}
			},
			OnPollInKeep:(ctrl,proc)=>{

				// wait for dependencies 
				let cont=[]
				for(let d of wait){
					try{
						if(d.Chk(d.Prop))continue;
						cont.push(d);
					}
					catch(e){
						happen.Happen(e,{
							Class:'YgEs.Agent',
							Cause:'ThrownFromCallback',
							Info:GetInfo('wait for down'),
						});
					}
				}
				wait=cont;
				if(wait.length>0)return null;
				happen.CleanUp();
				return happen.IsCleaned()?'IDLE':'BROKEN';
			},
		},
		'UP':{
			OnStart:(ctrl,proc)=>{

				if(trace_agent)log.Trace(()=>name+' start opening');

				try{
					depended=[]
					wait=[]
					if(prm.OnOpen)prm.OnOpen(agent);

					// up dependencles too 
					if(depends){
						for(let d of depends){
							depended.push(d.Open());
							wait.push({
								Label:'Depends '+d.Name,
								Chk:()=>d.IsReady(),
							});
						}
					}
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.Agent',
						Cause:'ThrownFromCallback',
						Info:GetInfo('OnOpen'),
					});
				}
			},
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1 || restart)return 'DOWN';

				// wait for delendencies 
				let cont=[]
				for(let d of wait){
					try{
						if(d.Chk(d.Prop))continue;
						cont.push(d);
					}
					catch(e){
						happen.Happen(e,{
							Class:'YgEs.Agent',
							Cause:'ThrownFromCallback',
							Info:GetInfo('wait for up'),
						});
					}
				}
				wait=cont;
				if(!happen.IsCleaned())return 'DOWN';
				if(wait.length<1)return 'HEALTHY';
			},
			OnEnd:(ctrl,proc)=>{
				if(ctrl.GetNextState()=='HEALTHY'){

					if(trace_agent)log.Trace(()=>name+' is ready');

					try{
						// mark ready before callback 
						ready=true;
						if(prm.OnReady)prm.OnReady(agent);
					}
					catch(e){
						happen.Happen(e,{
							Class:'YgEs.AgentError',
							Cause:'ThrownFromCallback',
							Info:GetInfo('OnReady'),
						});
					}
				}
			},
		},
		'HEALTHY':{
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1 || restart){
					ready=false;
					return 'DOWN';
				}
				if(!happen.IsCleaned())return 'TROUBLE';

				try{
					if(prm.OnPollInHealthy)prm.OnPollInHealthy(agent);
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.AgentError',
						Cause:'ThrownFromCallback',
						Info:GetInfo('OnPollInHealthy'),
					});
					return 'TROUBLE';
				}
			},
		},
		'TROUBLE':{
			OnStart:(ctrl,proc)=>{

				if(trace_agent)log.Trace(()=>name+' is troubled');

				try{
					if(prm.OnTrouble)prm.OnTrouble(agent);
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.AgentError',
						Cause:'ThrownFromCallback',
						Info:GetInfo('OnTrouble'),
					});
				}
			},
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1 || restart){
					ready=false;
					return 'DOWN';
				}
				happen.CleanUp();
				if(happen.IsCleaned())return 'HEALTHY';

				try{
					let c=happen.CountIssues();
					if(prm.OnPollInTrouble)prm.OnPollInTrouble(agent);
					if(c<happen.CountIssues())return 'HALT';
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.AgentError',
						Cause:'ThrownFromCallback',
						Info:GetInfo('OnPollInTrouble'),
					});
					return 'HALT';
				}
			},
			OnEnd:(ctrl,proc)=>{
				if(ctrl.GetNextState()=='HEALTHY'){

					if(trace_agent)log.Trace(()=>name+' is recovered');

					try{
						if(prm.OnRecover)prm.OnRecover(agent);
					}
					catch(e){
						happen.Happen(e,{
							Class:'YgEs.AgentError',
							Cause:'ThrownFromCallback',
							Info:GetInfo('OnRecover'),
						});
					}
				}
			},
		},
		'HALT':{
			OnStart:(ctrl,proc)=>{
				halt=true;

				if(trace_agent)log.Trace(()=>name+' is halt');

				try{
					if(prm.OnHalt)prm.OnHalt(agent);
				}
				catch(e){
					happen.Happen(e,{
						Class:'YgEs.AgentError',
						Cause:'ThrownFromCallback',
						Info:GetInfo('OnHalt'),
					});
				}
			},
			OnPollInKeep:(ctrl,proc)=>{
				if(opencount<1 || restart){
					ready=false;
					return 'DOWN';
				}
				happen.CleanUp();
				if(happen.IsCleaned())return 'HEALTHY';
			},
			OnEnd:(ctrl,proc)=>{
				halt=false;

				if(ctrl.GetNextState()=='HEALTHY'){

					if(trace_agent)log.Trace(()=>name+' is recovered');

					try{
						if(prm.OnRecover)prm.OnRecover(agent);
					}
					catch(e){
						happen.Happen(e,{
							Class:'YgEs.AgentError',
							Cause:'ThrownFromCallback',
							Info:GetInfo('OnRecover'),
						});
					}
				}
			},
		},
	}

	let agent={
		Name:name+'.Worker',
		User:user,
		_private_:{
			depended:[], //  
		},

		IsOpen:()=>opencount>0,
		IsBusy:()=>!!ctrl || opencount>0,
		IsReady:()=>ready && opencount>0,
		IsHalt:()=>halt,
		GetState:()=>ctrl?ctrl.GetCurState():'NONE',
		GetInfo:()=>GetInfo(''),

		GetAgent:()=>agent,
		GetLogger:()=>log,
		GetLauncher:()=>{return launcher;},
		GetHappeningManager:()=>{return happen;},

		WaitFor:(label,cb_chk,prop={})=>{
			wait.push({Label:label,Chk:cb_chk,Prop:prop});
		},
		Restart:()=>{restart=true;},

		Fetch:()=>{
			return handle(agent);
		},
		Open:()=>{
			let h=agent.Fetch();
			h.Open();
			return h;
		},
	}

	let ctrlopt={
		Name:name+'.StateMachine',
		Log:log,
		HappenTo:happen,
		Launcher:launcher,
		User:user,
		TraceProc:trace_proc,
		TraceStMac:trace_stmac,
		OnDone:(proc)=>{
			if(trace_agent)log.Trace(()=>name+' finished');
			ctrl=null;
			aborted=false;
			if(prm.OnFinish)prm.OnFinish(agent,happen.IsCleaned());
		},
		OnAbort:(proc)=>{
			if(trace_agent)log.Trace(()=>name+' aborted');
			ctrl=null;
			aborted=true;
			if(prm.OnAbort)prm.OnAbort(agent);
		},
	}

	let handle=(w)=>{
		let in_open=false;
		let h={
			Name:name+'.Handle',
			User:{},

			GetAgent:()=>{return agent;},
			GetLogger:()=>agent.GetLogger(),
			GetLauncher:()=>agent.GetLauncher(),
			GetHappeningManager:()=>agent.GetHappeningManager(),

			IsOpenHandle:()=>in_open,
			IsOpenAgent:()=>agent.IsOpen(),
			IsBusy:()=>agent.IsBusy(),
			IsReady:()=>agent.IsReady(),
			IsHalt:()=>agent.IsHalt(),
			GetState:()=>agent.GetState(),

			Restart:()=>agent.Restart(),

			Open:()=>{
				if(!in_open){
					in_open=true;
					if(trace_agent)log.Trace(()=>name+' open; '+opencount+' => '+(opencount+1));
					++opencount;
				}
				if(!ctrl){
					ctrl=StateMachine.Run('IDLE',states,ctrlopt);
					let StMacInfo=ctrl.GetInfo;
					ctrl.GetInfo=()=>Object.assign(StMacInfo(),{Agent:GetInfo('')});
				}
			},
			Close:()=>{
				if(!in_open)return;
				in_open=false;
				if(trace_agent)log.Trace(()=>name+' close; '+opencount+' => '+(opencount-1));
				--opencount;
			},
		}
		for(let n of abps){
			h[n]=(...args)=>{
				if(!h.IsReady()){
					h.GetLogger().Notice('not ready');
					return null;
				}
				return agent[n].call(null,...args);
			}
		}
		for(let n of ubps){
			h[n]=(...args)=>{
				if(!h.IsReady()){
					h.GetLogger().Notice('not ready');
					return null;
				}
				return agent.User[n].call(null,...args);
			}
		}

		return h;
	}

	return agent;
}

YgEs.AgentManager={
	Name:'YgEs.AgentManager',
	User:{},
	_private_:{},

	StandBy:_standby,
	Launch:(prm)=>{return _standby(prm).Fetch();},
	Run:(prm)=>{return _standby(prm).Open();},
}

})();
export default YgEs.AgentManager;
