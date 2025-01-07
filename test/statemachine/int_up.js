// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import StateMachine from '../../api/stmac.js';

// State Interruption from Up ----------- //

const states={
	'Test1':{
		poll_keep:(ctx,user)=>{
			Test.chk_less_eq(++user.Count,10,'poll_keep called illegular');
			return (user.Count<10)?null:'Test2A';
		},
		cb_end:(ctx,user)=>{
			Test.chk_strict(++user.Count,11,'cb_end called illegular');
		},
	},
	'Test2A':{
		cb_start:(ctx,user)=>{
			Test.chk_strict(++user.Count,12,'cb_start called illegular');
		},
		poll_up:(ctx,user)=>{
			return 'Test2B';
		},
		poll_keep:(ctx,user)=>{
			Test.never("don't step it");
			return false;
		},
		poll_down:(ctx,user)=>{
			Test.never("don't step it");
			return false;
		},
		cb_end:(ctx,user)=>{
			Test.chk_strict(++user.Count,13,'cb_end called illegular');
		},
	},
	'Test2B':{
		cb_start:(ctx,user)=>{
			Test.chk_strict(++user.Count,14,'cb_start called illegular');
		},
		poll_keep:(ctx,user)=>{
			Test.chk_less_eq(++user.Count,20,'poll_keep called illegular');
			return (user.Count<20)?null:true;
		},
		cb_end:(ctx,user)=>{
			Test.chk_strict(++user.Count,21,'cb_end called illegular');
		},
	},
}

let opt={
	user:{Count:1}, // share in states 
	cb_done:(user)=>{
		Test.chk_strict(++user.Count,22,'cb_done called illegular');
	},
	cb_abort:(user)=>{
		Test.never('states abend');
	},
}

const scenaria=[
	{
		title:'Interruption from Up',
		proc:async (tool)=>{
			opt.launcher=tool.Launcher;
			opt.happen=tool.Launcher.HappenTo;

			// run with undefined state 
			// abort soon 
			StateMachine.Run('Test1',states,opt);

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
