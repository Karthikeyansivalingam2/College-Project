var btnsubmit=document.getElementById("btnsubmit")
var txtName=document.getElementById("txtName")
    var txtMobile=document.getElementById("txtMobile")
    
    var spnErrorName=document.getElementById("spnErrorName")
    var spnErrorMobile=document.getElementById("spnErrorMobile")
  
    var isvalid=true
   btnsubmit.addEventListener("click",function(event){
    //event.preventDefault();
    isvalid=true
    if(txtName.value=="")
    {
        spnErrorName.innerHTML="Please enter the name"
        isvalid=false
    }
    else{
        spnErrorName.innerHTML=""
    }
    if(txtMobile.value=="")
    {
       spnErrorMobile.innerHTML="Please enter the mobile number"
       isvalid=false
    }
    else{
       spnErrorMobile.innerHTML=""
    }

   
    if(isvalid)
    {
     alert("Your details sucessfully added.Our Team will call you soon")
    }
   
})

