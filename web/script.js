//Run this function when we have loaded the HTML document
window.onload = updateTable(); updateCart();

function updateTable () {
    //This code is called when the body element has been loaded and the application starts
    //Request items from the server. The server expects no request body, so we set it to null
    sendRequest("GET", "rest/shop/items", null, function (itemsText) {
        //This code is called when the server has sent its data
        var items = JSON.parse(itemsText);
        addItemsToTable(items);
    });
}

function addItemsToTable(items) {
    //Get the table body we we can add items to it
    var tableBody = document.getElementById("itemtablebody");
    //Remove all contents of the table body (if any exist)
    tableBody.innerHTML = "";
    var tr = document.createElement("tr");
    tr.setAttribute("width", "100%");
    var Cell = document.createElement("td");
    Cell.setAttribute("width", "100%");
    Cell.setAttribute("height", "100%");
    //Loop through the items from the server
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        //Create a new line for this item
        var div1 = document.createElement("div");
        div1.setAttribute("class", "pdiv");

        var table = document.createElement("table");
        table.setAttribute("class", "ptable");

        var idTR = document.createElement("tr");
        idTR.setAttribute("class", "pTR");
        var idCell = document.createElement("td");
        idCell.setAttribute("class", "pTD");
        idCell.setAttribute("colspan", "2");
        idCell.textContent = item.id;
        idTR.appendChild(idCell);
        table.appendChild(idTR);

        var nameTR = document.createElement("tr");
        nameTR.setAttribute("class", "pTR");
        var nameCell = document.createElement("td");
        nameCell.setAttribute("class", "pTD");
        nameCell.setAttribute("colspan", "2");
        nameCell.textContent = item.name;
        nameTR.appendChild(nameCell);
        table.appendChild(nameTR);

        var imageTR = document.createElement("tr");
        imageTR.setAttribute("class", "pTR");
        var imageCell = document.createElement("td");
        imageCell.setAttribute("class", "pTD");
        imageCell.setAttribute("colspan", "2");
        var image = document.createElement("img");
        image.setAttribute("src", item.url);
        image.setAttribute("width", "200");
        image.setAttribute("height", "200");
        imageCell.appendChild(image);
        imageTR.appendChild(imageCell);
        table.appendChild(imageTR);

        var priceTR = document.createElement("tr");
        priceTR.setAttribute("class", "pTR");
        var priceCell = document.createElement("td");
        priceCell.setAttribute("class", "pTD1");
        priceCell.textContent = "Price:";
        var priceCell1 = document.createElement("td");
        priceCell1.setAttribute("class", "pTD1");
        priceCell1.textContent = item.price;
        priceTR.appendChild(priceCell);
        priceTR.appendChild(priceCell1);
        table.appendChild(priceTR);

        var stockTR = document.createElement("tr");
        stockTR.setAttribute("class", "pTR");
        var stockCell = document.createElement("td");
        stockCell.setAttribute("class", "pTD1");
        stockCell.textContent = "Stock:";
        var stockCell1 = document.createElement("td");
        stockCell1.setAttribute("class", "pTD1");
        stockCell1.textContent = item.stock;
        stockTR.appendChild(stockCell);
        stockTR.appendChild(stockCell1);
        table.appendChild(stockTR);

        var descriptionTR = document.createElement("tr");
        descriptionTR.setAttribute("class", "pTR");
        var descriptionCell = document.createElement("td");
        descriptionCell.setAttribute("class", "pTD");
        descriptionCell.setAttribute("colspan", "2");
        descriptionCell.textContent = item.description;
        descriptionTR.appendChild(descriptionCell);
        table.appendChild(descriptionTR);

        var buttonTR = document.createElement("tr");
        buttonTR.setAttribute("class", "pTR");
        var buttonCell = document.createElement("td");
        buttonCell.setAttribute("class", "pTD");
        buttonCell.setAttribute("colspan", "2");
        var btn = document.createElement("BUTTON");
        var b = document.createTextNode("Buy");
        btn.appendChild(b);
        btn.onclick = function () {
            addToCart(this)
        };
        buttonCell.appendChild(btn);
        buttonTR.appendChild(buttonCell);
        table.appendChild(buttonTR);

        div1.appendChild(table);
        Cell.appendChild(div1);
    }
    tr.appendChild(Cell);
    tableBody.appendChild(tr);
}

