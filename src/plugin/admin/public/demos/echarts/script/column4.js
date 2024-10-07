layui.use(['echarts'], function() {
	let echarts = layui.echarts;
	var column4 = echarts.init(document.getElementById('column4'),null, {
		width: 600,
		height: 400
	});
	option = {
		backgroundColor:'#fff',
		title:{
			text:"描邊長條圖",
			top:10,
			left:15,			
			color:"#35598d",
			fontSize:16,
			fontWeight:'normal'			
		},
		tooltip: {
			trigger: 'axis',
			formatter:'{b}：{c}',
		},
		grid: {
			left: '5%',
			right: '6%',
			bottom: '3%',
			top: '20%',
			containLabel: true
		},
		xAxis :{
			type : 'category',
			data : ['策略1','策略2','策略3','策略4','策略5','策略6','策略7','策略8','策略9'],
			axisLabel:{          //座標軸字體顏色
				color: '#9eaaba'
			},
			axisLine:{
				lineStyle:{
					color:"#e5e5e5"
				}
			}, 
			axisTick:{       //y軸刻度線
			show:false
			},
			splitLine:{    //網格
				show: false,
			}
		},
		yAxis :{
			type : 'value',
			axisLabel:{        //座標軸字體顏色
				color: '#9eaaba'
			},
			axisLine:{
				show:false,
			},
			axisTick:{       //y軸刻度線
			show:false
			},
			splitLine:{    //網格
				show: true,
				lineStyle:{
					color:'#dadde4',
					type:"dashed" //座標網路線類型
				}
			}
		},
		series:{
			name:'',
			type:'bar',
			barWidth : '40%',  //柱子寬度
			itemStyle:{  //柱子顏色
				borderWidth: 2,
				borderColor: 'rgb(79, 116, 223)',
				color:'rgba(79, 116, 223, .3)',
			},
			data:[320, 332, 301, 334, 390, 330, 320, 230, 156]
		}
	};
	
	column4.setOption(option);

	window.onresize = function() {
		column4.resize();
	}
	
})
