// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import YgEs from './common.js';
import HappeningManager from './happening.js';
import Engine from './engine.js';
import StateMachine from './stmac.js';
import Util from './util.js';

// Agent -------------------------------- //
(()=>{ // local namespace 

// state 
const _state_names=Object.freeze(['IDLE','BROKEN','DOWN','REPAIR','UP','REST','TROUBLE','HEALTHY']);

// make reverse lookup 
let ll={}
for(let i in _state_names)ll[_state_names[i]]=parseInt(i);
const _state_lookup=Object.freeze(ll);

function _standby(prm){

	let opencount=0;
	let ctrl=null;
	let ready=false;
	let halt=false;
	let restart=false;
	let aborted=false;
	let wait=[]

	let name=prm.name??'YgEs_Agent';
	let happen=prm.happen??HappeningManager.CreateLocal();
	let launcher=prm.launcher??Engine.CreateLauncher();
	let user=prm.user??{};

	let GetInfo=(phase)=>{
		return {
			name:name,
			phase:phase,
			state:ctrl?ctrl.GetCurState():'NONE',
			wait:wait,
			user:user,
		}
	}

	let states={
		'IDLE':{
			poll_keep:(ctrl,user)=>{
				if(opencount<1)return true;
				restart=false;

				happen.CleanUp();
				return happen.IsCleaned()?'UP':'REPAIR';
			},
		},
		'BROKEN':{
			poll_keep:(ctrl,user)=>{
				if(opencount<1)return true;
				restart=false;

				return 'REPAIR';
			},
		},
		'REPAIR':{
			cb_start:(ctrl,user)=>{

				try{
					//start repairing 
					wait=[]
					if(prm.cb_repair)prm.cb_repair(agent);
				}
				catch(e){
					happen.HappenProp({
						class:'YgEs_Agent_Error',
						cause:'throw from a callback',
						src:GetInfo('cb_repair'),
						err:YgEs.FromError(e),
					});
				}
			},
			poll_keep:(ctrl,user)=>{
				if(opencount<1){
					happen.CleanUp();
					return happen.IsCleaned()?'IDLE':'BROKEN';
				}

				// wait for delendencies 
				let cont=[]
				for(let d of wait){
					try{
						if(d())continue;
						cont.push(d);
					}
					catch(e){
						happen.HappenProp({
							class:'YgEs_Agent_Error',
							cause:'throw from a callback',
							src:GetInfo('wait for repair'),
							err:YgEs.FromError(e),
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
			cb_start:(ctrl,user)=>{
				try{
					wait=[]

					// down dependencles too 
					if(prm.dependencies){
						Util.SafeDictIter(prm.dependencies,(k,h)=>{
							h.Close();
						});
					}

					if(ctrl.GetPrevState()=='UP'){
						if(prm.cb_back)prm.cb_back(agent);
					}
					else{
						if(prm.cb_close)prm.cb_close(agent);
					}
				}
				catch(e){
					happen.HappenProp({
						class:'YgEs_Agent_Error',
						cause:'throw from a callback',
						src:GetInfo('cb_close'),
						err:YgEs.FromError(e),
					});
				}
			},
			poll_keep:(ctrl,user)=>{

				// wait for delendencies 
				let cont=[]
				for(let d of wait){
					try{
						if(d())continue;
						cont.push(d);
					}
					catch(e){
						happen.HappenProp({
							class:'YgEs_Agent_Error',
							cause:'throw from a callback',
							src:GetInfo('wait for down'),
							err:YgEs.FromError(e),
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
			cb_start:(ctrl,user)=>{
				try{
					wait=[]
					if(prm.cb_open)prm.cb_open(agent);

					// up dependencles too 
					if(prm.dependencies){
						Util.SafeDictIter(prm.dependencies,(k,h)=>{
							h.Open();
							wait.push(()=>h.IsReady());
						});
					}
				}
				catch(e){
					happen.HappenProp({
						class:'YgEs_Agent_Error',
						cause:'throw from a callback',
						src:GetInfo('cb_open'),
						err:YgEs.FromError(e),
					});
				}
			},
			poll_keep:(user)=>{
				if(opencount<1 || restart)return 'DOWN';

				// wait for delendencies 
				let cont=[]
				for(let d of wait){
					try{
						if(d())continue;
						cont.push(d);
					}
					catch(e){
						happen.HappenProp({
							class:'YgEs_Agent_Error',
							cause:'throw from a callback',
							src:GetInfo('wait for up'),
							err:YgEs.FromError(e),
						});
					}
				}
				wait=cont;
				if(!happen.IsCleaned())return 'DOWN';
				if(wait.length<1)return 'HEALTHY';
			},
			cb_end:(ctrl,user)=>{
				if(ctrl.GetNextState()=='HEALTHY'){
					try{
						// mark ready before callback 
						ready=true;
						if(prm.cb_ready)prm.cb_ready(agent);
					}
					catch(e){
						happen.HappenProp({
							class:'YgEs_Agent_Error',
							cause:'throw from a callback',
							src:GetInfo('cb_ready'),
							err:YgEs.FromError(e),
						});
					}
				}
			},
		},
		'HEALTHY':{
			poll_keep:(ctrl,user)=>{
				if(opencount<1 || restart){
					ready=false;
					return 'DOWN';
				}
				if(!happen.IsCleaned())return 'TROUBLE';

				try{
					if(prm.poll_healthy)prm.poll_healthy(agent);
				}
				catch(e){
					happen.HappenProp({
						class:'YgEs_Agent_Error',
						cause:'throw from a callback',
						src:GetInfo('poll_healthy'),
						err:YgEs.FromError(e),
					});
					return 'TROUBLE';
				}
			},
		},
		'TROUBLE':{
			poll_keep:(ctrl,user)=>{
				if(opencount<1 || restart){
					ready=false;
					return 'DOWN';
				}
				happen.CleanUp();
				if(happen.IsCleaned())return 'HEALTHY';

				try{
					if(prm.poll_trouble)prm.poll_trouble(agent);
				}
				catch(e){
					happen.HappenProp({
						class:'YgEs_Agent_Error',
						cause:'throw from a callback',
						src:GetInfo('poll_trouble'),
						err:YgEs.FromError(e),
					});
				}
				if(!happen.IsCleaned())return 'HALT';
			},
		},
		'HALT':{
			cb_start:(ctrl,user)=>{
				halt=true;
			},
			poll_keep:(ctrl,user)=>{
				if(opencount<1 || restart){
					ready=false;
					return 'DOWN';
				}
				happen.CleanUp();
				if(happen.IsCleaned())return 'HEALTHY';
			},
			cb_end:(ctrl,user)=>{
				halt=false;
			},
		},
	}

	let agent={
		name:name,
		User:user,

		IsOpen:()=>opencount>0,
		IsBusy:()=>!!ctrl || opencount>0,
		IsReady:()=>ready && opencount>0,
		IsHalt:()=>halt,
		GetState:()=>ctrl?ctrl.GetCurState():'NONE',

		GetLauncher:()=>{return launcher;},
		GetHappeningManager:()=>{return happen;},
		GetDependencies:()=>{return prm.dependencies;},

		WaitFor:(cb)=>{wait.push(cb)},
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
		name:name+'_Control',
		happen:happen,
		launcher:launcher,
		User:user,
		cb_done:(user)=>{
			ctrl=null;
			aborted=false;
			if(prm.cb_finish)prm.cb_finish(agent,happen.IsCleaned());
		},
		cb_abort:(user)=>{
			ctrl=null;
			aborted=true;
			if(prm.cb_abort)prm.cb_abort(agent);
		},
	}

	let handle=(w)=>{
		let in_open=false;
		let h={
			name:name+'_Handle',

			GetAgent:()=>{return agent;},
			GetLauncher:()=>agent.GetLauncher(),
			GetHappeningManager:()=>agent.GetHappeningManager(),
			GetDependencies:()=>agent.GetDependencies(),

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
					++opencount;
				}
				if(!ctrl)ctrl=StateMachine.Run('IDLE',states,ctrlopt);
			},
			Close:()=>{
				if(!in_open)return;
				in_open=false;
				--opencount;
			},
		}
		return h;
	}

	return agent;
}

YgEs.AgentManager={
	name:'YgEs_AgentManager',
	User:{},

	StandBy:_standby,
	Launch:(prm)=>{return _standby(prm).Fetch();},
	Run:(prm)=>{return _standby(prm).Open();},
}

})();
export default YgEs.AgentManager;
