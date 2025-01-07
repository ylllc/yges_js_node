// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import AgentManager from '../../api/agent.js';

// Agent Restart Test ------------------- //

let agent=null;
let handle=null;

let workset={
	user:{Count:1},
	cb_open:(agent)=>{
		++agent.User.Count;
	},
	cb_ready:(agent)=>{
		if(agent.User.Count<10)agent.Restart();
		else handle.Close();
	},
	cb_finish:(agent)=>{
		Test.chk_strict(agent.User.Count,10);
	},
}

const scenaria=[
	{
		title:'Agent Restart',
		proc:async (tool)=>{
			workset.launcher=tool.Launcher;
			workset.happen=tool.Launcher.HappenTo;
			agent=AgentManager.StandBy(workset);
			Test.chk_strict(agent.User.Count,1);
			handle=agent.Fetch();
			handle.Open();

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
