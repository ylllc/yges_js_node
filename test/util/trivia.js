// † Yggdrasil Essense for JavaScript † //
// ====================================== //
// © 2024-5 Yggdrasil Leaves, LLC.        //
//        All rights reserved.            //

import Test from '../../api/unittest.js';
import YgEs from '../../api/common.js';
import Util from '../../api/util.js';

// Trivia ------------------------------- //

const scenaria=[
	{
		title:'Just NaN',
		proc:async (tool)=>{
			Test.chk_strict(true,Util.IsJustNaN(NaN));
			Test.chk_strict(false,Util.IsJustNaN(null));
			Test.chk_strict(false,Util.IsJustNaN(undefined));
			Test.chk_strict(false,Util.IsJustNaN([]));
			Test.chk_strict(false,Util.IsJustNaN({}));
		},
	},
	{
		title:'Just Infinity',
		proc:async (tool)=>{
			Test.chk_strict(true,Util.IsJustInfinity(Infinity));
			Test.chk_strict(true,Util.IsJustInfinity(-Infinity));
			Test.chk_strict(false,Util.IsJustInfinity("Infinity"));
			Test.chk_strict(false,Util.IsJustInfinity("-Infinity"));
			Test.chk_strict(false,Util.IsJustInfinity(NaN));
			Test.chk_strict(false,Util.IsJustInfinity(null));
			Test.chk_strict(false,Util.IsJustInfinity(undefined));
			Test.chk_strict(false,Util.IsJustInfinity('A'));
			Test.chk_strict(false,Util.IsJustInfinity([]));
			Test.chk_strict(false,Util.IsJustInfinity([0]));
			Test.chk_strict(false,Util.IsJustInfinity([false]));
			Test.chk_strict(false,Util.IsJustInfinity({}));
		},
	},
	{
		title:'Detect Empty',
		proc:async (tool)=>{
			Test.chk_strict(true,Util.IsEmpty(null));
			Test.chk_strict(true,Util.IsEmpty(undefined));
			Test.chk_strict(true,Util.IsEmpty(''));
			Test.chk_strict(false,Util.IsEmpty([]));
			Test.chk_strict(false,Util.IsEmpty({}));
			Test.chk_strict(false,Util.IsEmpty(0));
			Test.chk_strict(false,Util.IsEmpty(false));
			Test.chk_strict(false,Util.IsEmpty(NaN));
		},
	},
	{
		title:'Validation',
		proc:async (tool)=>{
			Test.chk_strict(false,Util.IsValid(null));
			Test.chk_strict(false,Util.IsValid(undefined));
			Test.chk_strict(false,Util.IsValid(NaN));
			Test.chk_strict(true,Util.IsValid(0));
			Test.chk_strict(true,Util.IsValid(1));
			Test.chk_strict(true,Util.IsValid(''));
			Test.chk_strict(true,Util.IsValid('0'));
			Test.chk_strict(true,Util.IsValid(false));
			Test.chk_strict(true,Util.IsValid(true));
			Test.chk_strict(true,Util.IsValid([]));
			Test.chk_strict(true,Util.IsValid({}));
			Test.chk_strict(true,Util.IsValid('null'));
			Test.chk_strict(true,Util.IsValid('undefined'));
			Test.chk_strict(true,Util.IsValid('NaN'));
		},
	},
	{
		title:'Booleanize',
		proc:async (tool)=>{
			Test.chk_strict(true,Util.Booleanize(1));
			Test.chk_strict(true,Util.Booleanize('A'));
			Test.chk_strict(true,Util.Booleanize('true'));
			Test.chk_strict(true,Util.Booleanize([]));
			Test.chk_strict(true,Util.Booleanize({}));
			Test.chk_strict(true,Util.Booleanize(NaN));
			Test.chk_strict(true,Util.Booleanize('NaN'));
			Test.chk_strict(true,Util.Booleanize('.'));
			Test.chk_strict(false,Util.Booleanize(0));
			Test.chk_strict(false,Util.Booleanize(''));
			Test.chk_strict(false,Util.Booleanize(false));
			Test.chk_strict(false,Util.Booleanize(null));
			Test.chk_strict(false,Util.Booleanize(undefined));
			Test.chk_strict(true,Util.Booleanize('0'));
			Test.chk_strict(true,Util.Booleanize('000.'));
			Test.chk_strict(true,Util.Booleanize('0.00'));
			Test.chk_strict(true,Util.Booleanize('.0000'));
			Test.chk_strict(true,Util.Booleanize('00.000000'));
			Test.chk_strict(true,Util.Booleanize('false'));
			Test.chk_strict(true,Util.Booleanize('FALSE'));
			Test.chk_strict(true,Util.Booleanize('FaLsE'));
			Test.chk_strict(true,Util.Booleanize('null'));
			Test.chk_strict(true,Util.Booleanize('NULL'));
			Test.chk_strict(true,Util.Booleanize('nULl'));
			Test.chk_strict(true,Util.Booleanize('undefined'));
			Test.chk_strict(true,Util.Booleanize('UNDEFINED'));
			Test.chk_strict(true,Util.Booleanize('UnDefined'));
		},
	},
	{
		title:'Unstringed Booleanize',
		proc:async (tool)=>{
			Test.chk_strict(false,Util.Booleanize('0',true));
			Test.chk_strict(false,Util.Booleanize('000.',true));
			Test.chk_strict(false,Util.Booleanize('0.00',true));
			Test.chk_strict(false,Util.Booleanize('.0000',true));
			Test.chk_strict(false,Util.Booleanize('00.000000',true));
			Test.chk_strict(false,Util.Booleanize('false',true));
			Test.chk_strict(false,Util.Booleanize('FALSE',true));
			Test.chk_strict(false,Util.Booleanize('FaLsE',true));
			Test.chk_strict(false,Util.Booleanize('null',true));
			Test.chk_strict(false,Util.Booleanize('NULL',true));
			Test.chk_strict(false,Util.Booleanize('nULl',true));
			Test.chk_strict(false,Util.Booleanize('undefined',true));
			Test.chk_strict(false,Util.Booleanize('UNDEFINED',true));
			Test.chk_strict(false,Util.Booleanize('UnDefined',true));
		},
	},
	{
		title:'Trinarize',
		proc:async (tool)=>{
			Test.chk_strict(true,Util.Trinarize(1));
			Test.chk_strict(true,Util.Trinarize('A'));
			Test.chk_strict(true,Util.Trinarize('true'));
			Test.chk_strict(true,Util.Trinarize([]));
			Test.chk_strict(true,Util.Trinarize({}));
			Test.chk_strict(true,Util.Trinarize(NaN));
			Test.chk_strict(true,Util.Trinarize('NaN'));
			Test.chk_strict(true,Util.Trinarize('.'));
			Test.chk_strict(false,Util.Trinarize(0));
			Test.chk_strict(false,Util.Trinarize(''));
			Test.chk_strict(false,Util.Trinarize(false));
			Test.chk_strict(null,Util.Trinarize(null));
			Test.chk_strict(null,Util.Trinarize(undefined));
			Test.chk_strict(true,Util.Trinarize('0'));
			Test.chk_strict(true,Util.Trinarize('000.'));
			Test.chk_strict(true,Util.Trinarize('0.00'));
			Test.chk_strict(true,Util.Trinarize('.0000'));
			Test.chk_strict(true,Util.Trinarize('00.000000'));
			Test.chk_strict(true,Util.Trinarize('false'));
			Test.chk_strict(true,Util.Trinarize('FALSE'));
			Test.chk_strict(true,Util.Trinarize('FaLsE'));
			Test.chk_strict(true,Util.Trinarize('null'));
			Test.chk_strict(true,Util.Trinarize('NULL'));
			Test.chk_strict(true,Util.Trinarize('nULl'));
			Test.chk_strict(true,Util.Trinarize('undefined'));
			Test.chk_strict(true,Util.Trinarize('UNDEFINED'));
			Test.chk_strict(true,Util.Trinarize('UnDefined'));
		},
	},
	{
		title:'Unstringed Trinarize',
		proc:async (tool)=>{
			Test.chk_strict(false,Util.Trinarize('0',true));
			Test.chk_strict(false,Util.Trinarize('000.',true));
			Test.chk_strict(false,Util.Trinarize('0.00',true));
			Test.chk_strict(false,Util.Trinarize('.0000',true));
			Test.chk_strict(false,Util.Trinarize('00.000000',true));
			Test.chk_strict(false,Util.Trinarize('false',true));
			Test.chk_strict(false,Util.Trinarize('FALSE',true));
			Test.chk_strict(false,Util.Trinarize('FaLsE',true));
			Test.chk_strict(null,Util.Trinarize('null',true));
			Test.chk_strict(null,Util.Trinarize('NULL',true));
			Test.chk_strict(null,Util.Trinarize('nULl',true));
			Test.chk_strict(null,Util.Trinarize('undefined',true));
			Test.chk_strict(null,Util.Trinarize('UNDEFINED',true));
			Test.chk_strict(null,Util.Trinarize('UnDefined',true));
		},
	},
	{
		title:'Zero Filling',
		proc:async (tool)=>{
			Test.chk_strict(Util.FillZero(0,8),'00000000');
			Test.chk_strict(Util.FillZero(123.4,8),'000123.4');
			Test.chk_strict(Util.FillZero(-123.4,8),'-00123.4');
			Test.chk_strict(Util.FillZero(0,8,true),'+0000000');
			Test.chk_strict(Util.FillZero(123.4,8,true),'+00123.4');
			Test.chk_strict(Util.FillZero(-123.4,8,true),'-00123.4');
		},
	},
	{
		title:'Just String',
		proc:async (tool)=>{
			Test.chk_strict(YgEs.JustString(0),'0');
			Test.chk_strict(YgEs.JustString('0'),'0');
			Test.chk_strict(YgEs.JustString(false),'false');
			Test.chk_strict(YgEs.JustString(true),'true');
			Test.chk_strict(YgEs.JustString(null),'null');
			Test.chk_strict(YgEs.JustString(undefined),'undefined');
			Test.chk_strict(YgEs.JustString([undefined]),'[undefined]');
			Test.chk_strict(YgEs.JustString(Infinity),'Infinity');
			Test.chk_strict(YgEs.JustString(-Infinity),'-Infinity');
			Test.chk_strict(YgEs.JustString(NaN),'NaN');
			Test.chk_strict(YgEs.JustString({a:-1,b:"xyz"}),'{"a":-1,"b":xyz}');
		},
	},
	{
		title:'Inspectable String',
		proc:async (tool)=>{
			Test.chk_strict(YgEs.Inspect(0),'0');
			Test.chk_strict(YgEs.Inspect('0'),'"0"');
			Test.chk_strict(YgEs.Inspect(false),'false');
			Test.chk_strict(YgEs.Inspect(true),'true');
			Test.chk_strict(YgEs.Inspect(null),'null');
			Test.chk_strict(YgEs.Inspect(undefined),'undefined');
			Test.chk_strict(YgEs.Inspect([undefined]),'[undefined]');
			Test.chk_strict(YgEs.Inspect(Infinity),'Infinity');
			Test.chk_strict(YgEs.Inspect(-Infinity),'-Infinity');
			Test.chk_strict(YgEs.Inspect(NaN),'NaN');
			Test.chk_strict(YgEs.Inspect({a:-1,b:"xyz"}),'{"a":-1,"b":"xyz"}');
		},
	},
]

Test.Run(scenaria);
