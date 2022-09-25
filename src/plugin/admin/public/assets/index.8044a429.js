var b=(t,p,n)=>new Promise((a,u)=>{var m=o=>{try{s(n.next(o))}catch(r){u(r)}},c=o=>{try{s(n.throw(o))}catch(r){u(r)}},s=o=>o.done?a(o.value):Promise.resolve(o.value).then(m,c);s((n=n.apply(t,p)).next())});import{B as k,u as A}from"./useTable.656d2bae.js";import{x as P}from"./BasicForm.6056307a.js";import{a as x,g as D,b as $}from"./common.6cef50b2.js";import{b as S}from"./index.7ea231b7.js";import U from"./Update.dd91a981.js";import{aG as O,r as T,a as N,cE as G,ac as H,aI as _,o as V,h as j,j as v,p as g,dJ as q,cx as w,q as J,x as K}from"./index.9e465e98.js";import{t as z}from"./util.fd2dc0a3.js";import"./index.7cdee0ed.js";import"./useForm.7c9a0ef0.js";import"./index.967f417a.js";import"./index.d342c0df.js";import"./index.82faa0b7.js";import"./index.af33b015.js";import"./useWindowSizeFn.14b10c39.js";import"./useContentViewHeight.c6c711f4.js";import"./ArrowLeftOutlined.8cc9af78.js";import"./transButton.088152fa.js";import"./index.7e01442e.js";import"./index.1396ba67.js";import"./index.17dc3642.js";import"./_baseIteratee.2f88fd8b.js";import"./index.892b83b2.js";import"./sortable.esm.c20789c1.js";import"./RedoOutlined.e5187225.js";import"./FullscreenOutlined.0624c6a3.js";import"./scrollTo.e1b29360.js";import"./index.d11f5ba1.js";import"./index.caea034d.js";import"./index.a9758a55.js";import"./index.9dc129cb.js";import"./index.8f156bb7.js";import"./uniqBy.b001b07b.js";import"./download.8926825a.js";import"./index.2c96af2d.js";const C="/app/admin/auth/adminrole/select",B="/app/admin/auth/adminrole/insert",y="/app/admin/auth/adminrole/update",L="/app/admin/auth/adminrole/delete",E="/app/admin/auth/adminrole/schema",l=T({schemas:[]}),Q=N({components:{ModalInserOrEdit:U,BasicTable:k,TableAction:P},setup(){const{createMessage:t}=K(),{success:p}=t,n=T([]),a=T("");G(()=>b(this,null,function*(){const i=yield x(E),R=i.columns;for(let e of R)if(e.primary_key){a.value=e.field;break}const I=i.forms;l.value.schemas=[];for(let e of I){if(e.searchable){let[h,F]=z(e,"","search");e.search_type=="between"?(l.value.schemas.push({field:`${e.field}[0]`,component:h,label:e.comment||e.field,colProps:{offset:1,span:5},componentProps:F}),l.value.schemas.push({field:`${e.field}[1]`,component:h,label:"\u3000\u5230",colProps:{span:5},componentProps:F})):l.value.schemas.push({field:e.field,component:"Input",label:e.comment||e.field,colProps:{offset:1,span:10},componentProps:F})}let f={dataIndex:e.field,title:e.comment||e.field,sorter:e.enable_sort,defaultHidden:!e.list_show};["InputNumber","Switch"].indexOf(e.control)!=-1&&(f.width=120),e.field=="avatar"&&(f.width=50,f.customRender=({record:h})=>q("img",{src:h[e.field]})),n.value.push(f)}H(()=>{l.value.schemas.length||o({useSearchForm:!1})})}));const[u,{openModal:m}]=S(),[c,{reload:s,setProps:o}]=A({api:D(C),columns:n,useSearchForm:!0,bordered:!0,formConfig:l,actionColumn:{width:250,title:"Action",dataIndex:"action",slots:{customRender:"action"}}});function r(i){return b(this,null,function*(){if(!a.value){w("\u5F53\u524D\u8868\u6CA1\u6709\u4E3B\u952E\uFF0C\u65E0\u6CD5\u7F16\u8F91");return}m(!0,{selectUrl:C,insertUrl:B,updateUrl:y,schemaUrl:E,column:a.value,value:i[a.value]})})}function d(i){return b(this,null,function*(){if(!a.value){w("\u5F53\u524D\u8868\u6CA1\u6709\u4E3B\u952E\uFF0C\u65E0\u6CD5\u5220\u9664");return}yield $(L,{column:a.value,value:i[a.value]}),p("\u5220\u9664\u6210\u529F"),s()})}function M(){m(!0,{selectUrl:C,insertUrl:B,updateUrl:y,schemaUrl:E})}return{registerTable:c,handleEdit:r,handleDelete:d,openRowModal:M,register:u,reload:s}}}),W={class:"p-4"},X=J(" \u6DFB\u52A0\u8BB0\u5F55 ");function Y(t,p,n,a,u,m){const c=_("a-button"),s=_("TableAction"),o=_("BasicTable"),r=_("ModalInserOrEdit");return V(),j("div",W,[v(o,{onRegister:t.registerTable,showTableSetting:""},{toolbar:g(()=>[v(c,{type:"primary",onClick:t.openRowModal},{default:g(()=>[X]),_:1},8,["onClick"])]),action:g(({record:d})=>[v(s,{actions:[{label:"\u7F16\u8F91",onClick:t.handleEdit.bind(null,d)},{label:"\u5220\u9664",icon:"ic:outline-delete-outline",popConfirm:{title:"\u662F\u5426\u5220\u9664\uFF1F",confirm:t.handleDelete.bind(null,d)}}]},null,8,["actions"])]),_:1},8,["onRegister"]),v(r,{onRegister:t.register,minHeight:300,onReload:t.reload},null,8,["onRegister","onReload"])])}var De=O(Q,[["render",Y]]);export{De as default};
