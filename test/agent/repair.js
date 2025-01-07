// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import AgentManager from '../../api/agent.js';

// Agent Repairing Test ----------------- //

let agent=null;
let handle=null;

let workset={
	user:{Count:1},
	cb_open:(agent)=>{
		agent.User.Count+=2;
		Test.chk_strict(agent.User.Count,4);
	},
	cb_repair:(agent)=>{
		agent.User.Count+=1;
		Test.chk_strict(agent.User.Count,2);

		agent.WaitFor(()=>{
			// resolve all happenings in target HappeningManager 
			let hm=agent.GetHappeningManager();
			hm.Poll((hap)=>{
				hap.Resolve();
			});

			hm.CleanUp();
			return hm.IsCleaned();
		});
	},
	cb_ready:(agent)=>{
		agent.User.Count+=3;
		Test.chk_strict(agent.User.Count,7);

		handle.Close();
	},
	cb_close:(agent)=>{
		agent.User.Count+=4;
		Test.chk_strict(agent.User.Count,11);
	},
	cb_finish:(agent)=>{
		agent.User.Count+=5;
		Test.chk_strict(agent.User.Count,16);
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

			// the agent has a Happening at start 
			// and must repair it to open.  
			workset.happen.HappenMsg('Test Hap.');

			handle=agent.Fetch();
			handle.Open();

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
