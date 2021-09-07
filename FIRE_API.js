function loadDef(flag) {
    if (flag==1) {
        //Default shit
        document.getElementById("curwealth").value="200000";
        //document.getElementById("savedtotal").value="50000";
        document.getElementById("Interest").value="7";
        document.getElementById("spending").value="40000";
        document.getElementById("Goal").value="1250000";
        document.getElementById("incomePre").value="200000";
        document.getElementById("state").value="Indiana";
        document.getElementById("ira").value="0";
        document.getElementById("filingstatus").value="single";
        document.getElementById("netincomeinput").value="143394.65"
        document.getElementById("savedtotal").value="103394.64"
        document.getElementById("spendingretire").value="50000";
    } else if (flag==0) {
        //Nuke Everything
        document.getElementById("curwealth").value="";
        document.getElementById("savedtotal").value="";
        document.getElementById("Interest").value="";
        document.getElementById("spending").value="";
        document.getElementById("incomePre").value="";
        document.getElementById("target").innerHTML="";
        document.getElementById("yrs2ret").innerHTML="";
        document.getElementById("Goal").value="";
        document.getElementById("ira").value="";
        document.getElementById("filingstatus").value="single";
        document.getElementById("income1").style.display = "none";
        document.getElementById("income1input").style.display = "none";
        document.getElementById("income2").style.display = "none";
        document.getElementById("income2input").style.display = "none";
        document.getElementById("income12blank").style.display = "none";
        document.getElementById("netincomeinput").value="";
        var dvTable = document.getElementById("dvTable");
        dvTable.innerHTML = "";
        document.getElementById("agi").innerHTML=null;
        document.getElementById("statetax").innerHTML=null;
        document.getElementById("taxhead1").innerHTML=null;
        document.getElementById("payrolltaxhead").innerHTML=null;
        document.getElementById("taxhead2").innerHTML=null;
        document.getElementById("fedtax").innerHTML=null;
        document.getElementById("taxerror").innerHTML=null;
        document.getElementById("payrolltax").innerHTML=null;
        document.getElementById("retirementincome").innerHTML=null;

    } else if (flag==2) {
        document.getElementById("agi").innerHTML=null;
        document.getElementById("statetax").innerHTML=null;
        document.getElementById("taxhead1").innerHTML=null;
        document.getElementById("payrolltaxhead").innerHTML=null;
        document.getElementById("taxhead2").innerHTML=null;
        document.getElementById("fedtax").innerHTML=null;
        document.getElementById("payrolltax").innerHTML=null;
    }

}

