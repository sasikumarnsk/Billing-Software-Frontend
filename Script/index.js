let menuState = true;
var products;
var numberOfProduct=1;
var totalPrice = 0 ;
getAllProducts();
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

async function billing(){
    const productData = document.getElementById("billing-product-name").value;
    if(productData=="")
        return;
    if(numberOfProduct == 1)
    {
        document.getElementById("billing-product-table").innerHTML = "<th>No</th> <th>ID</th> <th>Product Name</th> <th>Qty</th> <th>Price</th> <th>Total</th>";
    }
    const productQuantity = document.getElementById("billing-product-quantity").value;
    var table = document.getElementById("billing-product-table");
    var row = table.insertRow(numberOfProduct);
    const productDetail = productData.split(". ");
    var data = await getProduct(productDetail[0]);
    row.insertCell(0).innerHTML = numberOfProduct++;
    row.insertCell(1).innerHTML = productDetail[0];
    row.insertCell(2).innerHTML = productDetail[1];
    row.insertCell(3).innerHTML= productQuantity;
    const price = productQuantity*data["productPrice"];
    row.insertCell(4).innerHTML = data["productPrice"];
    row.insertCell(5).innerHTML = price;
    totalPrice = totalPrice + price;
    document.getElementById("total-price").innerHTML = totalPrice;
    document.getElementById("billing-product-name").value="";
    document.getElementById("billing-product-quantity").value= "1";
}

function finishBilling(){
    var printData = document.getElementById("billing-product-table");
    newWin = window.open("");
    newWin.document.write(printData.outerHTML);
    newWin.document.write("Total Amount : "+totalPrice);

    newWin.print();
    newWin.close();
    totalPrice = 0;
    numberOfProduct = 1;
    document.getElementById("billing-product-table").innerHTML = "";
    document.getElementById("total-price").innerHTML = "0";

}

async function getAllProducts(){
    try{
        const response = await fetch("https://localhost:7090/api/Product");
        products = await response.json();
        }
        catch(e){
            toastMessage("Billing Failed","#D65047");
            return;
        }
    dl = document.createElement("datalist");
    dl.id = 'product-datalist';
    for(var i=0 ; i< products.length; i++)
     {  
        var option = document.createElement('option');
        option.value = products[i].productId+". "+products[i].productName;
        dl.appendChild(option);
        
    }
    document.getElementById("billing-product-name").appendChild(dl);
    
}
function resetBilling(){
    document.getElementById("product-table").innerHTML=""; 
    document.getElementById("billing-product-table").innerHTML = "";
    totalPrice = 0;
    numberOfProduct = 1;
    document.getElementById("total-price").innerHTML = "0";

}
async function viewAllProducts() {
    
    try{
    const response = await fetch("https://localhost:7090/api/Product");
    var data = await response.json();
    products = data;
    }
    catch(e){
        toastMessage("View All Request Failed","#D65047");
        return;
    }
    
    var table = document.createElement("table")
    var headers = ["productId", "productName","productPrice","productQuantity"];
    var tablehead = ["Product ID","Product Name","Product Price","Product Quantity"];
    var row = table.insertRow(-1);
    for(var i = 0;i<tablehead.length; i++){
        var headerCell = document.createElement("th");
        headerCell.innerHTML = tablehead[i];
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

async function getProduct(productId){
    if(productId==""){
        toastMessage("Enter The Product Id","#FFC107");
        return;
    }
    let response;
    try{
        response = await fetch("https://localhost:7090/api/Product/"+productId);
        const data = await response.json();
        return data;
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
}

async function searchProduct(){
    const productId = document.getElementById("search-product-id").value;
    var data = await getProduct(productId);
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
