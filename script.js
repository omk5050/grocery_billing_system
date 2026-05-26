let product= JSON.parse(localStorage.getItem("product")) || [];
let bill = [];

function login(){

let u=document.getElementById("username").value;
let p=document.getElementById("password").value;

if(u=="admin" && p=="123"){
window.location="b_dashboard.html";
}else{
alert("Invalid Login");
}

}

function go(page){
window.location=page;
}

function logout(){
window.location="a_login.html";
}

function addProduct(){

let name=document.getElementById("pname").value;
let price=document.getElementById("pprice").value;

products.push({name,price});

localStorage.setItem("product",JSON.stringify(product));

loadProduct();
}

function loadProduct(){

let table=document.getElementById("productTable");

table.innerHTML="";

products.forEach(p=>{
table.innerHTML+=`<tr>
<td>${p.name}</td>
<td>${p.price}</td>
</tr>`;
});

}

function loadProductForBilling(){

let table=document.getElementById("billingProduct");

table.innerHTML="";

products.forEach(p=>{

table.innerHTML+=`<tr>
<td>${p.name}</td>
<td>${p.price}</td>
<td><button onclick="addToBill('${p.name}',${p.price})">Add</button></td>
</tr>`;

});

}

function addToBill(name,price){

let found=bill.find(p=>p.name==name);

if(found){
found.qty++;
found.total=found.qty*price;
}else{
bill.push({name,price,qty:1,total:price});
}

renderBill();
}

function renderBill(){

let table=document.getElementById("billTable");

table.innerHTML="";

let total=0;

bill.forEach(p=>{

table.innerHTML+=`<tr>
<td>${p.name}</td>
<td>${p.price}</td>
<td>${p.qty}</td>
<td>${p.total}</td>
</tr>`;

total+=p.total;

});

document.getElementById("total").innerText=total;
}

function generateInvoice(){

let cname=document.getElementById("customerName").value;
let mobile = cmobile.value.trim();

if(!/^\d+$/.test(mobile)){
  alert("Mobile number should contain only digits");
  return;
}

if(mobile.length !== 10){
  alert("Mobile number must be exactly 10 digits");
  return;
}

localStorage.setItem("invoiceCustomer",cname);
localStorage.setItem("invoiceBill",JSON.stringify(bill));

window.location="e_invoice.html";
}
function goDashboard(){
    window.location.href="b_dashboard_html";
}

function loadInvoice(){

let cname=localStorage.getItem("invoiceCustomer");
let bill=JSON.parse(localStorage.getItem("invoiceBill"));

document.getElementById("invCustomer").innerText=cname;

let table=document.getElementById("invoiceTable");

let total=0;

bill.forEach(p=>{

table.innerHTML+=`<tr>
<td>${p.name}</td>
<td>${p.price}</td>
<td>${p.qty}</td>
<td>${p.total}</td>
</tr>`;

total+=p.total;

});

document.getElementById("invoiceTotal").innerText=total;

}

function loadReports(){

let report=document.getElementById("reportTable");

let cname=localStorage.getItem("invoiceCustomer");
let bill=JSON.parse(localStorage.getItem("invoiceBill"));

let total=0;

bill.forEach(p=>{
total+=p.total;
});

report.innerHTML=`<tr>
<td>${cname}</td>
<td>${total}</td>
</tr>`;

}