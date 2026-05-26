const API_BASE = '/api';

let bill = [];

// Navigation functions
function go(page){
    window.location=page;
}

function logout(){
    window.location="a_login.html";
}

function goDashboard(){
    window.location.href="b_dashboard.html";
}

// Product functions
async function addProduct(){
    let name = document.getElementById("pname").value;
    let price = document.getElementById("pprice").value;

    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price: Number(price) })
        });
        if (response.ok) {
            document.getElementById("pname").value = '';
            document.getElementById("pprice").value = '';
            loadProduct();
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function loadProduct(){
    let table = document.getElementById("productTable");
    if (!table) return; // Prevent errors on pages without this table

    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        table.innerHTML="";
        products.forEach(p => {
            table.innerHTML += `<tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            </tr>`;
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadProductForBilling(){
    let table = document.getElementById("billingProduct");
    if (!table) return;

    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();

        table.innerHTML="";
        products.forEach(p => {
            table.innerHTML += `<tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td><button onclick="addToBill('${p.name}',${p.price})">Add</button></td>
            </tr>`;
        });
    } catch (error) {
        console.error('Error loading products for billing:', error);
    }
}

// Billing functions
function addToBill(name, price){
    let found = bill.find(p => p.name == name);
    if (found) {
        found.qty++;
        found.total = found.qty * price;
    } else {
        bill.push({name, price, qty: 1, total: price});
    }
    renderBill();
}

function renderBill(){
    let table = document.getElementById("billTable");
    if (!table) return;

    table.innerHTML="";
    let total = 0;
    bill.forEach(p => {
        table.innerHTML += `<tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.qty}</td>
        <td>${p.total}</td>
        </tr>`;
        total += p.total;
    });
    document.getElementById("total").innerText = total;
}

// Call load functions on page load based on what elements exist
document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
    loadProductForBilling();
});