// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import AgentManager from '../../api/agent.js';

// Plain Agent Test --------------------- //

const scenaria=[
	{
		title:'Plain Agent',
		proc:async (tool)=>{
			let w=AgentManager.StandBy({});
			Test.chk_strict(w.IsOpen(),false);
			let h=w.Open();
			Test.chk_strict(w.IsOpen(),true);
			h.Close();
			Test.chk_strict(w.IsOpen(),false);
		},
	},
]

Test.Run(scenaria);
