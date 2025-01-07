// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import AgentManager from '../../api/agent.js';

// Agent Dependencies Test -------------- //

let agent=null;
let handle=null;

let workset1={
	user:{Count:0},
	cb_open:(agent)=>{
		Test.chk_strict(agent.IsBusy(),true);
		agent.WaitFor(()=>{
			return ++agent.User.Count>=10;
		});
	},
	cb_ready:(agent)=>{
		Test.chk_strict(agent.IsReady(),true);
	},
	cb_close:(agent)=>{
		Test.chk_strict(agent.IsReady(),false);
		agent.WaitFor(()=>{
			return ++agent.User.Count>=20;
		});
	},
	cb_finish:(agent)=>{
		Test.chk_strict(agent.IsBusy(),false);
	},
}

let workset2={
	user:{Count:0},
	dependencies:{w1:AgentManager.Launch(workset1)},
	cb_open:(agent)=>{
		Test.chk_strict(agent.IsBusy(),true);
	},
	cb_ready:(agent)=>{
		Test.chk_strict(agent.IsReady(),true);
		Test.chk_strict(agent.GetDependencies().w1.IsOpenAgent(),true);

		handle.Close();
		Test.chk_strict(agent.IsOpen(),false);
	},
	cb_close:(agent)=>{
		Test.chk_strict(agent.IsReady(),false);
		Test.chk_strict(agent.GetDependencies().w1.IsOpenAgent(),false);
	},
	cb_finish:(agent)=>{
		Test.chk_strict(agent.IsBusy(),false);
	},
}

const scenaria=[
	{
		title:'Agent Dependencies',
		proc:async (tool)=>{
			workset1.launcher=tool.Launcher;
			workset2.launcher=tool.Launcher;
			workset1.happen=tool.Launcher.HappenTo;
			workset2.happen=tool.Launcher.HappenTo;

			agent=AgentManager.StandBy(workset2);
			handle=agent.Open();
			Test.chk_strict(agent.IsOpen(),true);

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
