//----------------------------------------------------------------------------------
// ---------------------------------------LOAD DEFAULTS-----------------------------
function loadDef(flag) {
    $.getscript("FIRE_API.js",loadDef(flag));
}

function loadcode() {
    var fulldate=new Date();
    var year = fulldate.getUTCFullYear();
    //document.getElementById("currentdate").innerHTML=document.getElementById("currentdate").innerHTML+year;
}


// - CONTROL FUNCTIONS FOR INPUTS -
//
//FILING STATUS
function singleormarried(value) {
    if (value == "married") {
       //document.getElementById("income1").style = "display:table-cell; padding:3px;";
        //document.getElementById("income1i").style = "display:table-cell;text-align:right;";
        document.getElementById("income2").style = "display:table-cell; padding:3px;";
        document.getElementById("income2i").style = "display:table-cell;text-align:right;";
        document.getElementById("req2").style="display:table-cell; padding:3px"
        
    } else {
        //document.getElementById("income1").style = "display:display:table-cell; padding:3px;";
        //document.getElementById("income1i").style = "display:table-cell;text-align:right;";
        document.getElementById("income2").style = "display:none";
        document.getElementById("income2i").style = "display:none";
        document.getElementById("income2input").value="";
        document.getElementById("req2").style="display: none;";
        document.getElementById("req2dets").style="color: Red;";
        document.getElementById("req2dets").className="fa fa-dot-circle-o";
        sumwages()
    }
}
//
//GROSS WAGES
function sumwages() {
    var wage1=parseFloat(document.getElementById("income1input").value);
    var wage2=parseFloat(document.getElementById("income2input").value);
    var filingstatus=document.getElementById("filingstatus").value
    document.getElementById("taxerror").innerHTML=null

    //Calculate Gross Wage
    if (wage1>-1 && wage2>-1) {
        document.getElementById("incomePre").value = wage1+wage2;
    }
    else if (wage1>-1) {
        document.getElementById("incomePre").value = wage1;
    }
    else if (wage2>-1) {
        document.getElementById("incomePre").value = wage2;
    }
    else {
        document.getElementById("incomePre").value=""
    }
    //Format the Requirement Check
    if (wage1>-1) {
        document.getElementById("req1dets").className="fa fa-check-circle-o";
        document.getElementById("req1dets").style="color:Green";
    } else {
        document.getElementById("req1dets").className="fa fa-dot-circle-o";
        document.getElementById("req1dets").style="color:Red";
    }
    var wagetot=parseFloat(document.getElementById("incomePre").value)
    //Show/Hide Gross Wages
    if(wagetot>-1){
        console.log(document.getElementById("incomePre").value)
        document.getElementById("grossWageBox").style="visibility: visible;text-align:right;";
        document.getElementById("grossWageLabel").style="visibility: visible; padding:6px";
    } else {
        console.log(document.getElementById("incomePre").value)
        document.getElementById("grossWageBox").style="visibility: hidden;text-align:right;";
        document.getElementById("grossWageLabel").style="visibility: hidden";
    }

    if (filingstatus=="married") {
        if (wage2>-1) {
            document.getElementById("req2dets").className="fa fa-check-circle-o";
            document.getElementById("req2dets").style="color:Green";
        }
        else {
        document.getElementById("req2dets").className="fa fa-dot-circle-o";
        document.getElementById("req2dets").style="color:Red";
        }
    }   
}
//
//CALCULATE INCOME
function CalcIncome() {
    var modifiedincome,totaltax=0,statetotaltax=0,tax=0,grandtotaltax=0;
    var income=parseFloat(document.getElementById("incomePre").value)
    var individualincome;
    var filingstatus=document.getElementById("filingstatus").value;
    var retirement=parseFloat(document.getElementById("ira").value);  if (!retirement) retirement=0;
    var ltaxrates=[],lbrackets=[],state,rate,val,temp,errflag,display,i,rates;
    var taxyear=document.getElementById("Taxyear").value;
    if(taxyear===null) { taxyear="2023" }
    const dollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    let brackets = {
        singlebrackets2022:[0,10275,41775,89075,170050,215950,539900],  //use data
        marriedbrackets2022:[0,20550,83550,178150,340100,431900,647850],  //use data
        singlebrackets2023:[0,11000,44725,95375,182100,231250,578125],  //use data
        marriedbrackets2023:[0,22000,89450,190750,364200,462500,693750],  //use data
        taxrates:[0,.1,.12,.22,.24,.32,.35,.37],
        data : function(mode) {
            if (mode=="single") {
                if(taxyear==="2022") {return this.singlebrackets2022;}
                if(taxyear==="2023") {return this.singlebrackets2023;}
            }
            else {
                if(taxyear==="2022") {return this.marriedbrackets2022;}
                if(taxyear==="2023") {return this.marriedbrackets2023;}
                
            }
        },
        deduction : function(mode) {
            if (mode=="single") {
                if(taxyear==="2022") {return 12950;}
                if(taxyear==="2023") {return 13850;}
            }
            else { 
                if(taxyear==="2022") {return 25900;}
                if(taxyear==="2023") {return 27700;}
            }
        }
    };
    let statebrackets = {
        taxrates : function(state,filingstatus) {
            rates=getstatetaxrates(state,filingstatus,taxyear);
            return rates;       
        },
        brackets : function(state,filingstatus) {
            var brackets=[];
            brackets=getstatebrackets(state,filingstatus,taxyear);
            return brackets;
        }
        
    }
    document.getElementById("taxerror").innerHTML=null;
    //
    //ERROR CHECKS
    if (!(income>0)){
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="Please Input a Gross Income to Calculate Taxes";
        document.getElementById("incomePre").value=""
    } else if(filingstatus=="single" && retirement>22500) {
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="You cannot contribute more than $22,500 per year as a single filer.";
    } else if(filingstatus=="married" && retirement>45000) {
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="You cannot contribute more than $45,000 per year filing jointly";
    }
    if(filingstatus=="married" && (!document.getElementById("income1input").value || !document.getElementById("income2input").value)) {
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="Please enter an income for both income earners, if only one person has an income, input a 0 for the other.";
    }




    //BEGIN------------------------------------------------------------------------------
    if (!errflag)
    {
        //0.  SET the Top Elements:  Adjusted Gross Income (AGI): [Amount]
        //                           Federal Income Tax | State Income Tax
        //
        //                           Payroll Tax (Social Security + Medicare/aide)
        document.getElementById("bottomTable").style="background-color:bisque; border:2px solid; padding:10px"
        document.getElementById("underline").style.display="";
        document.getElementById("underline2").style.display="";
        state=document.getElementById("state").value;
        document.getElementById("taxhead1").innerHTML="State Income Tax - "+state;
        document.getElementById("payrolltaxhead").innerHTML="Payroll Tax (Social Security + Medicare/aide)";
        document.getElementById("taxhead2").innerHTML="Federal Income Tax";

        //1.  Gross Income & Adjusted
        //
        modifiedincome=Math.max(income-brackets.deduction(filingstatus)-retirement,0);  //AGI
        document.getElementById("gross income").innerHTML="Gross Income: "+dollar.format(income)
        document.getElementById("agi").innerHTML="Adjusted Gross Income (AGI): "+dollar.format(modifiedincome)
        document.getElementById("agi?").innerHTML=" <i class=\"fa fa-question-circle\"></i>";
        document.getElementById("agitext").innerHTML="Adjusted Gross Income is what we actually compute your taxes off of after deducting the below from your income.  It starts with your Gross Income of "+dollar.format(income)+" and reduces it by the amounts listed in the table below."
        var taxtable = new Array();
        taxtable.push(["Deduction","Income Reduction"]);  //Set Row Headers
        taxtable.push(["Standard deduction for "+filingstatus+" filers.",dollar.format(brackets.deduction(filingstatus))]);
        taxtable.push(["Retirement Deduction (401k/IRA/403B)",dollar.format(retirement)]);
        makeTable(taxtable,['400px','200px'],'agibox',"","","0");

        //2.  Popup for State Income Tax
        //
        taxtable = [];
        document.getElementById("stateagi").innerHTML="Computed off AGI: "+dollar.format(modifiedincome);
        document.getElementById("stateagi").style.fontSize="14px";
        taxtable.push(["Income Bracket","Your Tax"]);  //Set Row Headers
        ltaxrates=statebrackets.taxrates(state,filingstatus);  //Grab Taxrates for state
        lbrackets=statebrackets.brackets(state,filingstatus);  //Grab brackets for state
        for (i=0;i<ltaxrates.length;i++) {
            rate=ltaxrates[i];
            if (rate || i==0) {
                val=lbrackets[i];
                if (!val&&val!=0) { val="and up"; lbrackets[i]=99999999999} else val=dollar.format(val);
                if (i==0)
                {
                    tax=Math.min(modifiedincome,lbrackets[i])*(rate/100);
                    if (val=="and up") {
                        if (rate==0) temp="&nbsp&nbsp • "+state+" has no income tax";
                        else temp="&nbsp&nbsp • "+state+" has a flat "+rate+"% on all income";
                    }
                    else temp="&nbsp&nbsp • [$0 - "+val+"] - Taxed @ "+rate+"%";
                }
                else{
                    tax=Math.min(Math.max(modifiedincome-lbrackets[i-1],0),lbrackets[i]-lbrackets[i-1])*(rate/100);
                    temp="&nbsp&nbsp • ["+dollar.format(lbrackets[i-1])+" - "+val+"] - Taxed @ "+rate+"%";
                }
                statetotaltax=statetotaltax+tax;
                taxtable.push([temp,dollar.format(tax)]);
            }
        }
        makeTable(taxtable,['400px','200px'],'statetaxbox',"","","0");
        grandtotaltax=grandtotaltax+statetotaltax;
        document.getElementById("statetax").innerHTML=dollar.format(statetotaltax);
        document.getElementById("statetax?").innerHTML=" <i class=\"fa fa-question-circle\"></i>";
        val=modifiedincome;
        //modifiedincome=modifiedincome-statetotaltax;  //No Longer Relevant - SALT Deduction requires itemization.
        
        //3.  Popup for Federal Income Tax
        //
        document.getElementById("fedagi").innerHTML="Federal AGI: "+dollar.format(modifiedincome);
        document.getElementById("fedagi").style.fontSize="14px";
        taxtable=[];  //clear the array
        lbrackets=brackets.data(filingstatus);
        taxtable.push(["Income Bracket","Your Tax"]);
        
        for (i=0;i<7;i++) {
            display="- "+dollar.format(lbrackets[i+1]);
            if (!lbrackets[i+1]) {
                lbrackets[i+1]=999999999999;
                display="and up"
            }
            //calculate tax in each bracket
            tax=Math.min(Math.max(modifiedincome-lbrackets[i],0),lbrackets[i+1]-lbrackets[i])*brackets.taxrates[i+1];
            //keep track of the total tax
            totaltax=totaltax+tax;
            //show the tax bracket amount
            val=("&nbsp&nbsp • "+("["+dollar.format(lbrackets[i])+" "+display+"] - Taxed @ "+brackets.taxrates[i+1]*100)+"%");
            taxtable.push([val,dollar.format(tax)]);
        }
        grandtotaltax=grandtotaltax+totaltax;
        document.getElementById("fedtax").innerHTML=dollar.format(totaltax)
        document.getElementById("fedtax?").innerHTML=" <i class=\"fa fa-question-circle\"></i>";
        document.getElementById("fedtax").style.fontWeight="";
        document.getElementById("fedtax").style.textJustify="";
        makeTable(taxtable,['400px','200px'],'fedtaxbox',"","","0");
        

        //4.  Payroll Tax
        //
        taxtable=[];
        totaltax=0;
        taxtable.push(["Tax Type","Your Tax"]);
        if (filingstatus=="single") {
            tax=Math.min(income,147000)*.062;
            totaltax=tax;
            tax=dollar.format(tax);
            if(tax==="$9,114") {taxtable.push(["• <B>Social Security</B> (6.2% of the $147,000 income cap)",tax])}
            else {taxtable.push(["• <B>Social Security</B> (6.2% of "+dollar.format(income)+" of income)",tax])}
            tax=income*.0145;
            if(income<200000) {
                taxtable.push(["• <B>Medicare</B> (1.45% of "+dollar.format(income)+" of income)",dollar.format(tax)]);
                totaltax=totaltax+tax;
            }
            else {
                taxtable.push(["• <B>Medicare</B> (1.45% of "+dollar.format(income)+" of income)",dollar.format(tax)]);
                totaltax=totaltax+tax;
                tax=income*.009;
                taxtable.push(["• <B>Additional Medicare</B> (0.9% of "+dollar.format(income)+" of income)",dollar.format(tax)]);
                totaltax=totaltax+tax;
            }
            
        } 
        else {
            for (i=1;i<3;i++) {
                individualincome=parseFloat(document.getElementById("income"+i+"input").value)
                if (income>0) { tax=Math.min(individualincome,147000)*0.062; totaltax=totaltax+tax; tax=dollar.format(tax); } else { tax="Error, Please enter an income for Person "+i; }
                //taxtable.push(["• Social Security for Person "+i,tax]);
                if(tax==="$9,114") {taxtable.push(["• Person "+i+" <B>Social Security</B> (6.2% of the $147,000 income cap)",tax])}
                else {taxtable.push(["• Person "+i+" <B>Social Security</B> (6.2% of "+dollar.format(individualincome)+" of income)",tax])}
            }
            tax=individualincome*.0145;
            tax=tax+(Math.max(individualincome-250000,0)*.009);
            taxtable.push(["Medicare (1.45%, + 0.9% on income over $250,000)",dollar.format(tax)]);
            totaltax=totaltax+tax;
        }
        //final save
        grandtotaltax=grandtotaltax+totaltax;
        document.getElementById("payrolltax").innerHTML=dollar.format(totaltax)
        document.getElementById("payrolltax?").innerHTML=" <i class=\"fa fa-question-circle\"></i>";
        makeTable(taxtable,['400px','200px'],'payrolltaxbox',"","","0","small");


        //5.  Grand Total Tax & Final Income
        document.getElementById("totaltaxhead").innerHTML="Total Tax"
        document.getElementById("totaltaxhead").style.fontSize="20px";
        document.getElementById("totaltax").innerHTML=dollar.format(grandtotaltax);
        document.getElementById("totaltax").style.fontSize="20px";
        document.getElementById("netincomehead").innerHTML="Total Net Income"
        document.getElementById("netincomehead").style.fontSize="20px";
        console.log("income: "+parseFloat(document.getElementById("incomePre").value));
        console.log("grandtotaltax: "+grandtotaltax);
        document.getElementById("netincome").innerHTML=dollar.format(parseFloat(document.getElementById("incomePre").value)-grandtotaltax);
        document.getElementById("netincome").style.fontSize="20px";
        //document.getElementById("netincomeinput").value=(income-grandtotaltax).toFixed(2);
        //val=document.getElementById("spending").value;
        //if (val>0) {
        //    document.getElementById("savedtotal").value=((income-grandtotaltax).toFixed(2)-val).toFixed(2);
        //}

    }
}







