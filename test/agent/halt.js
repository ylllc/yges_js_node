// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import AgentManager from '../../api/agent.js';

// Rescue Locked Agent Test ------------- //

let agent1=null;
let handle1=null;
let agent2=null;
let handle2=null;

let workset1={
	name:'Test Rescuee',
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

		handle1.Close();
	},
	poll_trouble:(agent)=>{
		agent.User.Count+=3;
		Test.chk_strict(agent.User.Count,7);

		// more happening in poll_trouble() 
		// this agent locked down and stop polling until cleaned up 
		agent.GetHappeningManager().HappenMsg('More Test Hap.');
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

let workset2={
	name:'Test Rescuer',

	cb_open:(agent)=>{
		agent.WaitFor(()=>{
			return agent1.IsHalt();
		});
	},
	cb_ready:(agent)=>{
		// rescue locked agent 
		let hm=agent1.GetHappeningManager();
		hm.Poll((hap)=>{
			hap.Resolve();
		});
		handle2.Close();
	},
}

const scenaria=[
	{
		title:'Rescue Locked Agent',
		proc:async (tool)=>{
			workset1.launcher=tool.Launcher;
			workset2.launcher=tool.Launcher;
			workset1.happen=tool.Launcher.HappenTo.CreateLocal({
				happen:(hap)=>{
//					tool.Log.Fatal(hap.ToString(),hap.GetProp());
				},
			});
			workset2.happen=tool.Launcher.HappenTo.CreateLocal({
				happen:(hap)=>{
					tool.Log.Fatal(hap.ToString(),hap.GetProp());
				},
			});

			agent1=AgentManager.StandBy(workset1);
			Test.chk_strict(agent1.User.Count,1);

			handle1=agent1.Fetch();
			handle1.Open();

			agent2=AgentManager.StandBy(workset2);
			handle2=agent2.Fetch();
			handle2.Open();

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
