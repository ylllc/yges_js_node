// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import PropTree from '../../api/proptree.js';

// Prop Tree Test ----------------------- //

const scenaria=[
	{
		title:'Mono Mode',
		proc:async (tool)=>{
			var p=PropTree.Create();
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.EMPTY);
			Test.chk_strict(p.Get(),undefined);
			Test.chk_strict(p.Export(),undefined);

			p.Set('test');
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.MONO);
			Test.chk_strict(p.Get(),'test');
			Test.chk_strict(p.Export(),'test');

			Test.chk_strict(p.Cut(),'test');
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.EMPTY);
			Test.chk_strict(p.Get(),undefined);
			Test.chk_strict(p.Export(),undefined);
		},
	},
	{
		title:'Array Mode',
		proc:async (tool)=>{
			var p=PropTree.Create([],true);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.ARRAY);
			Test.chk_strict(p.Count(),0);
			p.Push(1);
			p.Push('2');
			p.Unshift(-3);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.ARRAY);
			Test.chk_strict(p.Count(),3);
			Test.chk_strict(p.Get(1),1);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.ARRAY);
			Test.chk_strict(p.Pop(),'2');
			Test.chk_strict(p.Shift(),-3);
			Test.chk_strict(p.Count(),1);
		},
	},
	{
		title:'Prop Mode',
		proc:async (tool)=>{
			var p=PropTree.Create({},true);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.DICT);

			p.Set('a','b',-12);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.DICT);
			Test.chk_strict(p.Get('a','b'),-12);
			Test.chk_strict(p.Get(['a','b']),-12);
			Test.chk_strict(p.Ref('a').Get('b'),-12);
			Test.chk_strict(p.Exists('a'),true);
			Test.chk_strict(p.Exists('a','b'),true);
			Test.chk_strict(p.Exists('a','b',-12),false);
			Test.chk_strict(p.Exists('a','c'),false);
			Test.chk_strict(p.Exists(['a','b']),true);

			p.Dig('a','c','e');
			Test.chk_strict(p.Exists('a','c','e'),true);
			Test.chk_strict(p.Count('a','c'),1);
			Test.chk_strict(p.Count('a','c','e'),0);
		},
	},
	{
		title:'Mono Import',
		proc:async (tool)=>{
			var a={a:1,b:-2,c:[3,'4',false]}
			var p=PropTree.Create(a,false);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.MONO);
			Test.chk_strict(p.Exists('c'),false);
			Test.chk_strict(p.Get()['c'][0],3);
		},
	},
	{
		title:'Deep Import',
		proc:async (tool)=>{
			var a={a:1,b:-2,c:[3,'4',false]}
			var p=PropTree.Create(a,true);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.DICT);
			Test.chk_strict(p.Exists('c',1),true);
			Test.chk_strict(p.Get('c',0),3);
		},
	},
	{
		title:'Shapeshifting',
		proc:async (tool)=>{
			var p=PropTree.Create();
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.EMPTY);
			p.Set(true);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.MONO);
			p.Push(1);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.ARRAY);
			p.Set('a','A');
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.DICT);
			Test.chk_strict(p.Shift(),1);
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.ARRAY);
			p.ToDict();
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.DICT);
			Test.chk_strict(p.Get(0),'A');
			p.ToArray();
			Test.chk_strict(p.GetType(),PropTree.PROPTYPE.ARRAY);
			Test.chk_strict(p.Get(0),'A');
		},
	},
	{
		title:'Exists',
		proc:async (tool)=>{
			var p=PropTree.Create({a:1,b:{c:2}},true);
			Test.chk_strict(p.Exists(),true);
			Test.chk_strict(p.Exists('a'),true);
			Test.chk_strict(p.Exists('b'),true);
			Test.chk_strict(p.Exists('c'),false);
			Test.chk_strict(p.Exists('b','c'),true);
			Test.chk_strict(p.Exists(['b','c']),true);
			Test.chk_strict(p.Exists('b','d'),false);
			Test.chk_strict(p.Exists(['b','d']),false);
		},
	},
	{
		title:'Ref',
		proc:async (tool)=>{
			var p=PropTree.Create({a:1,b:{c:2}},true);
			Test.chk_strict(p.Ref().Get('a'),1);
			Test.chk_strict(p.Ref('b','c').Get(),2);
			Test.chk_strict(p.Ref(['b','c']).Get(),2);
			Test.chk_strict(p.Ref('b','d'),undefined);
		},
	},
	{
		title:'Dig',
		proc:async (tool)=>{
			var p=PropTree.Create();
			p.Dig('a').Set('b',-1);
			Test.chk_strict(p.Get('a','b'),-1);
			p.Dig('a','c').Set(3);
			Test.chk_strict(p.Get('a','c'),3);
			p.Dig('a').Dig(['c','d']).Set(2);
			Test.chk_strict(p.Get('a','c','d'),2);
		},
	},
	{
		title:'Count',
		proc:async (tool)=>{
			var p=PropTree.Create({a:1,b:{c:[1,2,3,4,5],d:{}}},true);
			Test.chk_strict(p.Count(),2);
			Test.chk_strict(p.Count('a'),1);
			Test.chk_strict(p.Count('b'),2);
			Test.chk_strict(p.Count('b','c'),5);
			Test.chk_strict(p.Count(['b','c']),5);
			Test.chk_strict(p.Count('b','d'),0);
			Test.chk_strict(p.Count('x','x'),0);
		},
	},
	{
		title:'Get',
		proc:async (tool)=>{
			var p=PropTree.Create({a:1,b:{c:2}},true);
			Test.chk_strict(p.Get('a'),1);
			Test.chk_strict(p.Get().b.c,2);
			Test.chk_strict(p.Get('b','c'),2);
			Test.chk_strict(p.Get(['b','c']),2);
			Test.chk_strict(p.Get('x','x'),undefined);
		},
	},
	{
		title:'Set',
		proc:async (tool)=>{
			var p=PropTree.Create();
			Test.chk_strict(p.Set(12).Get(),12);
			Test.chk_strict(p.Set('a','b',-12).Get(),-12);
			Test.chk_strict(p.Set(['a','b'],123).Get(),123);
			p.Ref('a').Set('b','c',3);
			Test.chk_strict(p.Get('a','b','c'),3);
		},
	},
	{
		title:'Cut',
		proc:async (tool)=>{
			var p=PropTree.Create({a:1,b:[1,2,3,4,5]},true);
			Test.chk_strict(p.Cut('b',2).Get(),3);
			Test.chk_strict(p.Ref('a').Cut(),1);
			Test.chk_strict(p.Ref('a').Cut(),undefined);
		},
	},
	{
		title:'Merge',
		proc:async (tool)=>{
			var p=PropTree.Create({a:1,b:[1,2,3,4,5],c:{d:10}},true);
			Test.chk_strict(p.Merge('c',{e:[-1,-2,-3]}).Get('d'),10);
			p.Merge('b',5,false);
			p.Merge(['c','e',5],true);
			Test.chk_strict(p.Get('b',3),4);
			Test.chk_strict(p.Get('b',5),false);
			Test.chk_strict(p.Get('c','e',1),-2);
			Test.chk_strict(p.Get('c','e',4),undefined);
			Test.chk_strict(p.Get('c','e',5),true);
		},
	},
	{
		title:'Push',
		proc:async (tool)=>{
			var p=PropTree.Create([1,2,3,4,5],true);
			Test.chk_strict(p.Push(6,'a',-1).Get(0),-1);
			Test.chk_strict(p.Push([6,'a'],-2).Get(1),-2);
		},
	},
	{
		title:'Unshift',
		proc:async (tool)=>{
			var p=PropTree.Create([1,2,3,4,5],true);
			Test.chk_strict(p.Unshift(6,'a',-1).Get(0),-1);
			Test.chk_strict(p.Unshift([6,'a'],-2).Get(0),-2);
		},
	},
	{
		title:'Pop',
		proc:async (tool)=>{
			var p=PropTree.Create({a:{b:[1,2,3,4,5]},c:{d:'D',e:'E'}},true);
			Test.chk_strict(p.Pop('a','b'),5);
			Test.chk_strict(p.Pop(['a','b']),4);
			Test.chk_strict(p.Pop('c'),'E');
			Test.chk_strict(p.Pop('x','x'),undefined);
		},
	},
	{
		title:'Shift',
		proc:async (tool)=>{
			var p=PropTree.Create({a:{b:[1,2,3,4,5]},c:{d:'D',e:'E'}},true);
			Test.chk_strict(p.Shift('a','b'),1);
			Test.chk_strict(p.Shift(['a','b']),2);
			Test.chk_strict(p.Shift('c'),'D');
			Test.chk_strict(p.Shift('x','x'),undefined);
		},
	},
	{
		title:'Each',
		proc:async (tool)=>{
			var p=PropTree.Create({a:{b:['0','1','2','3','4'],c:{d:'D',e:'E',X:'x'}}},true);
			p.Set('a','b',6,'6');
			p.Each('a','b',(k,t)=>{
				Test.chk_strict(''+k,t.Export());
			});
			p.Each(['a','c'],(k,t)=>{
				Test.chk_strict(k.toUpperCase(),t.Export());
				return k!='e';
			});
		},
	},
]

Test.Run(scenaria);
