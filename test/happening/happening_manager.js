// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import HappeningManager from '../../api/happening.js';

// Happening Manager Test --------------- //

const scenaria=[
	{
		title:'Global Happenning Manager',
		proc:(tool)=>{
			Test.chk_strict(true,HappeningManager.IsCleaned(),'initialised global manager');
		},
	},
	{
		title:'Local Happening Manager',
		proc:(tool)=>{
			let hap_local1=HappeningManager.CreateLocal();
			let hap_local2=hap_local1.CreateLocal();

			Test.chk_strict(true,hap_local1.IsCleaned(),'initialised local1 manager');
			Test.chk_strict(true,hap_local2.IsCleaned(),'initialised local2 manager');
		},
	},
]

Test.Run(scenaria);
