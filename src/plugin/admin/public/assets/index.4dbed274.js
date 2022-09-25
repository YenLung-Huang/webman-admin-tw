var f=(t,p,n)=>new Promise((a,u)=>{var m=o=>{try{s(n.next(o))}catch(r){u(r)}},c=o=>{try{s(n.throw(o))}catch(r){u(r)}},s=o=>o.done?a(o.value):Promise.resolve(o.value).then(m,c);s((n=n.apply(t,p)).next())});import{B as A,u as I}from"./useTable.656d2bae.js";import{x as P}from"./BasicForm.6056307a.js";import{a as x,g as D,b as $}from"./common.6cef50b2.js";import{b as S}from"./index.7ea231b7.js";import U from"./Update.16232ceb.js";import{aG as O,r as T,a as N,cE as G,ac as H,aI as h,o as V,h as j,j as b,p as v,cx as B,q,x as K}from"./index.9e465e98.js";import{t as z}from"./util.fd2dc0a3.js";import"./index.7cdee0ed.js";import"./useForm.7c9a0ef0.js";import"./index.967f417a.js";import"./index.d342c0df.js";import"./index.82faa0b7.js";import"./index.af33b015.js";import"./useWindowSizeFn.14b10c39.js";import"./useContentViewHeight.c6c711f4.js";import"./ArrowLeftOutlined.8cc9af78.js";import"./transButton.088152fa.js";import"./index.7e01442e.js";import"./index.1396ba67.js";import"./index.17dc3642.js";import"./_baseIteratee.2f88fd8b.js";import"./index.892b83b2.js";import"./sortable.esm.c20789c1.js";import"./RedoOutlined.e5187225.js";import"./FullscreenOutlined.0624c6a3.js";import"./scrollTo.e1b29360.js";import"./index.d11f5ba1.js";import"./index.caea034d.js";import"./index.a9758a55.js";import"./index.9dc129cb.js";import"./index.8f156bb7.js";import"./uniqBy.b001b07b.js";import"./download.8926825a.js";import"./index.2c96af2d.js";const g="/app/admin/auth/adminrule/select",w="/app/admin/auth/adminrule/insert",y="/app/admin/auth/adminrule/update",J="/app/admin/auth/adminrule/delete",C="/app/admin/auth/adminrule/schema",l=T({schemas:[]}),L=N({components:{ModalInserOrEdit:U,BasicTable:A,TableAction:P},setup(){const{createMessage:t}=K(),{success:p}=t,n=T([]),a=T("");G(()=>f(this,null,function*(){const i=yield x(C),R=i.columns;for(let e of R)if(e.primary_key){a.value=e.field;break}const k=i.forms;l.value.schemas=[];for(let e of k){if(e.searchable){let[_,F]=z(e,"","search");e.search_type=="between"?(l.value.schemas.push({field:`${e.field}[0]`,component:_,label:e.comment||e.field,colProps:{offset:1,span:5},componentProps:F}),l.value.schemas.push({field:`${e.field}[1]`,component:_,label:"\u3000\u5230",colProps:{span:5},componentProps:F})):l.value.schemas.push({field:e.field,component:_,label:e.comment||e.field,colProps:{offset:1,span:10},componentProps:F})}let E={dataIndex:e.field,title:e.comment||e.field,sorter:e.enable_sort,defaultHidden:!e.list_show};["InputNumber","Switch"].indexOf(e.control)!=-1&&(E.width=120),n.value.push(E)}l.value.schemas.length||H(()=>{o({useSearchForm:!1})})}));const[u,{openModal:m}]=S(),[c,{reload:s,setProps:o}]=I({api:D(g,{format:"table_tree"}),columns:n,useSearchForm:!0,bordered:!0,isTreeTable:!0,formConfig:l,pagination:!1,actionColumn:{width:250,title:"Action",dataIndex:"action",slots:{customRender:"action"}}});function r(i){return f(this,null,function*(){if(!a.value){B("\u5F53\u524D\u8868\u6CA1\u6709\u4E3B\u952E\uFF0C\u65E0\u6CD5\u7F16\u8F91");return}m(!0,{selectUrl:g,insertUrl:w,updateUrl:y,schemaUrl:C,column:a.value,value:i[a.value]})})}function d(i){return f(this,null,function*(){if(!a.value){B("\u5F53\u524D\u8868\u6CA1\u6709\u4E3B\u952E\uFF0C\u65E0\u6CD5\u5220\u9664");return}yield $(J,{column:a.value,value:i[a.value]}),p("\u5220\u9664\u6210\u529F"),s()})}function M(){m(!0,{selectUrl:g,insertUrl:w,updateUrl:y,schemaUrl:C})}return{registerTable:c,handleEdit:r,handleDelete:d,openRowModal:M,register:u,reload:s}}}),Q={class:"p-4"},W=q(" \u6DFB\u52A0\u8BB0\u5F55 ");function X(t,p,n,a,u,m){const c=h("a-button"),s=h("TableAction"),o=h("BasicTable"),r=h("ModalInserOrEdit");return V(),j("div",Q,[b(o,{onRegister:t.registerTable,showTableSetting:""},{toolbar:v(()=>[b(c,{type:"primary",onClick:t.openRowModal},{default:v(()=>[W]),_:1},8,["onClick"])]),action:v(({record:d})=>[b(s,{actions:[{label:"\u7F16\u8F91",onClick:t.handleEdit.bind(null,d)},{label:"\u5220\u9664",icon:"ic:outline-delete-outline",popConfirm:{title:"\u662F\u5426\u5220\u9664\uFF1F",confirm:t.handleDelete.bind(null,d)}}]},null,8,["actions"])]),_:1},8,["onRegister"]),b(r,{onRegister:t.register,minHeight:300,onReload:t.reload},null,8,["onRegister","onReload"])])}var xe=O(L,[["render",X]]);export{xe as default};
