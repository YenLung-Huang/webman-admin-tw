import{ao as K,a9 as N,a as U,aa as c,ap as z,cE as A,ai as g,r as w,f as S,V as E,U as D,ak as H,ac as L,J as d,j as s,T as C,aF as W,a1 as G,b8 as x,cP as J,bl as F}from"./index.108b3650.js";var R=N("small","default"),$=function(){return{id:String,prefixCls:String,size:c.oneOf(R),disabled:{type:Boolean,default:void 0},checkedChildren:c.any,unCheckedChildren:c.any,tabindex:c.oneOfType([c.string,c.number]),autofocus:{type:Boolean,default:void 0},loading:{type:Boolean,default:void 0},checked:c.oneOfType([c.string,c.number,c.looseBool]),checkedValue:c.oneOfType([c.string,c.number,c.looseBool]).def(!0),unCheckedValue:c.oneOfType([c.string,c.number,c.looseBool]).def(!1),onChange:{type:Function},onClick:{type:Function},onKeydown:{type:Function},onMouseup:{type:Function},"onUpdate:checked":{type:Function},onBlur:Function,onFocus:Function}},q=U({name:"ASwitch",__ANT_SWITCH:!0,inheritAttrs:!1,props:$(),slots:["checkedChildren","unCheckedChildren"],setup:function(n,r){var o=r.attrs,y=r.slots,T=r.expose,l=r.emit,b=z();A(function(){g(!("defaultChecked"in o),"Switch","'defaultChecked' is deprecated, please use 'v-model:checked'"),g(!("value"in o),"Switch","`value` is not validate prop, do you mean `checked`?")});var h=w(n.checked!==void 0?n.checked:o.defaultChecked),f=S(function(){return h.value===n.checkedValue});E(function(){return n.checked},function(){h.value=n.checked});var v=D("switch",n),u=v.prefixCls,V=v.direction,_=v.size,i=w(),m=function(){var e;(e=i.value)===null||e===void 0||e.focus()},I=function(){var e;(e=i.value)===null||e===void 0||e.blur()};T({focus:m,blur:I}),H(function(){L(function(){n.autofocus&&!n.disabled&&i.value.focus()})});var k=function(e,t){n.disabled||(l("update:checked",e),l("change",e,t),b.onFieldChange())},p=function(e){l("blur",e)},M=function(e){m();var t=f.value?n.unCheckedValue:n.checkedValue;k(t,e),l("click",t,e)},O=function(e){e.keyCode===F.LEFT?k(n.unCheckedValue,e):e.keyCode===F.RIGHT&&k(n.checkedValue,e),l("keydown",e)},P=function(e){var t;(t=i.value)===null||t===void 0||t.blur(),l("mouseup",e)},j=S(function(){var a;return a={},d(a,"".concat(u.value,"-small"),_.value==="small"),d(a,"".concat(u.value,"-loading"),n.loading),d(a,"".concat(u.value,"-checked"),f.value),d(a,"".concat(u.value,"-disabled"),n.disabled),d(a,u.value,!0),d(a,"".concat(u.value,"-rtl"),V.value==="rtl"),a});return function(){var a;return s(J,{insertExtraNode:!0},{default:function(){return[s("button",C(C(C({},W(n,["prefixCls","checkedChildren","unCheckedChildren","checked","autofocus","checkedValue","unCheckedValue","id","onChange","onUpdate:checked"])),o),{},{id:(a=n.id)!==null&&a!==void 0?a:b.id.value,onKeydown:O,onClick:M,onBlur:p,onMouseup:P,type:"button",role:"switch","aria-checked":h.value,disabled:n.disabled||n.loading,class:[o.class,j.value],ref:i}),[s("div",{class:"".concat(u.value,"-handle")},[n.loading?s(G,{class:"".concat(u.value,"-loading-icon")},null):null]),s("span",{class:"".concat(u.value,"-inner")},[f.value?x(y,n,"checkedChildren"):x(y,n,"unCheckedChildren")])])]}})}}}),X=K(q);export{X as S};