function getUSDPrice(obj) {
    return obj.bpi.USD.rate_float;
  }

//


function CalcSaved(value,source) {
    var tempval,tempval2;
    if (value==null) { document.getElementById("savedtotal").value=null;}
    if (source==2) { //Inputting Spending
        tempval=parseFloat(document.getElementById("netincomeinput").value);  //income
        tempval2=parseFloat(document.getElementById("retirementincome").value)  //retirement
        if (tempval>0){ document.getElementById("savedtotal").value = ((tempval + tempval2) -value).toFixed(2); }
    }
    else if (source==1) { //Inputting Income
        tempval=parseFloat(document.getElementById("spending").value);  //spending
        tempval2=parseFloat(document.getElementById("retirementincome").value)  //retirement
        if (tempval>0) { document.getElementById("savedtotal").value= ((value + tempval2) -tempval).toFixed(2); }
    }
    else if (source==3) { //Inputting Retirement
        tempval=parseFloat(document.getElementById("spending").value);  //spending
        tempval2=parseFloat(document.getElementById("netincomeinput").value)  //income
        if (tempval>0) { document.getElementById("savedtotal").value= ((tempval2 + parseFloat(value)) -tempval).toFixed(2); }
    } else if (source="") {
        console.log("inside")
        tempval=parseFloat(document.getElementById("spending").value);  //spending
        tempval2=parseFloat(document.getElementById("netincomeinput").value)  //income
        if (tempval>0 && tempval2>0) { 
            document.getElementById("savedtotal").value=((tempval2 + parseFloat(document.getElementById("retirementincome").value)) -tempval).toFixed(2); 
        }
    }
}

