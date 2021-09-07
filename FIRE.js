//----------------------------------------------------------------------------------
// ---------------------------------------LOAD DEFAULTS-----------------------------
function loadDef(flag) {
    $.getscript("FIRE_API.js",loadDef(flag));
}

function loadcode() {
    var fulldate=new Date();
    var year = fulldate.getUTCFullYear();
    document.getElementById("currentdate").innerHTML=document.getElementById("currentdate").innerHTML+year;
}






//----------------------------------------------------------------------------------
// ---------------------------------------CALCULATE INCOME--------------------------
function CalcIncome() {
    var modifiedincome,totaltax=0,statetotaltax=0,tax=0,grandtotaltax=0;
    var income=parseFloat(document.getElementById("incomePre").value)
    var individualincome;
    var filingstatus=document.getElementById("filingstatus").value;
    var retirement=parseFloat(document.getElementById("ira").value);  if (!retirement) retirement=0;
    var ltaxrates=[],lbrackets=[],state,rate,val,temp,errflag,display,i,rates;
    const dollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    let brackets = {
        singlebrackets:[0,9875,40125,85525,163300,207350,518400],  //use data
        marriedbrackets:[0,9950,40525,86375,164925,209425,523600],  //use data
        taxrates:[0,.1,.12,.22,.24,.32,.35,.37],
        data : function(mode) {
            if (mode=="single") {
                return this.singlebrackets;
            }
            else {
                return this.marriedbrackets;
            }
        },
        deduction : function(mode) {
            if (mode=="single") {
                return 12400;
            }
            else return 24800;
        }
    };
    let statebrackets = {
        taxrates : function(state,filingstatus) {
            rates=getstatebracktes(state,filingstatus);
            return rates;       
        },
        brackets : function(state,filingstatus) {
            var brackets=[];
            brackets=getstatetaxrates(state,filingstatus);
            return brackets;
        }
        
    }
    //START ---------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    document.getElementById("taxerror").innerHTML=null;
    
    //ERROR CHECKS-----------------------------------------------------------------------
    if (!(income>0)){
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="Please Input a Gross Income to Calculate Taxes";
        document.getElementById("incomePre").value=""
    } else if(filingstatus=="single" && retirement>19500) {
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="You cannot contribute more than $19,500 per year as a single filer";
    } else if(filingstatus=="married" && retirement>39000) {
        errflag=1;
        loadDef(2);
        document.getElementById("taxerror").innerHTML="You cannot contribute more than $39,000 per year as a single filer";
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
        document.getElementById("underline").style.display="";
        document.getElementById("underline2").style.display="";
        state=document.getElementById("state").value;
        document.getElementById("taxhead1").innerHTML="State Income Tax - "+state;
        document.getElementById("payrolltaxhead").innerHTML="Payroll Tax (Social Security + Medicare/aide)";
        document.getElementById("taxhead2").innerHTML="Federal Income Tax";
        

        //1.  Adjust Gross Income
        //
        modifiedincome=Math.max(income-brackets.deduction(filingstatus)-retirement,0);  //AGI
        document.getElementById("agi").innerHTML="Adjusted Gross Income (AGI): "+dollar.format(modifiedincome)+" <i class=\"fa fa-question-circle\"></i>";
        var taxtable = new Array();
        taxtable.push(["Deduction","Amount Income Reduced"]);  //Set Row Headers
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
                        else temp="&nbsp&nbsp • "+state+" has a flat "+rate+"%";
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
        document.getElementById("statetax").innerHTML=dollar.format(statetotaltax)+" "+"<i class=\"fa fa-question-circle\"></i>";
        val=modifiedincome;
        modifiedincome=modifiedincome-statetotaltax;
        document.getElementById("fedagi").innerHTML="Federal AGI: "+dollar.format(modifiedincome)+"<BR> &nbsp&nbsp • Computed from AGI ("+dollar.format(val)+") - State Income Tax ("+dollar.format(statetotaltax)+").";
        document.getElementById("fedagi").style.fontSize="14px";

        
        //3.  Popup for Federal Income Tax
        //
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
        document.getElementById("fedtax").innerHTML=dollar.format(totaltax)+" "+"<i class=\"fa fa-question-circle\"></i>";
        document.getElementById("fedtax").style.fontWeight="";
        document.getElementById("fedtax").style.textJustify="";
        makeTable(taxtable,['400px','200px'],'fedtaxbox',"","","0");
        

        //4.  Payroll Tax
        //
        taxtable=[];
        totaltax=0;
        taxtable.push(["Tax Type","Your Tax"]);
        if (filingstatus=="single") {
            tax=Math.min(income,137700)*.062;
            totaltax=tax;
            taxtable.push(["Social Security (6.2% capped at $137,700)",dollar.format(tax)]);
            tax=income*.0145;
            tax=tax+(Math.max(income-200000,0)*.009);
            taxtable.push(["Medicare (1.45%, + 0.9% on income over $200,000)",dollar.format(tax)]);
            totaltax=totaltax+tax;
        } 
        else {
            for (i=1;i<3;i++) {
                individualincome=parseFloat(document.getElementById("income"+i+"input").value)
                if (income>0) { tax=Math.min(individualincome,137700)*0.062; totaltax=totaltax+tax; tax=dollar.format(tax); } else { tax="Error, Please enter an income for wage earner "+i; }
                taxtable.push(["Social Security for Wage Earner "+i,tax]);
            }
            tax=individualincome*.0145;
            tax=tax+(Math.max(individualincome-250000,0)*.009);
            taxtable.push(["Medicare (1.45%, + 0.9% on income over $250,000)",dollar.format(tax)]);
            totaltax=totaltax+tax;
        }
        //final save
        grandtotaltax=grandtotaltax+totaltax;
        document.getElementById("payrolltax").innerHTML=dollar.format(totaltax)+" "+"<i class=\"fa fa-question-circle\"></i>";
        makeTable(taxtable,['400px','200px'],'payrolltaxbox',"","","0");


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
        document.getElementById("netincomeinput").value=(income-grandtotaltax).toFixed(2);
        val=document.getElementById("spending").value;
        if (val>0) {
            document.getElementById("savedtotal").value=((income-grandtotaltax).toFixed(2)-val).toFixed(2);
        }

    }
}








