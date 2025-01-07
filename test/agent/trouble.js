// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import AgentManager from '../../api/agent.js';

// Agent Recovering Test ---------------- //

let agent=null;
let handle=null;

let workset={
	user:{Count:1},
	cb_open:(agent)=>{
		agent.User.Count+=1;
		Test.chk_strict(agent.User.Count,2);
	},
	cb_ready:(agent)=>{
		agent.User.Count+=2;
		Test.chk_strict(agent.User.Count,4);

		// happening after ready 
		// required resolving it to recover 
		agent.GetHappeningManager().HappenMsg('Test Hap.');
	},
	poll_healthy:(agent)=>{
		agent.User.Count+=4;
		Test.chk_strict(agent.User.Count,11);

		handle.Close();
	},
	poll_trouble:(agent)=>{
		agent.User.Count+=3;
		Test.chk_strict(agent.User.Count,7);

		// resolve all happenings in target HappeningManager 
		let hm=agent.GetHappeningManager();
		hm.Poll((hap)=>{
			hap.Resolve();
		});
	},
	cb_close:(agent)=>{
		agent.User.Count+=5;
		Test.chk_strict(agent.User.Count,16);
	},
	cb_finish:(agent)=>{
		agent.User.Count+=6;
		Test.chk_strict(agent.User.Count,22);
	},
	cb_abort:(agent)=>{
		Test.chk_never("don't step");
	},
}

const scenaria=[
	{
		title:'Agent Repairing',
		proc:async (tool)=>{
			workset.launcher=tool.Launcher;
			workset.happen=tool.Launcher.HappenTo.CreateLocal({
				happen:(hap)=>{
//					tool.Log.Fatal(hap.ToString(),hap.GetProp());
				},
			});

			agent=AgentManager.StandBy(workset);
			Test.chk_strict(agent.User.Count,1);

			handle=agent.Fetch();
			handle.Open();

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