function addToCart(o) {
    var id = o.parentNode.parentNode.parentNode.childNodes[0].firstChild.firstChild.nodeValue;
    var name = o.parentNode.parentNode.parentNode.childNodes[1].firstChild.firstChild.nodeValue;
    var price = o.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].firstChild.nodeValue;
    var stock = o.parentNode.parentNode.parentNode.childNodes[4].childNodes[1].firstChild.nodeValue;
    var description = o.parentNode.parentNode.parentNode.childNodes[5].firstChild.firstChild.nodeValue;
    var cart = {id: id, name: name, price: price, stock: stock, description: description, url: ""};
    var body = JSON.stringify(cart);
    sendRequest("POST", "rest/shop/addToCart", body, function (response) {
        var say = JSON.parse(response);
        grzegorzSays(say.message)
        updateCart();
    });
}

function sellItems() {
    sendRequest("POST", "rest/shop/sellItems", null, function (saleResponse) {
        var sales = JSON.parse(saleResponse);
        var string = "";
        for (var i = 0; i < sales.length; i++) {
            var sale = sales[i];
            var x = 0;
            if(sale.succes==false) {
                string = string.concat(sale.message + "\n");
                x=x+1;
            }
            if(x===0) {
                string =("Purchase succesful!");
                emptyCart();
            }
        }
        grzegorzSays(string);
        updateTable();
    });
}

function emptyCart() {
    sendRequest("GET", "rest/shop/emptyCart", null, function (response) {
        updateCart();
    });
}

function updateCart() {
    sendRequest("GET", "rest/shop/cart", null, function (itemsText) {
        var items = JSON.parse(itemsText);
        updateCartDisplay(items);
    });
}

function updateCartDisplay(items) {
    var cartBody = document.getElementById("cartP");
    cartBody.innerHTML = "";
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        total = total + (item.price*item.amount);
        var tr = document.createElement("tr");
        tr.setAttribute("width", "100%");
        var nameCell = document.createElement("td");
        nameCell.setAttribute("class", "cTD");
        nameCell.textContent = item.name;
        tr.appendChild(nameCell);
        var priceCell = document.createElement("td");
        priceCell.setAttribute("class", "cTD");
        priceCell.textContent = item.price;
        tr.appendChild(priceCell);
        cartBody.appendChild(tr);
    }
}

function grzegorzSays(string){
    var quote = document.getElementById("gregP");
    quote.innerHTML = string;
}

function logIn() {
    var u = document.getElementById("brugernavn").value;
    var p = document.getElementById("password").value;
    var login = {username: u, password: p};
    var body = JSON.stringify(login);
    sendRequest("POST", "rest/shop/login", body, function (customerText) {
        var costumer = JSON.parse(customerText);
        showCostumer(costumer);
    });
}

function signUp() {
    var u = document.getElementById("brugernavn").value;
    var p = document.getElementById("password").value;
    var login = {username: u, password: p};
    var body = JSON.stringify(login);
    sendRequest("POST", "rest/shop/signUp", body, function (response) {
        var user = JSON.parse(response);
        grzegorzSays(user.message);
    });
}

function showCostumer(customer) {
    grzegorzSays("Welcome " + customer.name);
    var Cell1 = document.getElementById("loginTD");
    Cell1.innerHTML = "";
    var table = document.createElement("tr");
    var tr = document.createElement("tr");
    var Cell2 = document.createElement("td");
    var Cell3 = document.createElement("td");
    var btn = document.createElement("BUTTON");
    var b = document.createTextNode("Logout");
    btn.appendChild(b);
    btn.onclick = function () {
        sendRequest("GET", "rest/shop/logOut", null, function (response) {
            window.location.reload();
        });
    };
    Cell2.innerHTML = "You are logged in as " + customer.name;
    Cell3.appendChild(btn);
    tr.appendChild(Cell2);
    tr.appendChild(Cell3);
    table.appendChild(tr);
    Cell1.appendChild(table);
}

function sendRequest(httpMethod, url, body, responseHandler) {
    var http;
    if (!XMLHttpRequest)
        http = new ActiveXObject("Microsoft.XMLHTTP");
    else
        http = new XMLHttpRequest();
    http.open(httpMethod, url);
    if (httpMethod == "POST") {
        http.setRequestHeader("Content-Type", "application/json");
    }
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            responseHandler(http.responseText);
        }
        if (http.readyState == 401) {

        }
    };
    http.send(body);
}

