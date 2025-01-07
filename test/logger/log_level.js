// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';

// Log Level Test ----------------------- //

const scenaria=[
	{
		title:'Log Level',
		proc:(tool)=>{
			const Log=tool.Log;

			// capture a log for test 
			let count=0;
			Log.Way=(src)=>{
				++count;
			}

			// set showable log level 
			Log.Showable=Log.LEVEL.DEBUG;
			Test.chk_strict(count,0,'not logged yet');
			Log.Debug('?');
			Test.chk_strict(count,1,'debug logged');
			Log.Trace('?'); // will be suppressed 
			Test.chk_strict(count,1,'trace log  suppressed');

			// local log (unoverriden)
			let ll1=Log.CreateLocal('Local1',Log.LEVEL.WARN);
			ll1.Notice('?') // will be suppressed ;
			Test.chk_strict(count,1,'notice log suppressed');
			ll1.Warn('?');
			Test.chk_strict(count,2,'warn logged');

			// local log (instant overriden)
			let ll2=Log.CreateLocal('Local2');
			ll2.Way=(msg)=>{count+=10;};
			ll2.Info('?');
			Test.chk_strict(count,12,'local logged');
		},
	},
]

Test.Run(scenaria);
