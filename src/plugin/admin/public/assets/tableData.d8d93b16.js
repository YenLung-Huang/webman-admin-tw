const n=[{integer:"InputNumber"},{string:"Input"},{text:"InputTextArea"},{date:"DatePicker"},{enum:"Select"},{float:"Input"},{tinyInteger:"InputNumber"},{smallInteger:"InputNumber"},{mediumInteger:"InputNumber"},{bigInteger:"InputNumber"},{unsignedInteger:"InputNumber"},{unsignedTinyInteger:"InputNumber"},{unsignedSmallInteger:"InputNumber"},{unsignedMediumInteger:"InputNumber"},{unsignedBigInteger:"InputNumber"},{decimal:"Input"},{double:"Input"},{mediumText:"InputTextArea"},{longText:"InputTextArea"},{dateTime:"DatePicker"},{time:"DatePicker"},{timestamp:"DatePicker"},{char:"Input"},{binary:"Input"}],l=[];for(const o of n)for(const e in o)l.push({label:e,value:e,key:e}),n[e]=o[e];function p(o){return n[o]||"Input"}const t=[{label:"\u6587\u672C\u6846",value:"Input"},{label:"\u591A\u884C\u6587\u672C",value:"InputTextArea"},{label:"\u4E0B\u62C9\u9009\u62E9",value:"Select"},{label:"\u6570\u5B57\u6587\u672C\u6846",value:"InputNumber"},{label:"\u65E5\u671F\u9009\u62E9",value:"DatePicker"},{label:"\u65F6\u95F4\u9009\u62E9",value:"TimePicker"},{label:"\u5F00\u5173",value:"Switch"},{label:"\u4E0A\u4F20",value:"Upload"},{label:"\u56FE\u6807",value:"IconPicker"},{label:"\u6811\u5F62\u9009\u62E9",value:"ApiTreeSelect"},{label:"\u6811",value:"ApiTree"}],a=[{field:"name",component:"Input",label:"\u8868\u540D",colProps:{span:7},required:!0},{field:"comment",component:"Input",label:"\u8868\u6CE8\u91CA",colProps:{span:7},required:!0}],c=[{field:"field",component:"Input",label:" ",colProps:{span:4},componentProps:{placeholder:"\u5B57\u6BB5\u540D\u79F0"}},{field:"comment",component:"Input",label:" ",colProps:{span:4},componentProps:{placeholder:"\u5B57\u6BB5\u5907\u6CE8"}},{field:"length",component:"Input",label:" ",colProps:{span:3},componentProps:{placeholder:"\u957F\u5EA6/\u503C"}},{field:"default",component:"Input",label:" ",colProps:{span:4},componentProps:{placeholder:"\u9ED8\u8BA4\u503C"}},{field:"type",component:"Select",label:" ",colProps:{span:4},componentProps:{options:l}},{field:"primary_key",component:"Checkbox",label:" ",colProps:{span:1}},{field:"auto_increment",component:"Checkbox",label:" ",colProps:{span:1}},{field:"nullable",component:"Checkbox",label:" ",colProps:{span:1}},{field:"0",component:"Input",label:" ",colProps:{span:2},slot:"add"}],r=[{field:"name",component:"Input",label:" ",colProps:{span:6},componentProps:{placeholder:"\u7D22\u5F15\u540D"}},{field:"columns",component:"Select",label:" ",colProps:{span:6},componentProps:{mode:"multiple"},defaultValue:[]},{field:"type",component:"Select",label:" ",colProps:{span:6},componentProps:{options:[{label:"normal",value:"normal"},{label:"unique",value:"unique"}]},defaultValue:"normal"},{field:"0",component:"Input",label:" ",colProps:{span:2},slot:"add"}];function u(){return[{field:"field[0]",component:"Input",label:" ",colProps:{span:4},defaultValue:"id",required:!0,componentProps:{placeholder:"\u5B57\u6BB5\u540D\u79F0"}},{field:"comment[0]",component:"Input",label:" ",colProps:{span:4},defaultValue:"\u4E3B\u952E",componentProps:{placeholder:"\u5B57\u6BB5\u5907\u6CE8"}},{field:"length[0]",component:"Input",label:" ",colProps:{span:3},defaultValue:"11",componentProps:{placeholder:"\u957F\u5EA6/\u503C"}},{field:"default[0]",component:"Input",label:" ",colProps:{span:4},componentProps:{placeholder:"\u9ED8\u8BA4\u503C"}},{field:"type[0]",component:"Select",label:" ",colProps:{span:4},defaultValue:"unsignedInteger",required:!0,componentProps:{options:l}},{field:"primary_key[0]",component:"Checkbox",label:" ",defaultValue:!0,colProps:{span:1}},{field:"auto_increment[0]",component:"Checkbox",label:" ",defaultValue:!0,colProps:{span:1}},{field:"nullable[0]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"0",component:"Input",label:" ",colProps:{span:2},slot:"add"},{field:"field[1]",component:"Input",label:" ",colProps:{span:4},defaultValue:"created_at",required:!0,componentProps:{placeholder:"\u5B57\u6BB5\u540D\u79F0"}},{field:"comment[1]",component:"Input",label:" ",colProps:{span:4},defaultValue:"\u521B\u5EFA\u65F6\u95F4",componentProps:{placeholder:"\u5B57\u6BB5\u5907\u6CE8"}},{field:"length[1]",component:"Input",label:" ",colProps:{span:3},componentProps:{placeholder:"\u957F\u5EA6/\u503C"}},{field:"default[1]",component:"Input",label:" ",colProps:{span:4},componentProps:{placeholder:"\u9ED8\u8BA4\u503C"}},{field:"type[1]",component:"Select",label:" ",colProps:{span:4},defaultValue:"dateTime",required:!0,componentProps:{options:l}},{field:"primary_key[1]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"auto_increment[1]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"nullable[1]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"1",component:"Input",label:" ",colProps:{span:2},slot:"add"},{field:"field[2]",component:"Input",label:" ",colProps:{span:4},defaultValue:"updated_at",required:!0,componentProps:{placeholder:"\u5B57\u6BB5\u540D\u79F0"}},{field:"comment[2]",component:"Input",label:" ",colProps:{span:4},defaultValue:"\u66F4\u65B0\u65F6\u95F4",componentProps:{placeholder:"\u5B57\u6BB5\u5907\u6CE8"}},{field:"length[2]",component:"Input",label:" ",colProps:{span:3},componentProps:{placeholder:"\u957F\u5EA6/\u503C"}},{field:"default[2]",component:"Input",label:" ",colProps:{span:4},componentProps:{placeholder:"\u9ED8\u8BA4\u503C"}},{field:"type[2]",component:"Select",label:" ",colProps:{span:4},defaultValue:"dateTime",required:!0,componentProps:{options:l}},{field:"primary_key[2]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"auto_increment[2]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"nullable[2]",component:"Checkbox",label:" ",colProps:{span:1}},{field:"2",component:"Input",label:" ",colProps:{span:2},slot:"add"}]}export{t as controlSelectOptions,r as defaultKeySchemas,a as defaultTableSchemas,c as fieldSchemas,u as getDefaultFieldSchemas,p as typeToControl,n as typeToControlMap};
