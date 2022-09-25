var E=(s,h,r)=>new Promise((t,n)=>{var m=o=>{try{l(r.next(o))}catch(u){n(u)}},a=o=>{try{l(r.throw(o))}catch(u){n(u)}},l=o=>o.done?t(o.value):Promise.resolve(o.value).then(m,a);l((r=r.apply(s,h)).next())});import{B as N,u as U}from"./useTable.656d2bae.js";import{x as O}from"./BasicForm.6056307a.js";import{aG as H,r as B,a as V,d0 as G,dN as L,cE as j,ac as q,aI as T,o as K,h as z,j as _,p as $,cx as R,q as J,x as Q}from"./index.9e465e98.js";import{T as d}from"./table.0ba2e59f.js";import{b as W}from"./index.7ea231b7.js";import X from"./Update.16232ceb.js";import{a as Y,g as Z,b as ee}from"./common.6cef50b2.js";import{t as oe}from"./util.fd2dc0a3.js";import"./index.7cdee0ed.js";import"./useForm.7c9a0ef0.js";import"./index.967f417a.js";import"./index.d342c0df.js";import"./index.82faa0b7.js";import"./index.af33b015.js";import"./useWindowSizeFn.14b10c39.js";import"./useContentViewHeight.c6c711f4.js";import"./ArrowLeftOutlined.8cc9af78.js";import"./transButton.088152fa.js";import"./index.7e01442e.js";import"./index.1396ba67.js";import"./index.17dc3642.js";import"./_baseIteratee.2f88fd8b.js";import"./index.892b83b2.js";import"./sortable.esm.c20789c1.js";import"./RedoOutlined.e5187225.js";import"./FullscreenOutlined.0624c6a3.js";import"./scrollTo.e1b29360.js";import"./index.d11f5ba1.js";import"./index.caea034d.js";import"./index.a9758a55.js";import"./index.9dc129cb.js";import"./index.8f156bb7.js";import"./uniqBy.b001b07b.js";import"./download.8926825a.js";import"./index.2c96af2d.js";let f="",F="",v="",b="",w="";const p=B({schemas:[]}),te=V({components:{ModalInserOrEdit:X,BasicTable:N,TableAction:O},setup(){var y,A;const{createMessage:s}=Q(),{success:h}=s,r=G(),t=(A=(y=r.params)==null?void 0:y.id)!=null?A:"",n=r.path;if(t){f=d.SELECT+"?table="+t,F=d.INSERT+"?table="+t,v=d.UPDATE+"?table="+t,w=d.DELETE+"?table="+t,b=d.SCHEMA+"?table="+t;const{setTitle:i}=L();i(`${t}\u8868`)}else f=`/app/admin${n}/select`,F=`/app/admin${n}/insert`,v=`/app/admin${n}/update`,w=`/app/admin${n}/delete`,b=`/app/admin${n}/schema`;const m=B([]),a=B("");j(()=>E(this,null,function*(){const i=yield Y(b),S=i.columns;for(let e of S)if(e.primary_key){a.value=e.field;break}const x=i.forms;p.value.schemas=[];for(let e of x){if(e.searchable){let[C,g]=oe(e,"","search");e.search_type=="between"?(p.value.schemas.push({field:`${e.field}[0]`,component:C,label:e.comment||e.field,colProps:{offset:1,span:5},componentProps:g}),p.value.schemas.push({field:`${e.field}[1]`,component:C,label:"\u3000\u5230",colProps:{span:5},componentProps:g})):p.value.schemas.push({field:e.field,component:C,label:e.comment||e.field,colProps:{offset:1,span:10},componentProps:g})}let M={dataIndex:e.field,title:e.comment||e.field,sorter:e.enable_sort,defaultHidden:!e.list_show};["InputNumber","Switch"].indexOf(e.control)!=-1&&(M.width=120),m.value.push(M)}p.value.schemas.length||q(()=>{D({useSearchForm:!1})})}));const[l,{openModal:o}]=W(),[u,{reload:c,setProps:D}]=U({title:`${t}\u8868\u6570\u636E`,api:Z(f),columns:m,useSearchForm:!0,bordered:!0,formConfig:p,actionColumn:{width:250,title:"Action",dataIndex:"action",slots:{customRender:"action"}}});function I(i){return E(this,null,function*(){if(!a.value){R("\u5F53\u524D\u8868\u6CA1\u6709\u4E3B\u952E\uFF0C\u65E0\u6CD5\u7F16\u8F91");return}o(!0,{selectUrl:f,insertUrl:F,updateUrl:v,schemaUrl:b,column:a.value,value:i[a.value]})})}function P(i){return E(this,null,function*(){if(!a.value){R("\u5F53\u524D\u8868\u6CA1\u6709\u4E3B\u952E\uFF0C\u65E0\u6CD5\u5220\u9664");return}yield ee(w,{column:a.value,value:i[a.value]}),h("\u5220\u9664\u6210\u529F"),c()})}function k(){o(!0,{selectUrl:f,insertUrl:F,updateUrl:v,schemaUrl:b})}return{registerTable:u,handleEdit:I,handleDelete:P,openRowModal:k,register:l,reload:c}}}),ae={class:"p-4"},se=J(" \u6DFB\u52A0\u8BB0\u5F55 ");function ne(s,h,r,t,n,m){const a=T("a-button"),l=T("TableAction"),o=T("BasicTable"),u=T("ModalInserOrEdit");return K(),z("div",ae,[_(o,{onRegister:s.registerTable,showTableSetting:""},{toolbar:$(()=>[_(a,{type:"primary",onClick:s.openRowModal},{default:$(()=>[se]),_:1},8,["onClick"])]),action:$(({record:c})=>[_(l,{actions:[{label:"\u7F16\u8F91",onClick:s.handleEdit.bind(null,c)},{label:"\u5220\u9664",icon:"ic:outline-delete-outline",popConfirm:{title:"\u662F\u5426\u5220\u9664\uFF1F",confirm:s.handleDelete.bind(null,c)}}]},null,8,["actions"])]),_:1},8,["onRegister"]),_(u,{onRegister:s.register,minHeight:300,onReload:s.reload},null,8,["onRegister","onReload"])])}var Ge=H(te,[["render",ne]]);export{Ge as default};
