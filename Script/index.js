let menuState = true;
function menuBar(){
    if(menuState)
    {
        document.getElementById("nav-items-id").style.left = "0%";
        menuState = false;
        document.getElementById("menu-icon-content").textContent = "close";
    }
    else{
        document.getElementById("nav-items-id").style.left = "-100%";
        menuState = true;
        document.getElementById("menu-icon-content").textContent = "menu";
    }
}

async function viewAllProducts() {
    
    try{
    const response = await fetch("https://localhost:7090/api/Product");
    var data = await response.json();
    }
    catch(e){
        toastMessage("View All Request Failed","#D65047");
        return;
    }
    
    var table = document.createElement("table")
    var headers = ["productId", "productName","productPrice","productQuantity"];
    var row = table.insertRow(-1);
    for(var i = 0;i<headers.length; i++){
        var headerCell = document.createElement("th");
        headerCell.innerHTML = headers[i];
        row.appendChild(headerCell);

    }

    for(var i=0 ; i< data.length ; i++){
        var row = table.insertRow(-1);
        var cellData = data[i];
        for(var j=0; j<headers.length; j++){
            var cell = row.insertCell(j);
            cell.innerHTML = cellData[headers[j]];
        }
    } 
    var dvTable = document.getElementById("product-table");  
    dvTable.innerHTML="";
    dvTable.appendChild(table);   
    
}

async function searchProduct(){
    const productId = document.getElementById("search-product-id").value;
    if(productId==""){
        toastMessage("Enter The Product Id","#FFC107");
        return;
    }
    let response;
    try{
        response = await fetch("https://localhost:7090/api/Product/"+productId);
        var data = await response.json();
        console.log(response);
    }
    catch(e){
        toastMessage("Product Search Request Failed","#D65047");
        return;
    }
    finally{
        if(response.status == 404){
            toastMessage("Product Not Found","#FFC107");
            return;
        }

    }

    document.getElementById("search-product-id").value="";

    document.getElementById("search-product-container-id").style.display = "none";
    document.getElementById("update-product-container-id").style.display = "block";
    document.getElementById("update-productId").value = data["productId"];
    document.getElementById("update-productId").disabled = true;
    document.getElementById("update-productName").value = data["productName"];
    document.getElementById("update-productPrice").value = data["productPrice"];
    document.getElementById("update-productQuantity").value = data["productQuantity"];

}
async function updateProduct(){
    const productId = document.getElementById("update-productId").value;
    const productName = document.getElementById("update-productName").value;
    const productPrice = document.getElementById("update-productPrice").value;
    const productQuantity = document.getElementById("update-productQuantity").value;
    try{
        const response = await fetch("https://localhost:7090/api/Product/update/"+productId,{
            method:"PUT",
            headers:{
                "Accept" : "application/json",
                "Content-type" : "application/json"
            },
            body:  JSON.stringify({
                "productId" : productId,
                "productName" : productName,
                "productPrice" :productPrice,
                "productQuantity":productQuantity 
            })
        });
    }
    catch(e){
        toastMessage("Product Update Request Failed","#D65047");
        return;
    }

    viewAllProducts();
    document.getElementById("search-product-container-id").style.display = "block";
    document.getElementById("update-product-container-id").style.display = "none";
    toastMessage(productId+" Updated Succesfully","#558B2F");

}

async function addProduct(){
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById("productQuantity").value;
    if(productName=="" || productPrice=="" || productQuantity=="")
    {
        toastMessage("Enter the All fields","#FFC107");
        return;
    }
    try {
        const response = await fetch("https://localhost:7090/api/Product/create",{
            method: "POST",
            headers:{
                "Accept" : "application/json",
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                "productName" : productName,
                "productPrice" :productPrice,
                "productQuantity":productQuantity 
            }),
            
        });
        
    } catch (e) {
        toastMessage("Add Product Request Failed","#D65047");
        return;
    }

    viewAllProducts();
    document.getElementById("productName").value="";
    document.getElementById("productPrice").value="";
    document.getElementById("productQuantity").value="";
    toastMessage(productName+" Added Succesfully","#558B2F");
    
}

async function deleteProduct(){
    const productId = document.getElementById("delete-product-id").value;
    if(productId==""){
        toastMessage("Enter The Product Id","#FFC107");
        return;
    }
    let response;
    try{
        response = await fetch("https://localhost:7090/api/Product/delete/"+productId,{
            method:"DELETE",
        });
        
    }
    catch(e){
        toastMessage("Delete Request Failed","#D65047");
        return;
    }
    finally{
        if(response.status == 404){
            toastMessage("Product ID : "+productId+" Not Found","#FFC107");
            return;
        }
    }
    viewAllProducts();
    document.getElementById("delete-product-id").value = "";
    toastMessage(productId+" Deleted Succesfully","#558B2F");

}

function toastMessage(e,color){
    const toast = document.getElementById("toast");
    toast.querySelector(".toast-body").innerHTML = e;
    toast.classList.add("visible");
   document.querySelector(".toast-body").style.background = color;
    
    setTimeout(() => {
        toast.classList.remove("visible");
    }, 5000);
   
}
