customProperties:"formComponent:false,\
useCssPosition:true",
dataSource:"db:/svy_security/tenants",
encapsulation:60,
items:[
{
cssPosition:"-1,calc(16% - 40px),15,-1,80,15",
json:{
cssPosition:{
bottom:"15",
height:"15",
left:"-1",
right:"calc(16% - 40px)",
top:"-1",
width:"80"
},
styleClass:"h5 text-tertiary text-center",
text:"SESSIONS"
},
name:"labelSessions",
styleClass:"h5 text-tertiary text-center",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"047778E8-7E8A-40D1-838D-59F2F0F59EF8"
},
{
cssPosition:"158,30,-1,175,0,22",
json:{
cssPosition:{
bottom:"-1",
height:"22",
left:"175",
right:"30",
top:"158",
width:"0"
},
text:"%%m_LockReasonText%%",
toolTipText:"Lock reason"
},
name:"labelLockReason",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"0ADC4FD8-B66C-4939-920D-36C9E3861E50"
},
{
cssPosition:"158,-1,-1,23,122,22",
json:{
cssPosition:{
bottom:"-1",
height:"22",
left:"23",
right:"-1",
top:"158",
width:"122"
},
styleClass:"border-success text-success border-default text-center",
text:"%%m_LockStausText%%"
},
name:"labelStatus",
styleClass:"border-success text-success border-default text-center",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"0BA3025A-65CB-4894-975D-A63778B38607"
},
{
cssPosition:"-1,calc(16% - 25px),34,-1,50,50",
json:{
cssPosition:{
bottom:"34",
height:"50",
left:"-1",
right:"calc(16% - 25px)",
top:"-1",
width:"50"
},
styleClass:"btn h4 font-weight-bold btn-default btn-round",
text:"%%activeSessions%%"
},
name:"iconActiveSessions",
styleClass:"btn h4 font-weight-bold btn-default btn-round",
typeName:"bootstrapcomponents-button",
typeid:47,
uuid:"0E8DFAED-C4CF-4A2D-B3E6-57A47B2901FD"
},
{
cssPosition:"278,15,160,15,0,0",
json:{
cssPosition:{
bottom:"160",
height:"0",
left:"15",
right:"15",
top:"278",
width:"0"
},
type:"bar"
},
name:"chart",
typeName:"svychartjs-chart",
typeid:47,
uuid:"1532B81C-D42B-4D7C-9D74-5C26B4F0B680"
},
{
cssPosition:"57,0,-1,0,0,1",
json:{
cssPosition:{
bottom:"-1",
height:"1",
left:"0",
right:"0",
top:"57",
width:"0"
},
styleClass:"border-top"
},
name:"dividerTop",
styleClass:"border-top",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"1A82F557-4B5E-4FE2-8FD7-FE52C6EE8E2A"
},
{
cssPosition:"-1,-1,15,calc(16% - 40px),80,15",
json:{
cssPosition:{
bottom:"15",
height:"15",
left:"calc(16% - 40px)",
right:"-1",
top:"-1",
width:"80"
},
styleClass:"h5 text-tertiary text-center",
text:"LOCK"
},
name:"labelLocked",
styleClass:"h5 text-tertiary text-center",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"2CA4EAFA-33C2-4724-BF42-035DBB4EFFB4"
},
{
cssPosition:"-1,-1,30,calc(16% - 25px),50,50",
json:{
cssPosition:{
bottom:"30",
height:"50",
left:"calc(16% - 25px)",
right:"-1",
top:"-1",
width:"50"
},
imageStyleClass:"fa fa-lock fa-3x text-danger",
onActionMethodID:"AB106273-1B8B-4BF5-A343-7E148F1F7A38",
styleClass:"default-align clickable"
},
name:"faLocked",
styleClass:"default-align clickable",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"3874D9F8-BDDA-4D99-AD92-A20B23A29845"
},
{
cssPosition:"-1,-1,30,calc(50% - 25px),50,50",
json:{
cssPosition:{
bottom:"30",
height:"50",
left:"calc(50% - 25px)",
right:"-1",
top:"-1",
width:"50"
},
imageStyleClass:"fa fa-crown fa-3x text-primary",
onActionMethodID:null,
size:{
height:25,
width:25
},
visible:false
},
name:"faMaster",
size:"25,25",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"44594634-30FD-449A-91C4-C1C72B36E051",
visible:false
},
{
cssPosition:"79,10,-1,22,0,34",
json:{
cssPosition:{
bottom:"-1",
height:"34",
left:"22",
right:"10",
top:"79",
width:"0"
},
styleClass:"h3",
text:"%%tenant_name%%",
toolTipText:"Tenant Name"
},
name:"labelName",
styleClass:"h3",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"54AAEEC9-4471-4F6F-B77A-15A35F8C8DC3"
},
{
height:480,
partType:5,
typeid:19,
uuid:"59F26E86-8838-4D9A-BB6B-35AFA86B32EA"
},
{
cssPosition:"-1,calc(50% - 25px),30,-1,50,50",
json:{
cssPosition:{
bottom:"30",
height:"50",
left:"-1",
right:"calc(50% - 25px)",
top:"-1",
width:"50"
},
imageStyleClass:"fa fa-link fa-3x text-primary",
onActionMethodID:null,
size:{
height:25,
width:25
},
visible:false
},
name:"faSlave",
size:"25,25",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"5C4A4B3A-B301-4768-AD8D-08192839220B",
visible:false
},
{
cssPosition:"-1,0,105,0,0,1",
json:{
cssPosition:{
bottom:"105",
height:"1",
left:"0",
right:"0",
top:"-1",
width:"0"
},
styleClass:"border-top"
},
name:"dividerBottom",
styleClass:"border-top",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"69CBB314-1854-453A-A5D4-50D58B7DD7C7"
},
{
cssPosition:"188,30,-1,55,0,31",
json:{
cssPosition:{
bottom:"-1",
height:"31",
left:"55",
right:"30",
top:"188",
width:"0"
},
text:"%%creation_datetime%%",
toolTipText:"Created by"
},
name:"labelCreatedOn",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"90DC6A14-7BBF-42E3-A6EA-2BA3BA963490"
},
{
cssPosition:"218,30,-1,55,0,31",
json:{
cssPosition:{
bottom:"-1",
height:"31",
left:"55",
right:"30",
top:"218",
width:"0"
},
text:"%%creation_user_name%%",
toolTipText:"Created by"
},
name:"labelCreatedBy",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"97CE9311-C7E3-4C9F-A90D-8C08C2CEE9E3"
},
{
cssPosition:"188,-1,-1,25,33,31",
json:{
cssPosition:{
bottom:"-1",
height:"31",
left:"25",
right:"-1",
top:"188",
width:"33"
},
imageStyleClass:"far fa-calendar-plus",
size:{
height:25,
width:25
},
toolTipText:"Created on"
},
name:"iconCreatedOn",
size:"25,25",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"9E698A92-1C62-4534-9DAA-2F7F5DD9D454"
},
{
cssPosition:"-1,-1,15,calc(50% - 60px),120,15",
json:{
cssPosition:{
bottom:"15",
height:"15",
left:"calc(50% - 60px)",
right:"-1",
top:"-1",
width:"120"
},
styleClass:"h5 text-tertiary text-center",
text:"MASTER",
visible:false
},
name:"labelMaster",
styleClass:"h5 text-tertiary text-center",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"A2633EB5-C332-4422-8F87-F9A927798101",
visible:false
},
{
cssPosition:"10,10,-1,10,0,36",
json:{
cssPosition:{
bottom:"-1",
height:"36",
left:"10",
right:"10",
top:"10",
width:"0"
},
styleClass:"h2 text-primary",
text:"Tenant"
},
name:"labelTitle",
styleClass:"h2 text-primary",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"AD5D6877-FF5B-43C4-9A0D-4E031FB6BBFA"
},
{
cssPosition:"117,56,-1,22,0,28",
json:{
cssPosition:{
bottom:"-1",
height:"28",
left:"22",
right:"56",
top:"117",
width:"0"
},
onActionMethodID:"C5E5D835-BB76-4DB3-8175-36CF2472012E",
styleClass:"h4 text-tertiary clickable",
text:"%%display_name%% <i class=\"padding-left-10 fa fa-pencil fa-sm\"><\/i>",
toolTipText:"Display Name"
},
name:"labelDisplayName",
styleClass:"h4 text-tertiary clickable",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"BA38AA8C-D797-4D99-8A82-5256AF326F54"
},
{
cssPosition:"218,-1,-1,25,33,31",
json:{
cssPosition:{
bottom:"-1",
height:"31",
left:"25",
right:"-1",
top:"218",
width:"33"
},
imageStyleClass:"fas fa-user-plus",
size:{
height:25,
width:25
},
toolTipText:"Created by"
},
name:"iconCreatedBy",
size:"25,25",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"E040DE17-BFEA-462C-AF75-FE3D6A06BA68"
},
{
cssPosition:"-1,-1,30,calc(16% - 25px),50,50",
json:{
cssPosition:{
bottom:"30",
height:"50",
left:"calc(16% - 25px)",
right:"-1",
top:"-1",
width:"50"
},
onActionMethodID:"4286147E-324E-48B2-80A9-1F5344A0A1CF",
size:{
height:25,
width:25
},
styleClass:"default-align clickable"
},
name:"faUnlocked",
size:"25,25",
styleClass:"default-align clickable",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"FC1C03E5-8369-49B7-A15F-8CC7683D1690"
}
],
name:"svySecurityUXTenantInfo",
navigatorID:"-1",
onRecordSelectionMethodID:"B121EB61-8408-4012-BFF3-ADAA71C4B737",
onShowMethodID:"BFFEFFCE-6ABE-4572-B308-BA93FD0851B9",
showInMenu:true,
typeid:3,
uuid:"BD6886CD-7075-4C46-82E7-54904D0C65F6"