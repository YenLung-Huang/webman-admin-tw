layui.define(['jquery', 'element','table'], function(exports) {
	"use strict";

	/**
	 * 常用封裝類別
	 * */
	var MOD_NAME = 'common',
		$ = layui.jquery,
		table = layui.table,
		element = layui.element;

	var common = new function() {
		
		/**
		 * 取得目前表格選取欄位
		 * @param obj 表格回呼參數
		 * @param field 要取得的欄位
		 * */
		this.checkField = function(obj, field) {
			let data = table.checkStatus(obj.config.id).data;
			if (data.length === 0) {
				return "";
			}
			let ids = "";
			for (let i = 0; i < data.length; i++) {
				ids += data[i][field] + ",";
			}
			ids = ids.substr(0, ids.length - 1);
			return ids;
		}
		
		/**
		 * 當前是否為與行動端
		 * */
		this.isModile = function(){
			if ($(window).width() <= 768) {
				return true;
			}
			return false;
		}
		
		
		/**
		 * 提交 json 資料
		 * @param data 提交資料
		 * @param href 提交接口
		 * @param table 刷新父級表
		 * 
		 * */
		this.submit = function(data,href,table,callback){
			$.ajax({
			    url:href,
			    data:JSON.stringify(data),
			    dataType:'json',
			    contentType:'application/json',
			    type:'post',
			    success:callback !=null?callback(result):function(result){
			        if(result.success){
			            layer.msg(result.msg,{icon:1,time:1000},function(){
			                parent.layer.close(parent.layer.getFrameIndex(window.name));//關閉目前頁面
			                parent.layui.table.reload(table);
			            });
			        }else{
			            layer.msg(result.msg,{icon:2,time:1000});
			        }
			    }
			})
		}
	}
	exports(MOD_NAME, common);
});
