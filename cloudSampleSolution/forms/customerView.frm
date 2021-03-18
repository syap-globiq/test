customProperties:"formComponent:false,\
useCssPosition:true",
dataSource:"db:/example_data/customers",
encapsulation:60,
items:[
{
cssPosition:"30,calc( 66% + 45px),30,30,282,30",
json:{
containedForm:"71C80C08-190D-4DA7-AEAD-4925904EE22E",
cssPosition:{
bottom:"30",
height:"30",
left:"30",
right:"calc( 66% + 45px)",
top:"30",
width:"282"
},
styleClass:"box"
},
name:"tabInfo",
styleClass:"box",
typeName:"bootstrapcomponents-tablesspanel",
typeid:47,
uuid:"2EB9251B-EAB4-47CA-A45E-B0ED1B6A2311"
},
{
cssPosition:"30,31,calc( 50% - 15px),calc(33% - 3px),-1,-1",
json:{
containedForm:"7AA01166-8697-4DA6-A6B3-8B7EA517D4F6",
cssPosition:{
bottom:"calc( 50% - 15px)",
height:"-1",
left:"calc(33% - 3px)",
right:"31",
top:"30",
width:"-1"
},
relationName:"customers_to_customers"
},
name:"tab",
typeName:"bootstrapcomponents-tablesspanel",
typeid:47,
uuid:"43C3E13A-3C46-4F36-BADE-F47ED3228CE4"
},
{
height:480,
partType:5,
typeid:19,
uuid:"B40E8FA2-AB36-495F-AE93-EFA831DD7978"
},
{
cssPosition:"calc( 55% - 2px),31,30,calc(33% - 3px),-1,-1",
json:{
containedForm:"A484D7D0-E207-4F7E-9489-6DBCB30DFE50",
cssPosition:{
bottom:"30",
height:"-1",
left:"calc(33% - 3px)",
right:"31",
top:"calc( 55% - 2px)",
width:"-1"
},
relationName:"customers_to_orders",
styleClass:"box"
},
name:"tabOrders",
styleClass:"box",
typeName:"bootstrapcomponents-tablesspanel",
typeid:47,
uuid:"F2456175-2AC6-487B-9DAB-F294D3B0A7EA"
}
],
name:"customerView",
navigatorID:"-1",
showInMenu:true,
size:"980,480",
styleClass:"bg-tertiary",
typeid:3,
uuid:"17448A6F-18EE-4AD1-9742-BFB7EAAF2135"