"use strict";

let walletAmount = 50;

let items = [
    { name: 'Apple', price: 1.99, imageUrl: "images/apple.png" },
    { name: 'Banana', price: 0.99, imageUrl: "images/banana.png" },
    { name: 'Orange', price: 2.49, imageUrl: "images/orange.png" },
    { name: 'Strawberry', price: 3.12, imageUrl: "images/strawberry.png" },
    { name: 'Pineapple', price: 2.99, imageUrl: "images/pineapple.png" },
    { name: 'Watermelon', price: 4.99, imageUrl: "images/watermelon.png" }
];


let cart = [];
let cartCount = document.getElementById("cartCount");
let cartItems = document.getElementById("cartItems");
let cartTotal = document.getElementById("cartTotal");
let modal = document.getElementById("myModal");
let closeBtn = document.getElementById("closeModal");
let buyBtn = document.getElementById("buyButton");
let walletDisplay = document.getElementById("walletAmount");
let messageDisplay = document.getElementById("message");

function updateWalletDisplay() {
    walletDisplay.textContent = walletAmount.toFixed(2);
}

function updateCartUI() {
    cartCount.innerText = cart.length;
    cartItems.innerHTML = "";
    let cartMap = new Map();
    cart.forEach((item) => {
        if (cartMap.has(item.name)) {
            cartMap.set(item.name, cartMap.get(item.name) + 1);
        } else {
            cartMap.set(item.name, 1);
        }
    });
    cartMap.forEach((value, key) => {
        let li = document.createElement("li");
        li.textContent = `${key} x${value}`;
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removeFromCart(key,items.length));
        li.appendChild(removeButton);
        let removeOneButton = document.createElement("button");
        removeOneButton.textContent = "Remove One";
        removeOneButton.addEventListener("click", () => removeFromCart(key, 1));
        li.appendChild(removeOneButton);
        cartItems.appendChild(li);
    });
    cartTotal.textContent = `$${calculateCartAmount().toFixed(2)}`;
}

function sortItemsByPrice(order) {
    items.sort((a, b) => {
        if (order === 'ascending') {
            return a.price - b.price;
        } else if (order === 'descending') {
            return b.price - a.price;
        }
    });
    showItems();
}

document.getElementById("sortButton").classList.add("sort-btn");

let ascending = true;

document.getElementById("sortButton").addEventListener("click", () => {
    if (ascending) {
        sortItemsByPrice('ascending');
        document.getElementById("sortButton").textContent = "Sort by Price (Descending)";
    } else {
        sortItemsByPrice('descending');
        document.getElementById("sortButton").textContent = "Sort by Price (Ascending)";
    }
    ascending = !ascending;
});


function showMessage(message) {
    messageDisplay.textContent = message;
    setTimeout(() => {
        messageDisplay.textContent = "";
    }, 7000);
}

function calculateCartAmount() {
    return cart.reduce((acc, item) => acc + item.price, 0);
}

function showItems() {
    let itemsGrid = document.getElementById("itemsGrid");
    itemsGrid.innerHTML = "";
    items.forEach((item) => {
        let itemContainer = document.createElement("div");
        itemContainer.classList.add("item-container");

        let img = document.createElement("img");
        img.src = item.imageUrl;
        img.alt = item.name;
        img.classList.add("item-image");
        img.style.width = "300px";
        img.style.height = "300px";

        let button = document.createElement("button");
        button.textContent = `Buy ${item.name} - $${item.price.toFixed(2)}`;
        button.classList.add("add-to-cart-btn"); // Add the class here

        itemContainer.appendChild(img);
        itemContainer.appendChild(button);

        itemsGrid.appendChild(itemContainer);

        button.addEventListener("click", () => buy(item.name, 1));
    });
}


function buy(itemName, quantity) {
    const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
    if (!item) {
        showMessage("Item not found.");
        return;
    }
    if (walletAmount < item.price * quantity) {
        showMessage("Not enough money to buy this item.");
        return;
    }
    for (let i = 0; i < quantity; i++) {
        cart.push(item);
    }
    updateCartUI();
}

function removeFromCart(itemName, quantity) {
    const index = cart.findIndex((item) => item.name.toLowerCase() === itemName.toLowerCase());
    if (index === -1) {
        showMessage("Item not found in cart.");
        return;
    }
    const itemInstances = cart.filter((item) => item.name.toLowerCase() === itemName.toLowerCase());
    const itemsToRemove = Math.min(itemInstances.length, quantity);
    if (itemsToRemove === 0) {
        showMessage(`There are no ${itemName}(s) in the cart to remove.`);
        return;
    }
    for (let i = 0; i < itemsToRemove; i++) {
        cart.splice(index, 1);
    }
    showMessage(`Removed ${itemsToRemove} ${itemName}(s) from cart.`);
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        showMessage("Your cart is empty.");
        return;
    }
    const cartAmount = calculateCartAmount();
    if (cartAmount > walletAmount) {
        showMessage("Not enough money in the wallet to checkout. Please remove some items or add funds to your wallet.");
        return;
    }
    walletAmount -= cartAmount;
    showMessage("Checkout successful. Thank you for your purchase!");
    cart = [];
    updateWalletDisplay();
    updateCartUI();
}

function checkWallet() {
    showMessage(`Wallet balance: $${walletAmount}`);
}

document.getElementById("cartButton").addEventListener("click", () => {
    modal.style.display = "block";
});

closeBtn.onclick = function () {
    modal.style.display = "none";
};

buyBtn.onclick = function () {
    checkout();
    modal.style.display = "none";
};

showItems();
updateCartUI();
updateWalletDisplay();
