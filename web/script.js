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

    //Loop through the items from the server
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        //Create a new line for this item
        var tr = document.createElement("tr");

        var imageCell = document.createElement("td");
        var image = document.createElement("img");
        image.setAttribute("src", item.url);
        image.setAttribute("width", "200");
        image.setAttribute("height", "200");
        image.setAttribute("border", "1px solid blue");
        imageCell.appendChild(image);
        tr.appendChild(imageCell);

        var nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        tr.appendChild(nameCell);

        var priceCell = document.createElement("td");
        priceCell.textContent = item.price;
        tr.appendChild(priceCell);

        var stockCell = document.createElement("td");
        stockCell.textContent = item.stock;
        tr.appendChild(stockCell);

        var descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.description;
        tr.appendChild(descriptionCell);

        tableBody.appendChild(tr);
    }
}

function sellItems() {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
    }
}

function logIn() {
    var u = document.getElementById("brugernavn").value;
    var p = document.getElementById("password").value;
    var login = {username: u, password: p};
    var body = JSON.stringify(login);
    sendRequest("POST", "rest/shop/login", body, function (customerText) {
        var costumer = JSON.parse(customerText);
        costumer.isLoggedIn = true;
        showCostumer(costumer);
    });
}

function signUp() {
    var u = document.getElementById("brugernavn").value;
    var p = document.getElementById("password").value;
    var login = {username: u, password: p};
    var body = JSON.stringify(login);
    sendRequest("POST", "rest/shop/signUp", body, function (customerText) {
        var costumer = JSON.parse(customerText);
        showCostumer(costumer);
    });
}

function showCostumer(customer) {
    var text1 = document.getElementById("tester");
    text1.setAttribute("Value", "Welcome " + customer.name);
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

