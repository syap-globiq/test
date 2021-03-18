customProperties:"formComponent:false,\
useCssPosition:true",
dataSource:"db:/clinic_db/patient",
encapsulation:108,
items:[
{
height:480,
partType:5,
typeid:19,
uuid:"4EDAD282-7B0F-4653-ABC2-51841F0DAFCA"
},
{
cssPosition:"165,-1,-1,15,1111,299",
json:{
columns:[
{
dataprovider:"patient_firstname",
headerTitle:"Name",
id:"patient_firstname",
svyUUID:"48E992A1-B152-4B94-972F-0DE174D71412"
},
{
dataprovider:"patient_lastname",
headerTitle:"Lastname",
id:"patient_lastname",
svyUUID:"546493B2-6F84-420C-8A35-723CAA4A106B"
},
{
dataprovider:"gender",
headerTitle:"Gender",
id:"gender",
svyUUID:"523878C8-6890-41FE-9A85-058EC1409E3F"
},
{
dataprovider:"date_of_consultation",
headerTitle:"Consultation Date",
id:"date_of_consultation",
svyUUID:"45C7DF37-CCF3-401B-B896-B2A1EB9EE52F"
},
{
dataprovider:"diagnosis",
headerTitle:"Diagnosis",
id:"diagnosis",
svyUUID:"BB8BDFE3-9654-4CD8-8C3B-4A4D93CA16AB"
},
{
headerTitle:"Edit",
id:"edit",
styleClass:"fas fa-edit clickable",
svyUUID:"D25BC352-61F2-40B7-94B2-5E25D1FEA6F5"
},
{
headerTitle:"Delete",
id:"delete",
styleClass:"fas fa-trash clickable",
svyUUID:"7864D036-7655-4CBF-8618-0A34E6ADC3D2"
}
],
cssPosition:{
bottom:"-1",
height:"299",
left:"15",
right:"-1",
top:"165",
width:"1111"
},
onCellClick:"E9449072-8045-4A41-9D4B-7F1E78B77656",
onCellDoubleClick:null
},
name:"patientTable",
typeName:"aggrid-groupingtable",
typeid:47,
uuid:"656B3AAB-D2FB-417F-BA2C-7526901FA93A"
}
],
name:"patientTableView",
navigatorID:"-1",
showInMenu:true,
size:"1139,480",
typeid:3,
uuid:"ADC7692F-97BA-4CA4-9A91-EF50A94C76E8"