function getstatebracktes(state,filingstatus)
{  
    var taxrates=new Array();
    switch(state) {
        case "Alabama": taxrates=[2,4,5]; break;
        case "Alaska": taxrates=[0]; break;
        case "Arizona":  taxrates=[2.59,3.34,4.17,4.5]; break;
        case "Arkansas": taxrates=[2,4,5.9,6.6]; break;
        case "California": taxrates=[1,2,4,6,8,9.3,10.3,11.3,12.3,13.3]; break;
        case "Colorado": taxrates=[4.63]; break;
        case "Connecticut": taxrates=[3,5,5.5,6,6.5,6.9,6.99]; break;
        case "Delaware": taxrates=[0,2.2,3.9,4.8,5.2,5.55,6.6]; break;
        case "Florida": taxrates=[0]; break;
        case "Georgia": taxrates=[1,2,3,4,5,5.75]; break;
        case "Hawaii": taxrates=[1.4,3.2,5.5,6.4,6.8,7.2,7.6,7.9,8.25,9,10,11]; break;
        case "Idaho": taxrates=[1.13,3.13,3.63,4.63,5.63,6.63,6.93]; break;
        case "Illinois": taxrates=[4.95]; break;
        case "Indiana": taxrates=[3.23]; break;
        case "Iowa": taxrates=[.33,.67,2.25,4.14,5.63,5.96,6.25,7.44,8.53]; break;
        case "Kansas": taxrates=[3.1,5.25,5.7]; break;
        case "Kentucky": taxrates=[5]; break;
        case "Louisiana": taxrates=[2,4,6]; break;
        case "Maine": taxrates=[5.8,6.75,7.15]; break;
        case "Maryland": taxrates=[2,3,4,4.75,5,5.25,5.5,5.75]; break;
        case "Massachusetts": taxrates=[5]; break;
        case "Michigan": taxrates=[4.25]; break;
        case "Minnesota": taxrates=[5.35,6.8,7.85,9.85]; break;
        case "Mississippi": taxrates=[0,3,4,5]; break;
        case "Missouri": taxrates=[0,1.5,2,2.5,3,3.5,4,4.5,5,5.4]; break;
        case "Montana": taxrates=[1,2,3,4,5,6,6.9]; break;
        case "Nebraska": taxrates=[2.46,3.51,5.01,6.84]; break;
        case "Nevada": taxrates=[0]; break;
        case "New Hampshire": taxrates=[5]; break;
        case "New Jersey": if (filingstatus=="single") {
            taxrates=[1.4,1.75,3.5,5.53,6.37,8.97,10.75]; }
            else taxrates=[1.4,1.75,2.45,3.5,5.53,6.37,8.97,10.75]; break;
        case "New Mexico": taxrates=[1.7,3.2,4.7,4.9]; break;
        case "New York": if (filingstatus=="single") {
            taxrates=[4,4.5,5.25,5.9,6.21,6.49,6.85,8.82]; }
            else taxrates=[4,4.5,5.25,5.9,6.09,6.41,6.85,8.82]; break;
        case "North Carolina": taxrates=[5.25]; break;
        case "North Dakota": taxrates=[1.1,2.04,2.27,2.64,2.9]; break;
        case "Ohio": taxrates=[0,2.85,3.326,3.802,4.413,4.797]; break;
        case "Oklahoma": taxrates=[.5,1,2,3,4,5]; break;
        case "Oregon": taxrates=[5,7,9,9.9]; break;
        case "Pennsylvania": taxrates=[3.07]; break;
        case "Rhode Island": taxrates=[3.75,4.75,5.99]; break;
        case "South Carolina": taxrates=[0,3,4,5,6,7]; break;
        case "South Dakota": taxrates=[0]; break;
        case "Tennessee": taxrates=[1]; break;
        case "Texas": taxrates=[0]; break;
        case "Utah": taxrates=[4.95]; break;
        case "Vermont": taxrates=[3.35,6.6,7.6,8.75]; break;
        case "Virginia": taxrates=[2,3,5,5.75]; break;
        case "Washington": taxrates=[0]; break;
        case "West Virginia": taxrates=[3,4,4.5,6,6.5]; break;
        case "Wisconsin": taxrates=[4,5.21,6.27,7.65]; break;
        case "Wyoming": taxrates=[0]; break;
    }
    return taxrates;
}

