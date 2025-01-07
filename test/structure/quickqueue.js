// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import QuickQueue from '../../api/quickqueue.js';

// Quick Queue Test --------------------- //

function create(/*...*/){
	var a=arguments;
	return QuickQueue.Create(arguments);
}

const scenaria=[
	{
		title:'Empty Queue',
		proc:async (tool)=>{
			var q=QuickQueue.Create([]);

			Test.chk_strict(0,q.Count());
			Test.chk_strict(0,q.Pos());
			Test.chk_strict(true,q.IsEnd());
			Test.chk_strict(undefined,q.Peek());
			Test.chk_strict(undefined,q.Next());
			Test.chk_strict(0,q.Pos());
		},
	},
	{
		title:'Array Queue',
		proc:async (tool)=>{
			var q=QuickQueue.Create([2,'ABC',-7]);

			Test.chk_strict(3,q.Count());
			Test.chk_strict(0,q.Pos());
			Test.chk_strict(false,q.IsEnd());
			Test.chk_strict(2,q.Peek());
			Test.chk_strict(2,q.Next());
			Test.chk_strict(1,q.Pos());
			Test.chk_strict('ABC',q.Next());
			Test.chk_strict(2,q.Pos());
			Test.chk_strict(false,q.IsEnd());
			Test.chk_strict(-7,q.Next());
			Test.chk_strict(3,q.Pos());
			Test.chk_strict(true,q.IsEnd());
		},
	},
	{
		title:'Argument Queue',
		proc:async (tool)=>{
			var q=create(5,'T',[false,true],null);
			Test.chk_strict(4,q.Count());
			Test.chk_strict(0,q.Pos());
			Test.chk_strict(5,q.Next());
			Test.chk_strict('T',q.Next());
			q.Reset();
			Test.chk_strict(0,q.Pos());
			Test.chk_strict(5,q.Peek());
		},
	},
	{
		title:'After Push',
		proc:async (tool)=>{
			var a=[]
			var q=QuickQueue.Create(a);
			Test.chk_strict(0,q.Count());
			Test.chk_strict(0,q.Pos());
			a.push(-12);
			Test.chk_strict(1,q.Count());
			Test.chk_strict(-12,q.Next());
		},
	},
]

Test.Run(scenaria);
