// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import YgEs from './common.js';
import Engine from './engine.js';
import HappeningManager from './happening.js';
import Log from './logger.js';

// StateMachine ------------------------- //
(()=>{ // local namespace 

function _run(start,states={},opt={}){

	const trace_proc=opt.TraceProc??null;
	const trace_stmac=opt.TraceStMac??null;

	let launcher=opt.Launcher??Engine;
	let cur=null;

	let name=opt.Name??'YgEs.StateMachine';
	let log=opt.Log??Log;
	let happen=opt.HappenTo??HappeningManager;
	let user=opt.User??{};

	let state_prev=null;
	let state_cur=null;
	let state_next=start;

	let GetInfo=(site='')=>{
		return {
			Name:name,
			CrashSite:site,
			Prev:state_prev,
			Cur:state_cur,
			Next:state_next,
			User:user,
		}
	}

	let ctrl={
		Name:name+'.Control',
		User:user,
		_private_:{},

		GetLogger:()=>log,
		GetHappeningManager:()=>happen,
		GetPrevState:()=>state_prev,
		GetCurState:()=>state_cur,
		GetNextState:()=>state_next,
		GetInfo:()=>GetInfo(),
	}

	let poll_nop=(proc)=>{}
	let poll_cur=poll_nop;

	let call_start=(proc)=>{
		if(state_next==null){
			// normal end 
			cur=null;
			state_prev=state_cur;
			state_cur=null;
			poll_cur=poll_nop;

			if(trace_stmac)log.Trace(()=>name+' is end');
			return;
		}
		cur=states[state_next]??null;
		if(!cur){
			if(trace_stmac)log.Trace(()=>name+':'+state_next+' is missed');

			happen.Happen(
				'Missing State: '+state_next,{
				Class:'YgEs.StateMachine',
				Cause:'MissingState',
				Info:GetInfo('selecting'),
			});
			poll_cur=poll_nop;
			return;
		}
		state_prev=state_cur;
		state_cur=state_next;
		state_next=null;
		try{
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' is start');

			if(cur.OnStart)cur.OnStart(ctrl,proc);
			poll_cur=poll_up;
		}
		catch(e){
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on start',e);

			happen.Happen(e,{
				Class:'YgEs.StateMachine',
				Cause:'ThrownFromCallback',
				Info:GetInfo('OnStart'),
			});
			poll_cur=poll_nop;
			return;
		}
		// can try extra polling 
		poll_cur(proc);
	}
	let poll_up=(proc)=>{
		try{
			var r=cur.OnPollInUp?cur.OnPollInUp(ctrl,proc):true;
		}
		catch(e){
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on poll',e);

			happen.Happen(e,{
				Class:'YgEs.StateMachine',
				Cause:'ThrownFromCallback',
				Info:GetInfo('OnPollInUp'),
			});
			poll_cur=poll_nop;
			return;
		}
		if(r==null)return; // continuing 
		else if(r===false)proc.Abort();
		else if(r===true){
			try{
				if(trace_stmac)log.Trace(()=>name+':'+state_cur+' is ready');

				// normal transition 
				if(cur.OnReady)cur.OnReady(ctrl,proc);
				poll_cur=poll_keep;
			}
			catch(e){
				if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on ready',e);

				happen.Happen(e,{
					Class:'YgEs.StateMachine',
					Cause:'ThrownFromCallback',
					Info:GetInfo('OnReady'),
				});
				poll_cur=poll_nop;
				return;
			}
			// can try extra polling 
			poll_cur(proc);
		}
		else{
			// interruption 
			state_next=r.toString();
			call_end(proc);
		}
	}
	let poll_keep=(proc)=>{
		try{
			var r=cur.OnPollInKeep?cur.OnPollInKeep(ctrl,proc):true;
		}
		catch(e){
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on poll in keep',e);

			happen.Happen(e,{
				Class:'YgEs.StateMachine',
				Cause:'ThrownFromCallback',
				Info:GetInfo('OnPollInKeep'),
			});
			poll_cur=poll_nop;
			return;
		}
		if(r==null)return; // continuing 
		else if(r===false)proc.Abort();
		else if(r===true){
			// normal end 
			state_next=null;
			call_stop(proc);
		}
		else{
			// normal transition 
			state_next=r.toString();
			call_stop(proc);
		}
	}
	let call_stop=(proc)=>{
		try{
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' is stop');

			if(cur.OnStop)cur.OnStop(ctrl,proc);
			poll_cur=poll_down;
		}
		catch(e){
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on stop',e);

			happen.Happen(e,{
				Class:'YgEs.StateMachine',
				Cause:'ThrownFromCallback',
				Info:GetInfo('OnStop'),
			});
			poll_cur=poll_nop;
			return;
		}
		// can try extra polling 
		poll_cur(proc);
	}
	let poll_down=(proc)=>{
		try{
			var r=cur.OnPollInDown?cur.OnPollInDown(ctrl,proc):true;
		}
		catch(e){
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on poll in down',e);

			happen.Happen(e,{
				Class:'YgEs.StateMachine',
				Cause:'ThrownFromCallback',
				Info:GetInfo('OnPollInDown'),
			});
			poll_cur=poll_nop;
			return;
		}
		if(r==null)return; // continuing 
		else if(r===false)proc.Abort();
		else if(r===true){
			// normal transition 
			call_end(proc);
		}
		else{
			// interruption 
			state_next=r.toString();
			call_end(proc);
		}
	}
	let call_end=(proc)=>{
		try{
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' is end');

			if(cur.OnEnd)cur.OnEnd(ctrl,proc);
			call_start(proc);
		}
		catch(e){
			if(trace_stmac)log.Trace(()=>name+':'+state_cur+' thrown on end',e);

			happen.Happen(e,{
				Class:'YgEs.StateMachine',
				Cause:'ThrownFromCallback',
				Info:GetInfo('OnEnd'),
			});
			poll_cur=poll_nop;
			return;
		}
	}

	let stmac={
		Name:name+'.Proc',
		Log:log,
		HappenTo:happen,
		User:user,
		TraceProc:trace_proc,
		OnStart:(proc)=>{
			call_start(proc);
		},
		OnPoll:(proc)=>{
			poll_cur(proc);
			return !!cur;
		},
		OnDone:opt.OnDone??null,
		OnAbort:opt.OnAbort??null,
	}

	let proc=launcher.Launch(stmac);
	let ProcInfo=proc.GetInfo;
	proc.GetInfo=()=>Object.assign(ProcInfo(),{StateMachine:GetInfo()});
	ctrl.IsStarted=proc.IsStarted;
	ctrl.IsFinished=proc.IsFinished;
	ctrl.IsAborted=proc.IsAborted;
	ctrl.IsEnd=proc.IsEnd;
	ctrl.Abort=proc.Abort;
	ctrl.Sync=proc.Sync;
	ctrl.ToPromise=proc.ToPromise;
	return ctrl;
}

YgEs.StateMachine={
	Name:'YgEs.StateMachine.Container',
	User:{},
	_private_:{},

	Run:_run,
}

})();
export default YgEs.StateMachine;