function getstatetaxrates(state,filingstatus)
{
    var brackets=new Array();
    switch (state) {
        case "Alaska":
        case "Colorado":
        case "Florida":
        case "Illinois": 
        case "Indiana": 
        case "Kentucky":
        case "Massachusetts":
        case "Michigan":
        case "Nevada":
        case "New Hampshire":
        case "North Carolina":
        case "Pennsylvania": 
        case "South Dakota":
        case "Tennessee":
        case "Texas":
        case "Utah":
        case "Washington":
        case "Wyoming":
        {
            brackets=[]; break;
        }
        case "Alabama": if (filingstatus=="single") brackets=[500,3000]; else brackets=[1000,6000]; break;
        case "Arizona": if (filingstatus=="single") brackets=[26500,53000,159000]; else brackets=[53000,106000,318000]; break;
        case "Arkansas": brackets=[4000,8000,79300]; break;
        case "California": if (filingstatus=="single") {
            brackets=[8809,20883,32960,45753,57824,295373,354445,590742,1000000]; }
            else brackets=[17618,41766,65920,91506,115648,590746,708890,1000000,1181484]; break;
        case "Connecticut": if (filingstatus=="single") {
            brackets=[10000,50000,100000,200000,250000,500000]; }
            else brackets=[20000,100000,200000,400000,500000,1000000]; break;
        case "Delaware": brackets=[2000,5000,10000,20000,25000,60000]; break;
        case "Georgia": if (filingstatus=="single") {
            brackets=[750,2250,3750,5250,7000]; }
            else brackets=[1000,3000,5000,7000,10000]; break;
        case "Hawaii": if (filingstatus=="single") {
            brackets=[2400,4800,9600,14400,19200,24000,36000,48000,150000,175000,200000]; }
            else brackets=[4800,9600,19200,28800,38400,48000,72000,96000,300000,350000,400000]; break;
        case "Idaho": if (filingstatus=="single") {
            brackets=[1541,3081,4622,6162,7703,11554]; }
            else brackets=[3082,6162,9244,12324,15406,23108]; break;
        case "Iowa": brackets=[1638,3276,6552,14742,24570,32760,49140,73710]; break;
        case "Kansas": if (filingstatus=="single") {
            brackets=[15000,30000]; }
            else brackets=[30000,60000]; break;
        case "Louisiana": if (filingstatus=="single") {
            brackets=[12500,50000]; }
            else brackets=[25000,100000]; break;
        case "Maine": if (filingstatus=="single") {
            brackets=[22200,52600]; }
            else brackets=[44450,105200]; break;
        case "Maryland": if (filingstatus=="single") {
            brackets=[1000,2000,3000,100000,125000,150000,250000]; }
            else brackets=[1000,2000,3000,150000,175000,225000,300000]; break;
        case "Minnesota": if (filingstatus=="single") {
            brackets=[26960,88550,164400]; }
            else brackets=[39410,156570,273470]; break;
        case "Mississippi": brackets=[1000,5000,10000]; break;
        case "Missouri": brackets=[105,1053,2106,3159,4212,5265,6318,7371,8424]; break;
        case "Montana": brackets=[3100,5400,8200,11100,14300,18400]; break;
        case "Nebraska": if (filingstatus=="single") {
            brackets=[3230,19330,31160]; }
            else brackets=[6440,38680,62320]; break;
        case "New Jersey": if (filingstatus=="single") {
            brackets=[20000,35000,40000,75000,500000,5000000]; }
            else brackets=[20000,50000,70000,80000,150000,500000,5000000]; break;
        case "New Mexico": if (filingstatus=="single") {
            brackets=[5500,11000,16000]; }
            else brackets=[8000,16000,24000]; break;
        case "New York": if (filingstatus=="single") {
            brackets=[8500,11700,13900,21400,80650,215400,1077550]; }
            else brackets=[17150,23600,27900,43000,161550,323200,2155350]; break;
        case "North Dakota": if (filingstatus=="single") {
            brackets=[39450,95500,199250,433200]; }
            else brackets=[65900,159200,242550,433200]; break;
        case "Ohio": brackets=[21750,43450,86900,108700,217400]; break;
        case "Oklahoma": if (filingstatus=="single") {
            brackets=[1000,2500,3750,4900,7200]; }
            else brackets=[2000,5000,7500,9800,12200]; break;
        case "Oregon": if (filingstatus=="single") {
            brackets=[3550,8900,125000]; }
            else brackets=[7100,17800,250000]; break;
        case "Rhode Island": brackets=[65250,148350]; break;
        case "South Carolina": brackets=[3070,6150,9230,12310,15400]; break;
        case "Vermont": if (filingstatus=="single") {
            brackets=[39600,96000,200200]; }
            else brackets=[66150,159950,243750]; break;
        case "Virginia": brackets=[3000,5000,17000]; break;
        case "West Virginia": brackets=[10000,25000,40000,60000]; break;
        case "Wisconsin": if (filingstatus=="single") {
            brackets=[11970,23930,263480]; }
            else brackets=[15960,31910,351310]; break;
    }
    return brackets;
}