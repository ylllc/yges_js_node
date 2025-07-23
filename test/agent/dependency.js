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
	User:{Count:0},
	OnOpen:(agent)=>{
		Test.ChkStrict(agent.IsBusy(),true);
		agent.WaitFor('Counting up to 10',()=>{
			return ++agent.User.Count>=10;
		});
	},
	OnReady:(agent)=>{
		Test.ChkStrict(agent.IsReady(),true);
	},
	OnClose:(agent)=>{
		Test.ChkStrict(agent.IsReady(),false);
		agent.WaitFor('Counting up to 20',()=>{
			return ++agent.User.Count>=20;
		});
	},
	OnFinish:(agent)=>{
		Test.ChkStrict(agent.IsBusy(),false);
	},
}
let agent1=AgentManager.StandBy(workset1);

let workset2={
	User:{Count:0},
	Dependencies:[agent1],
	OnOpen:(agent)=>{
		Test.ChkStrict(agent.IsBusy(),true);
	},
	OnReady:(agent)=>{
		Test.ChkStrict(agent.IsReady(),true);
		Test.ChkStrict(agent1.IsOpen(),true);

		handle.Close();
		Test.ChkStrict(agent.IsOpen(),false);
	},
	OnClose:(agent)=>{
		Test.ChkStrict(agent.IsReady(),false);
		Test.ChkStrict(agent1.IsOpen(),false);
	},
	OnFinish:(agent)=>{
		Test.ChkStrict(agent.IsBusy(),false);
	},
}
let agent2=AgentManager.StandBy(workset2);

const scenaria=[
	{
		Title:'Agent Dependencies',
		Proc:async (tool)=>{
			workset1.Log=tool.Log;
			workset2.Log=tool.Log;
			workset1.Launcher=tool.Launcher;
			workset2.Launcher=tool.Launcher;
			workset1.HappenTo=tool.HappenTo;
			workset2.HappenTo=tool.HappenTo;

			handle=agent2.Open();
			Test.ChkStrict(agent2.IsOpen(),true);

			await tool.Launcher.ToPromise();
		},
	},
]

Test.Run(scenaria);