function CalcGoal(value,source) {
    //source=1 is Current Annual Spending
    if (value!=0) {
        if (!(document.getElementById("Goal").value>0)) {
            document.getElementById("Goal").value=value*25;
        }
        if (!(document.getElementById("spendingretire").value>0) && source==1) {
            document.getElementById("spendingretire").value=value;
        }
    }
    
}

function copyfield(value,destination) {
    if (value>0) {
        document.getElementById(destination).value=value;
    }
}

//


function getNonZeroRandomNumber(){
    var random = Math.floor(Math.random()*3999) - 2000;
    if(random==0) return 1;
    return random/100;
}

function getstatebrackets(state,filingstatus,taxyear)
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
        case "Arizona": if (filingstatus=="single") brackets=[27808,55615,166843]; else brackets=[55615,111229,333684]; break;
        case "Arkansas": brackets=[4300,8500]; break;
        case "California": if (filingstatus=="single") {
            brackets=[9325,22107,34892,48435,61214,312686,375221,625369,1000000]; }
            else brackets=[18650,44214,69784,96870,122428,625372,750442,1000000,1250738]; break;
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
            brackets=[1588,4763,7939]; }
            else brackets=[3176,9526,15878]; break;
        case "Iowa": brackets=[1743,3486,6972,15687,26145,34860,52290,78435]; break;
        case "Kansas": if (filingstatus=="single") {
            brackets=[15000,30000]; }
            else brackets=[30000,60000]; break;
        case "Louisiana": if (filingstatus=="single") {
            brackets=[12500,50000]; }
            else brackets=[25000,100000]; break;
        case "Maine": if (filingstatus=="single") {
            brackets=[23000,54450]; }
            else brackets=[46000,108900]; break;
        case "Maryland": if (filingstatus=="single") {
            brackets=[1000,2000,3000,100000,125000,150000,250000]; }
            else brackets=[1000,2000,3000,150000,175000,225000,300000]; break;
        case "Minnesota": if (filingstatus=="single") {
            brackets=[28080,92230,171220]; }
            else brackets=[41050,163060,284810]; break;
        case "Mississippi": brackets=[5000,10000]; break;
        case "Missouri": brackets=[108,1088,2176,3264,4352,5440,6528,7616,8704]; break;
        case "Montana": brackets=[3100,5500,8400,11400,14600,18800]; break;
        case "Nebraska": if (filingstatus=="single") {
            brackets=[3440,20590,33180]; }
            else brackets=[6860,41190,66360]; break;
        case "New Jersey": if (filingstatus=="single") {
            brackets=[20000,35000,40000,75000,500000,1000000]; }
            else brackets=[20000,50000,70000,80000,150000,500000,1000000]; break;
        case "New Mexico": if (filingstatus=="single") {
            brackets=[5500,11000,16000,210000]; }
            else brackets=[8000,16000,24000,315000]; break;
        case "New York": if (filingstatus=="single") {
            brackets=[8500,11700,13900,80650,215400,1077550,5000000,25000000]; }
            else brackets=[17150,23600,27900,161550,323200,2155350,5000000,25000000]; break;
        case "North Dakota": if (filingstatus=="single") {
            brackets=[40525,98100,204675,445000]; }
            else brackets=[67700,163550,249150,445000]; break;
        case "Ohio": brackets=[25000,44250,88450,110650]; break;
        case "Oklahoma": if (filingstatus=="single") {
            brackets=[1000,2500,3750,4900,7200]; }
            else brackets=[2000,5000,7500,9800,12200]; break;
        case "Oregon": if (filingstatus=="single") {
            brackets=[3650,9200,125000]; }
            else brackets=[7300,18400,250000]; break;
        case "Rhode Island": brackets=[68200,155050]; break;
        case "South Carolina": brackets=[3200,6410,9620,12820,16040]; break;
        case "Vermont": if (filingstatus=="single") {
            brackets=[40950,99200,206950]; }
            else brackets=[68400,165350,251950]; break;
        case "Virginia": brackets=[3000,5000,17000]; break;
        case "West Virginia": brackets=[10000,25000,40000,60000]; break;
        case "Wisconsin": if (filingstatus=="single") {
            brackets=[12760,25520,280950]; }
            else brackets=[17010,34030,374600]; break;
        case "Washington DC": brackets=[10000,40000,60000,250000,500000,1000000]; break;
    }
    return brackets;
}
function getstatetaxrates(state,filingstatus,taxyear)
{  
    var taxrates=new Array();
    switch(state) {
        case "Alabama": taxrates=[2,4,5]; break;  //OK
        case "Alaska": taxrates=[0]; break;  //OK
        case "Arizona":  taxrates=[2.59,3.34,4.17,4.5]; break;  //OK
        case "Arkansas": taxrates=[2,4,5.5]; break;  //OK
        case "California": taxrates=[1,2,4,6,8,9.3,10.3,11.3,12.3,13.3]; break;  //OK
        case "Colorado": taxrates=[4.55]; break;  //OK
        case "Connecticut": taxrates=[3,5,5.5,6,6.5,6.9,6.99]; break;  //OK
        case "Delaware": taxrates=[0,2.2,3.9,4.8,5.2,5.55,6.6]; break;  //OK
        case "Florida": taxrates=[0]; break;  //OK
        case "Georgia": taxrates=[1,2,3,4,5,5.75]; break;  //OK
        case "Hawaii": taxrates=[1.4,3.2,5.5,6.4,6.8,7.2,7.6,7.9,8.25,9,10,11]; break;  //OK
        case "Idaho": taxrates=[1,3,4.5,6]; break;    //OK
        case "Illinois": taxrates=[4.95]; break;  //OK
        case "Indiana": if(taxyear=="2022") {taxrates=[3.23];} if(taxyear=="2023") {taxrates=[3.15];} break;  //OK
        case "Iowa": taxrates=[.33,.67,2.25,4.14,5.63,5.96,6.25,7.44,8.53]; break;  //OK
        case "Kansas": taxrates=[3.1,5.25,5.7]; break;  //OK
        case "Kentucky": taxrates=[5]; break;  //OK
        case "Louisiana": taxrates=[1.85,3.5,4.25]; break;  //OK
        case "Maine": taxrates=[5.8,6.75,7.15]; break;  //OK
        case "Maryland": taxrates=[2,3,4,4.75,5,5.25,5.5,5.75]; break;  //OK
        case "Massachusetts": taxrates=[5]; break;  //OK
        case "Michigan": taxrates=[4.25]; break;  //OK
        case "Minnesota": taxrates=[5.35,6.8,7.85,9.85]; break;  //OK
        case "Mississippi": taxrates=[0,4,5]; break;  //OK
        case "Missouri": taxrates=[0,1.5,2,2.5,3,3.5,4,4.5,5,5.4]; break;  //OK
        case "Montana": taxrates=[1,2,3,4,5,6,6.75]; break;  //OK
        case "Nebraska": taxrates=[2.46,3.51,5.01,6.84]; break;  //OK
        case "Nevada": taxrates=[0]; break;  //OK
        case "New Hampshire": taxrates=[0]; break;  // NEEDS UPDATE 5% on interest and dividends only
        case "New Jersey": if (filingstatus=="single") {  //OK
            taxrates=[1.4,1.75,3.5,5.525,6.37,8.97,10.75]; }
            else taxrates=[1.4,1.75,2.45,3.5,5.525,6.37,8.97,10.75]; break;
        case "New Mexico": taxrates=[1.7,3.2,4.7,4.9,5.9]; break;  //OK
        case "New York": taxrates=[4,4.5,5.25,5.85,6.25,6.85,9.65,10.3,10.9]; break;  //OK
        case "North Carolina": taxrates=[4.99]; break;  //OK
        case "North Dakota": taxrates=[1.1,2.04,2.27,2.64,2.9]; break;  //OK
        case "Ohio": taxrates=[0,2.765,3.226,3.688,3.990]; break;  //OK
        case "Oklahoma": taxrates=[.25,.75,1.75,2.75,3.75,4.75]; break;  //OK
        case "Oregon": taxrates=[4.75,6.75,8.75,9.9]; break;  //OK
        case "Pennsylvania": taxrates=[3.07]; break;  //OK
        case "Rhode Island": taxrates=[3.75,4.75,5.99]; break;  //OK
        case "South Carolina": taxrates=[0,3,4,5,6,7]; break;  //OK
        case "South Dakota": taxrates=[0]; break;  //OK
        case "Tennessee": taxrates=[0]; break;  //OK
        case "Texas": taxrates=[0]; break;  //OK
        case "Utah": taxrates=[4.95]; break;  //OK
        case "Vermont": taxrates=[3.35,6.6,7.6,8.75]; break;
        case "Virginia": taxrates=[2,3,5,5.75]; break;
        case "Washington": taxrates=[0]; break;  //NEEDS UPDATE 7% on CAP GAINZ
        case "West Virginia": taxrates=[3,4,4.5,6,6.5]; break;  
        case "Wisconsin": taxrates=[3.54,4.65,5.3,7.65]; break;
        case "Wyoming": taxrates=[0]; break;
        case "Washington DC": taxrates=[4,6,6.5,8.5,9.25,9.75,10.75]; break;
    }
    return taxrates;
}
//FUNCTION:     makeTable
//DESCRIPTION:  Makes a Table
//PARAMETERS:
//              dataary (I,REQ) - The Data Array, 2 dimensional
//              widthary (I,REQ) - array of widths for each column in dataary
//              element (I,REQ) - the name of the data element we're gonna store the table
//              boldcolumn (I,OPT) - the Column number we're going to check for a data value
//              boldvalue (I,OPT) - the Value in the "boldcolumn" we're going to bold the row for if found.
function makeTable(dataary,widthary,element,boldcolumn,boldvalue,border,fontsize){
    var i,j,val,str;
    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    if (border!=null) {
        table.border=border;
    } else {
        table.border = "1";
    }
    //Get the count of columns.
    var columnCount = dataary[0].length;
    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = dataary[0][i];
        row.appendChild(headerCell);
        if (element=="dvTable"){
            if (i==1 || i==5) {
                headerCell.style.borderRight="solid black"
            }
        }
    }
    //Add the data rows.
    for (var i = 1; i < dataary.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            
            val = dataary[i][j];
            cell.innerHTML = val;
            if (fontsize!==null) {cell.style.fontSize=fontsize}

            //Make Negatives Red
            str=String(val);
            if (str.charAt(0)=="-") {
                cell.style.color="Red";
            } else if (j==2 || j==4 || j==5 || j==7) {  //& Positive non-zero's Green
                if (!(str.charAt(1)=='0')){
                    cell.style.color="Green";
                }
            }

            if (dataary[i][boldcolumn]==boldvalue && boldcolumn) {
                cell.style.fontWeight="bold";
                cell.style.backgroundColor="Yellow"
            }
            cell.style.width = widthary[j];
            

            //Custom Formatting just for the FIRE Table
            if (element=="dvTable"){
                if (j==1 || j==5) {
                    cell.style.borderRight="solid black"
                }
                if (j==6){
                    cell.style.fontWeight="bold"
                    cell.style.fontSize="18px"
                }
                if (j==7) {
                    cell.style.fontWeight="italics"
                    cell.style.fontSize="12px"
                }
            }
        }
    }
    var dvTable = document.getElementById(element);
    dvTable.innerHTML = "";
    dvTable.appendChild(table);

}









