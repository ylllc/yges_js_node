// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

// Examples: Async Proceure Engine ------ //

import Engine from '../api/engine.js';
import log from '../api/logger.js';
import util from '../api/util.js';

// start the Engine 
Engine.Start();

// local launcher 
var launcher=Engine.CreateLauncher({
	name:'MyLauncher',
	limit:3, // can limit parallel proc 
});

util.SafeStepIter(0,10,1,(i)=>{
	launcher.Launch({
		user:{
			// initial settings 
			name:'async '+i,
		},
		cb_start:(user)=>{
			// called before running 
			user.lock=true;
			Engine.Delay(500,(ctx)=>{
				user.lock=false;
			});
		},
		cb_poll:(user)=>{
			// polling while returns true
			return user.lock;
		},
		cb_done:(user)=>{
			log.Info(user.name+' done');
		},
		cb_abort:(user)=>{
			log.Info(user.name+' abort');
		},
	});
});

// sync in a launcher
launcher.Sync((user)=>{
	log.Info('all done');
});

// count up with 1 sec interval 
function countup(max,now=0){

	Engine.Delay(1000,(user)=>{
		if(now>=max)return;
		++now;
		log.Info('count: '+now);
		countup(max,now);
	},(user)=>{
		log.Info('abort counting');
	});
}

// count up to 10, but... 
countup(10);

// after 5 sec, the Engine is ended. 
// and all pollings are aborted. 
// and can exit.
Engine.Delay(5000,(ctx)=>{
	log.Info('end of the engine');

	Engine.Stop();
},(ctx)=>{
	log.Info('abort root');
});