//----------------------------------------------------------------------------------
// ---------------------------------------fireMain ---------------------------------

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function fireMain(price) {
    var wealth=parseInt(document.getElementById("curwealth").value);
    var originincome=parseInt(document.getElementById("netincomeinput").value),income=originincome;
    var spending=parseInt(document.getElementById("spending").value);
    var phatlewtz=new Array(),widthary=new Array();
    var i=0,j=0,quitflag=0,err=0,lastyear,notes,thisyear,retyr,val,interest
    var apy=parseFloat(document.getElementById("Interest").value);
    var target=document.getElementById("Goal").value;
    var fulldate=new Date(),savings,changeforyear;
    var year = fulldate.getUTCFullYear();
    var expenses = parseFloat(document.getElementById("spending").value);
    var col1,col2,col3,col4,col5,col6,col7,col8,col9
    var requiredgains,final,rand,requiredgainstax;
    const dollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    const btc = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BTC',
        minimumFractionDigits: 8
    });

    //Error Checking.
    if(!originincome || !spending || (!wealth && wealth!=0 || !target)) {
        document.getElementById("Warning").innerHTML = "Please Input all FIRE Input Fields";
        document.getElementById("target").innerHTML="";
        document.getElementById("yrs2ret").innerHTML="";
        err=1;
        //dvTable.appendChild(table);
    }
    else {
        lastyear=wealth;
        for (i = 1; i < 100 ;i++)
        {
            thisyear=lastyear * (1+(apy/100)) + income;
            if (spending*25 < thisyear) retyr=i;
            lastyear=thisyear
        }
        if (!retyr) {
            err=1;
            document.getElementById("target").innerHTML="Target Amount Needed for Retirement: " + dollar.format(target);
            document.getElementById("yrs2ret").innerHTML="Years to retirement: [>100, please try different inputs]";
        }
        
    }

    if (err==1){
        var table=""
        var dvTable = document.getElementById("dvTable");
        dvTable.innerHTML = "";
    }
    //Main Program
    if (err!=1) {
        notes="";
        document.getElementById("Warning").innerHTML="";
        var i=1;
        document.getElementById("target").innerHTML="Target Amount Needed for Retirement: " + dollar.format(target)
        //Headers
        phatlewtz.push(["Year", "$ Amount Year Start","+ Earned Income","- (Expenses)","Tax on Req. Realized Gains (0.05%)","+ Investment Income","$ Year End","Change","Notes"]);

        //SEED
        thisyear=wealth;
        lastyear=wealth;
        interest=0;
        income=originincome;
        expenses=expenses/-1.02;
        do {
            if(err==1) quitflag=1;
            if (j==1) income=0;  //FIRST YEAR OF RETIREMENT

            col1=(year-1+i);  //YEAR
            
            expenses=expenses*1.02;
            savings=income+expenses;
            
            
            requiredgains = Math.abs(Math.min(savings,0)); 
            
            //REPLACE THIS WITH ACTUAL TAX BRACKETS
            if (requiredgains!=0)
            {
                requiredgainstax=requiredgains*(-.05);
            } else {requiredgainstax=0;}

            savings=income+expenses+requiredgainstax;
            //rand=getNonZeroRandomNumber(apy);
            console.log("rand: "+rand)
            //final=(apy+rand).toFixed(2);
            final=7;
            interest=lastyear * (final/100);
            thisyear=lastyear + savings + interest;
            changeforyear=savings+interest;

            if (thisyear>target) {
                notes=""
                if (j==0) {
                    notes="<-- Retirement Year Reached!";
                    retyr=i;
                    //expenses=document.getElementById("spendingretire").value*-1*Math.pow(1.02,i-1);
                } else if (j==1) { 
                    expenses=document.getElementById("spendingretire").value*-1*Math.pow(1.02,i-1); 
                }
                j++;
                if (j>50) {quitflag=1}
            }
            col1=(year-1+i);  // YEAR
            col2=dollar.format(lastyear);  // $ Amount Year Start
            col3=dollar.format(income);  // + Earned Income
            col4=dollar.format(expenses);  // - (Expenses)
            col5=dollar.format(requiredgainstax);  // Realized Gains Required
            col6=dollar.format(interest)+" ("+final+"%)";  // + Investment Income
            col7=dollar.format(thisyear);  // $ Year End
            col8=dollar.format(changeforyear);  // Net Position
            col9=notes;  // Notes
            if(!price) {
                phatlewtz.push([col1,col2,col3,col4,col5,col6,col7,col8,col9]);
            }
            else {
                phatlewtz.push([(year-1+i),btc.format(lastyear/price),btc.format(interest/price),btc.format(income/price),btc.format(thisyear/price),notes]);
            }

            i++;
            //on to next year
            lastyear=thisyear
            if (i>1000) {quitflag=1;} //force quit
        }
        while (quitflag==0);
       document.getElementById("yrs2ret").innerHTML ="Years to retirement: " + retyr;
       widthary=['60px','120px','120px','120px','120px','220px','120px','120px'];
       makeTable(phatlewtz,widthary,'dvTable',8,"<-- Retirement Year Reached!");
    }
    

}

