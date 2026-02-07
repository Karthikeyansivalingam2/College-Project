
var drpType=document.getElementById("drpType")
var txtReview=document.getElementById("txtReview")
var btnsubmit=document.getElementById("btnsubmit")
let isValid=true;
btnsubmit.addEventListener("click",function(){
    isValid=true
 if(drpType.value=="--Please select--")
    {
         isValid=false
        alert("Please select shop")
    }

    if(txtReview.value==""){
        isValid=false
        alert("Please enter review")
    }

    if(isValid)
    {
        alert("your review submitted successfully")
    }
})
   
