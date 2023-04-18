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

//----------------------------------------------------------------------------------
// ---------------------------------------fireMain ---------------------------------

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
        //document.getElementById("Warning").innerHTML = "Please Input all FIRE Input Fields";
        //<strong>Danger!</strong> "You should" <a href="#" class="alert-link">"read this message"</a>
        document.getElementById("Warning").style.display="block";
        document.getElementById("Warning").innerHTML="Please input income, spending";
        console.log("error");
        document.getElementById("target").innerHTML="";
        document.getElementById("yrs2ret").innerHTML="";
        err=1;
        //dvTable.appendChild(table);
    }
    else {
        document.getElementById("Warning").style.display="none";
        document.getElementById("Warning").innerHTML="";
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
        document.getElementById("Warning").style.display="none";
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