//FUNCTION:     makeTable
//DESCRIPTION:  Makes a Table
//PARAMETERS:
//              dataary (I,REQ) - The Data Array, 2 dimensional
//              widthary (I,REQ) - array of widths for each column in dataary
//              element (I,REQ) - the name of the data element we're gonna store the table
//              boldcolumn (I,OPT) - the Column number we're going to check for a data value
//              boldvalue (I,OPT) - the Value in the "boldcolumn" we're going to bold the row for if found.
function makeTable(dataary,widthary,element,boldcolumn,boldvalue,border){
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




//----------------------------------------------------------------------------------
// ---------------------------------------Preload for BCT Table---------------------
function Preload() {
    var price=null;
    return $.get( "https://api.coindesk.com/v1/bpi/currentprice.json").then(function(data){
        var obj = JSON.parse(data);
        price=getUSDPrice(obj);
        fireMain(price);
    });
}
function getUSDPrice(obj) {
    return obj.bpi.USD.rate_float;
  }

//
function yesnoCheck(value) {
    if (value == "married") {
        document.getElementById("income1").style.display = "block";
        document.getElementById("income1input").style.display = "block";
        document.getElementById("income2").style.display = "block";
        document.getElementById("income2input").style.display = "block";
        document.getElementById("income12blank").style.display = "block";
        
    } else {
        document.getElementById("income1").style.display = "block";
        document.getElementById("income1input").style.display = "block";
        document.getElementById("income2").style.display = "none";
        document.getElementById("income2input").style.display = "none";
        document.getElementById("income12blank").style.display = "none";
        document.getElementById("incomePre").value = "";
        document.getElementById("income1input").value="";
        document.getElementById("income2input").value="";
    }
}

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
function sumwages() {
    var wage1=parseFloat(document.getElementById("income1input").value);
    var wage2=parseFloat(document.getElementById("income2input").value);
    var grosswages=parseFloat(document.getElementById("incomePre").value);
    var err;
    document.getElementById("taxerror").innerHTML=null

    
    if (wage1>0 && wage2>0) {
            document.getElementById("incomePre").value = wage1+wage2;
    }
    else if (wage1>0) {
        document.getElementById("incomePre").value = wage1;
    }
    else if (wage2>0) {
        document.getElementById("incomePre").value = wage2;
    }
}

function getNonZeroRandomNumber(){
    var random = Math.floor(Math.random()*3999) - 2000;
    if(random==0) return 1;
    return random/100;
}