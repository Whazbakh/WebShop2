//Run this function when we have loaded the HTML document
window.onload = function () {
    //This code is called when the body element has been loaded and the application starts

    //Request items from the server. The server expects no request body, so we set it to null
    sendRequest("GET", "rest/shop/items", null, function (itemsText) {
        //This code is called when the server has sent its data
        var items = JSON.parse(itemsText);
        addItemsToTable(items);
    });
};

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

        var nameTR = document.createElement("tr");
        nameTR.setAttribute("class", "pTR");
        var nameCell = document.createElement("td");
        nameCell.setAttribute("class", "pTD");
        nameCell.textContent = item.name;
        nameTR.appendChild(nameCell);
        table.appendChild(nameTR);

        var imageTR = document.createElement("tr");
        imageTR.setAttribute("class", "pTR");
        var imageCell = document.createElement("td");
        imageCell.setAttribute("class", "pTD");
        var image = document.createElement("img");
        image.setAttribute("src", item.url);
        image.setAttribute("width", "200");
        image.setAttribute("height", "200");
        image.setAttribute("border", "1px solid blue");
        imageCell.appendChild(image);
        imageTR.appendChild(imageCell);
        table.appendChild(imageTR);

        var priceTR = document.createElement("tr");
        priceTR.setAttribute("class", "pTR");
        var priceCell = document.createElement("td");
        priceCell.setAttribute("class", "pTD");
        priceCell.textContent = item.price;
        priceTR.appendChild(priceCell);
        table.appendChild(priceTR);

        var stockTR = document.createElement("tr");
        stockTR.setAttribute("class", "pTR");
        var stockCell = document.createElement("td");
        stockCell.setAttribute("class", "pTD");
        stockCell.textContent = item.stock;
        stockTR.appendChild(stockCell);
        table.appendChild(stockTR);

        var descriptionTR = document.createElement("tr");
        descriptionTR.setAttribute("class", "pTR");
        var descriptionCell = document.createElement("td");
        descriptionCell.setAttribute("class", "pTD");
        descriptionCell.textContent = item.description;
        descriptionTR.appendChild(descriptionCell);
        table.appendChild(descriptionTR);

        var buttonTR = document.createElement("tr");
        buttonTR.setAttribute("class", "pTR");
        var buttonCell = document.createElement("td");
        buttonCell.setAttribute("class", "pTD");
        var btn = document.createElement("BUTTON");
        var b = document.createTextNode("Buy");
        btn.appendChild(b);
        btn.onclick = function () {
            buy()
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

function buy() {

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

function showCostumer(customer) {
    var text1 = document.getElementById("tester");
    text1.setAttribute("Value", customer.name);
}

/////////////////////////////////////////////////////
// Code from slides
/////////////////////////////////////////////////////

/**
 * A function that can add event listeners in any browser
 */
function addEventListener(myNode, eventType, myHandlerFunc) {
    if (myNode.addEventListener)
        myNode.addEventListener(eventType, myHandlerFunc, false);
    else
        myNode.attachEvent("on" + eventType,
            function (event) {
                myHandlerFunc.call(myNode, event);
            });
}

var http;
if (!XMLHttpRequest)
    http = new ActiveXObject("Microsoft.XMLHTTP");
else
    http = new XMLHttpRequest();

function sendRequest(httpMethod, url, body, responseHandler) {
    http.open(httpMethod, url);
    if (httpMethod == "POST") {
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            responseHandler(http.responseText);
        }
    };
    http.send(body);
}

