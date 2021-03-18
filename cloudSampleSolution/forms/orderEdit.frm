customProperties:"formComponent:false,\
methods:{\
onRecordSelectionMethodID:{\
arguments:null,\
parameters:null\
}\
},\
useCssPosition:true",
dataSource:"db:/example_data/orders",
encapsulation:44,
extendsID:"954F2DA3-D9B2-44F2-B5C2-6A1FDAB1507B",
items:[
{
cssPosition:"253,60,-1,calc(50% + 145px),0,42",
dataProviderID:"shipcountry",
formIndex:17,
name:"country",
typeid:4,
uuid:"038B2A98-1715-4A89-9F3F-0CD765484E0C"
},
{
cssPosition:"95,-1,-1,calc(50% + 15px),161,25",
formIndex:21,
json:{
cssPosition:{
bottom:"-1",
height:"25",
left:"calc(50% + 15px)",
right:"-1",
top:"95",
width:"161"
},
formIndex:21,
styleClass:"h5 text-tertiary",
text:"CUSTOMER ADDRESS"
},
name:"label_customerAddress",
styleClass:"h5 text-tertiary",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"08A39C53-D5D1-4EC6-BA46-64C1B8275455"
},
{
cssPosition:"70,30,-1,30,0,472",
extendsID:"AFD100FA-E956-4DE4-B2CC-094D990971E8",
formIndex:0,
json:{
cssPosition:{
bottom:"-1",
height:"472",
left:"30",
right:"30",
top:"70",
width:"0"
},
formIndex:0
},
typeid:47,
uuid:"140F8736-7B1A-44EE-8EAD-3CC3908E09D2"
},
{
cssPosition:"368,calc(50% - 10px),-1,-1,25,31",
formIndex:33,
json:{
alignment:"center",
cssPosition:{
bottom:"-1",
height:"31",
left:"-1",
right:"calc(50% - 10px)",
top:"368",
width:"25"
},
faclass:"far fa-calendar-check",
formIndex:33,
imageStyleClass:"far fa-calendar-check",
onActionMethodID:"0781C250-0287-4E70-B3CD-B6E6C7F3D59B",
size:{
height:25,
width:25
},
styleClass:"default-align clickable",
styleclass:"clickable"
},
name:"iconPickRequiredDate",
size:"25,25",
styleClass:"default-align clickable",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"2C3AD001-4D86-4753-BB4A-AE3F2311E698"
},
{
cssPosition:"311,60,-1,calc(50% + 145px),0,42",
dataProviderID:"shipcity",
formIndex:20,
name:"city",
typeid:4,
uuid:"33BF2F18-66BE-4529-972F-0C06D7337651"
},
{
cssPosition:"148,-1,-1,60,25,20",
formIndex:16,
json:{
cssPosition:{
bottom:"-1",
height:"20",
left:"60",
right:"-1",
top:"148",
width:"25"
},
faclass:"fas fa-phone",
formIndex:16,
imageStyleClass:"fas fa-phone",
size:{
height:25,
width:25
}
},
name:"iconCreatedOn",
size:"25,25",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"38640E9B-6B49-43F0-8391-323CF42C2633"
},
{
cssPosition:"311,-1,-1,60,120,42",
formIndex:28,
labelFor:"orderdate",
name:"orderdate_label",
text:"Orderdate",
transparent:true,
typeid:7,
uuid:"386DD691-9D1C-4C33-BE5C-D29467732795"
},
{
cssPosition:"253,-1,-1,calc(50% + 15px),120,42",
formIndex:4,
name:"country_label",
text:"Country",
transparent:true,
typeid:7,
uuid:"3A2E04D2-C994-43ED-B524-CEDDFCFC88E9"
},
{
extendsID:"642700D2-400D-46A8-B5C7-E88E7D6B3E91",
height:700,
typeid:19,
uuid:"3C8A19DF-9BE5-43DB-A5BA-1E21464239B3"
},
{
cssPosition:"173,59,-1,calc(50% + 16px),0,20",
displaysTags:true,
formIndex:5,
text:"%%orders_to_customers.country%%",
typeid:7,
uuid:"3E79631F-8442-424C-BF5A-40E8BE04A8F3"
},
{
cssPosition:"218,-1,-1,calc(50% + 15px),142,23",
formIndex:22,
json:{
cssPosition:{
bottom:"-1",
height:"23",
left:"calc(50% + 15px)",
right:"-1",
top:"218",
width:"142"
},
formIndex:22,
styleClass:"h5 text-tertiary",
text:"DELIVERY ADDRESS"
},
name:"label_deliveryAddress",
styleClass:"h5 text-tertiary",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"3EBA2230-91AC-4C33-9CB4-451955DB3D79"
},
{
cssPosition:"147,60,-1,calc(50% + 15px),0,20",
displaysTags:true,
formIndex:1,
text:"%%orders_to_customers.city%%, %%orders_to_customers.postalcode%%",
typeid:7,
uuid:"437EB461-F6B2-45CA-B352-23317956D651"
},
{
cssPosition:"475,calc(50% + 15px),-1,180,243,42",
dataProviderID:"shipvia",
displayType:2,
editable:false,
formIndex:26,
name:"shipVia",
typeid:4,
uuid:"49C993DC-A68C-4FE3-8B31-926D902B98FD",
valuelistID:"EE397070-5A81-4A99-A9C0-539F6100B5BF"
},
{
cssPosition:"363,calc(50% + 15px),-1,180,253,42",
dataProviderID:"requireddate",
displayType:5,
formIndex:12,
name:"requireddate",
typeid:4,
uuid:"4B15B932-E3A4-4B0A-B8B2-7C301D1A98BE"
},
{
cssPosition:"475,60,-1,calc(50% + 145px),0,42",
formIndex:25,
json:{
cssPosition:{
bottom:"-1",
height:"42",
left:"calc(50% + 145px)",
right:"60",
top:"475",
width:"0"
},
dataProviderID:"shipregion",
formIndex:25
},
name:"region",
typeName:"bootstrapcomponents-textbox",
typeid:47,
uuid:"4F37A84E-C993-4FF1-AC77-C8B96B03690A"
},
{
cssPosition:"363,-1,-1,calc(50% + 15px),120,42",
formIndex:8,
name:"address_label",
text:"Address",
transparent:true,
typeid:7,
uuid:"5A277406-4B90-47C5-81CD-62000C97C462"
},
{
cssPosition:"421,-1,-1,calc(50% + 15px),120,42",
formIndex:11,
name:"postalcode_label",
text:"Postalcode",
transparent:true,
typeid:7,
uuid:"5A885680-78CF-4AD7-BC84-45E6A24D275C"
},
{
cssPosition:"363,-1,-1,60,120,42",
formIndex:29,
labelFor:"requireddate",
name:"requireddate_label",
text:"Requireddate",
transparent:true,
typeid:7,
uuid:"668D2EE4-7419-4C9B-B48E-0B3C21FE3CE1"
},
{
cssPosition:"123,60,-1,calc(50% + 15px),0,20",
displaysTags:true,
formIndex:2,
text:"%%orders_to_customers.address%%",
typeid:7,
uuid:"6E796E1B-DA14-4E5F-AEAE-4A29B207E9AE"
},
{
cssPosition:"95,-1,-1,58,86,23",
formIndex:23,
json:{
cssPosition:{
bottom:"-1",
height:"23",
left:"58",
right:"-1",
top:"95",
width:"86"
},
formIndex:23,
styleClass:"h5 text-tertiary",
text:"INFO"
},
name:"label_info",
styleClass:"h5 text-tertiary",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"73B00E8D-19E5-4027-9C2F-E877455EE5C9"
},
{
cssPosition:"475,-1,-1,60,120,42",
formIndex:32,
name:"shipvia_label",
text:"Shipvia",
transparent:true,
typeid:7,
uuid:"8638135C-7985-4AE3-A5BC-7737E27BA9CF"
},
{
cssPosition:"421,calc(50% + 15px),-1,180,253,42",
dataProviderID:"shippeddate",
displayType:5,
formIndex:3,
name:"shippeddate",
typeid:4,
uuid:"8C883DD2-1E0A-4EA9-987E-E35EAB9123C3"
},
{
cssPosition:"475,-1,-1,calc(50% + 15px),120,42",
formIndex:13,
name:"region_label",
text:"Region",
transparent:true,
typeid:7,
uuid:"8DE70884-1412-47A6-B488-8C5B4D19D8AC"
},
{
cssPosition:"253,calc(50% + 15px),-1,180,243,42",
dataProviderID:"employeeid",
displayType:2,
editable:false,
formIndex:27,
name:"employee",
typeid:4,
uuid:"991C01FB-3983-4233-BC24-29D5BF63E9FB",
valuelistID:"68D0A4FD-5742-41AB-9165-9543DC40C9F2"
},
{
cssPosition:"311,-1,-1,calc(50% + 15px),120,42",
formIndex:7,
name:"city_label",
text:"City",
transparent:true,
typeid:7,
uuid:"9B9F6B92-2B88-41BD-B0A4-358DC8F33D87"
},
{
cssPosition:"123,calc(50% + 15px),-1,60,0,20",
displaysTags:true,
formIndex:6,
text:"%%orders_to_customers.contacttitle%% %%orders_to_customers.contactname%%",
typeid:7,
uuid:"9DE64BCA-81C0-4B92-A495-B51B2FAF3E43"
},
{
cssPosition:"421,-1,-1,60,120,42",
formIndex:30,
labelFor:"shippeddate",
name:"shippeddate_label",
text:"Shippeddate",
transparent:true,
typeid:7,
uuid:"A063E370-E5B7-4FAC-9715-DDC03B0254A2"
},
{
cssPosition:"171,-1,-1,60,25,20",
formIndex:9,
json:{
cssPosition:{
bottom:"-1",
height:"20",
left:"60",
right:"-1",
top:"171",
width:"25"
},
faclass:"fas fa-fax",
formIndex:9,
imageStyleClass:"fas fa-fax",
size:{
height:25,
width:25
}
},
name:"iconCreatedBy",
size:"25,25",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"CB21DF48-5D03-4E2F-B2E5-7FC4F45AE862"
},
{
cssPosition:"147,calc(50% + 15px),-1,93,0,20",
formIndex:14,
json:{
cssPosition:{
bottom:"-1",
height:"20",
left:"93",
right:"calc(50% + 15px)",
top:"147",
width:"0"
},
formIndex:14,
text:"%%phone%%"
},
name:"labelCreatedOn",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"D4F20D63-CEBF-4E9A-9EE0-95B4C7087AD9"
},
{
cssPosition:"253,-1,-1,60,120,42",
formIndex:31,
name:"label_employee",
text:"Employee",
transparent:true,
typeid:7,
uuid:"D82982B0-5489-4237-BE59-73D4D1BFFD3A"
},
{
cssPosition:"217,-1,-1,60,86,23",
formIndex:24,
json:{
cssPosition:{
bottom:"-1",
height:"23",
left:"60",
right:"-1",
top:"217",
width:"86"
},
formIndex:24,
styleClass:"h5 text-tertiary",
text:"DELIVERY"
},
name:"label_delivery",
styleClass:"h5 text-tertiary",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"E1812ED5-95E6-4B4D-8816-86A6384D2637"
},
{
cssPosition:"426,calc(50% - 10px),-1,-1,25,31",
formIndex:34,
json:{
alignment:"center",
cssPosition:{
bottom:"-1",
height:"31",
left:"-1",
right:"calc(50% - 10px)",
top:"426",
width:"25"
},
faclass:"far fa-calendar-check",
formIndex:34,
imageStyleClass:"far fa-calendar-check",
onActionMethodID:"0781C250-0287-4E70-B3CD-B6E6C7F3D59B",
size:{
height:25,
width:25
},
styleClass:"default-align clickable",
styleclass:"clickable"
},
name:"iconPickRequiredDatec",
size:"25,25",
styleClass:"default-align clickable",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"E49E62FE-0DA4-4A52-8DD8-A30FDA912ABD"
},
{
cssPosition:"311,calc(50% + 15px),-1,180,0,42",
dataProviderID:"orderdate",
displayType:5,
formIndex:10,
name:"orderdate",
typeid:4,
uuid:"E7C95726-FA27-4254-A506-8DD1142EAE44"
},
{
cssPosition:"421,60,-1,calc(50% + 145px),0,42",
dataProviderID:"shippostalcode",
formIndex:15,
name:"postalcode",
typeid:4,
uuid:"E7C99501-B980-4242-94C6-64589D19E6D0"
},
{
cssPosition:"363,60,-1,calc(50% + 145px),0,42",
dataProviderID:"shipaddress",
formIndex:19,
name:"address1",
typeid:4,
uuid:"F71E7872-B34E-4A03-834C-FF578F5DF535"
},
{
cssPosition:"570,30,30,30,200,110",
json:{
containedForm:"8B6F2344-D2DF-436E-9852-6752DCDBDBF2",
cssPosition:{
bottom:"30",
height:"110",
left:"30",
right:"30",
top:"570",
width:"200"
},
relationName:"orders_to_order_details",
styleClass:"box"
},
name:"tabOrders",
styleClass:"box",
typeName:"bootstrapcomponents-tablesspanel",
typeid:47,
uuid:"F7482844-FA17-4418-BA21-45BC1A4C59C1"
},
{
cssPosition:"173,calc(50% + 15px),-1,93,0,20",
formIndex:18,
json:{
cssPosition:{
bottom:"-1",
height:"20",
left:"93",
right:"calc(50% + 15px)",
top:"173",
width:"0"
},
formIndex:18,
text:"%%fax%%"
},
name:"labelCreatedBy",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"F9025EDE-3273-41EA-8D38-3F91628433D4"
},
{
customProperties:"methods:{\
onCrumbClicked:{\
arguments:null,\
parameters:null\
}\
}",
extendsID:"9002DFD5-92D4-4E02-A613-E24A0B0C42DE",
json:{
breadcrumbs:[
{
crumbId:"table",
displayName:"Customers",
svyUUID:"FD09C2DE-E7C2-4A22-84FB-6B6118C31869"
},
{
crumbId:"view",
displayName:"Info",
svyUUID:"D48E1073-F7C7-4251-BDB6-1E994F03E2E3"
},
{
crumbId:"id",
displayName:"Order %%orderText%%",
svyUUID:"31260DD4-D10B-4560-9CCC-2D1C4F5E68F2"
}
],
onCrumbClicked:"B004B4E7-62B9-4D04-AC04-336474CAC6E5"
},
typeid:47,
uuid:"F9E367C8-930C-41DA-A063-DCA4416CFD65"
}
],
name:"orderEdit",
navigatorID:"-1",
onRecordSelectionMethodID:"D4EEAFC8-18D5-4CBC-AA7B-B9C94344B52B",
showInMenu:true,
size:"895,812",
typeid:3,
uuid:"5056B204-803D-45C1-AFDA-A113EC95770F"