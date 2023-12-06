// Selecionando elementos
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

// Abrir carrinho
cartIcon.addEventListener("click", () => {
    cart.classList.add("active");
});

// Fechar carrinho
closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
});

// Inicialização quando o documento estiver pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Função de inicialização
function ready() {
    // Remover item do carrinho
    const removeCartButtons = document.getElementsByClassName("cart-remove");
    for (const button of removeCartButtons) {
        button.addEventListener("click", removeCartItem);
    }

    // Escolher quantidades
    const quantityInputs = document.getElementsByClassName("cart-quantity");
    for (const input of quantityInputs) {
        input.addEventListener("change", quantityChanged);
    }

    // Adicionar ao carrinho
    const addCart = document.getElementsByClassName("add-cart");
    for (const button of addCart) {
        button.addEventListener("click", addCartClicked);
    }

    // Carregar itens do carrinho
    loadCartItems();
}

// Função para remover item do carrinho
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// Função para atualizar quantidades
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// Função para formatar um número como moeda brasileira (BRL)
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

// Função para converter um valor em formato de moeda brasileira para um número
function parseCurrency(value) {
    const cleanedValue = value.replace(/\D/g, ''); // Remover todos os caracteres não numéricos
    return parseFloat(cleanedValue) / 100; // Dividir por 100 para obter o valor em reais
}

// Função para adicionar item ao carrinho
function addCartClicked(event) {
    const button = event.target;
    const shopProducts = button.parentElement;
    const title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    const price = shopProducts.getElementsByClassName("price")[0].innerText;
    const productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(title, price, productImg) {
    const cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    const cartItems = document.getElementsByClassName("cart-content")[0];
    const cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === title) {
            alert("Você já adicionou este item ao carrinho");
            return;
        }
    }
    const cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" name="" id="" value="1" class="cart-quantity">
    </div>
    <!-- Remover Item -->
    <i class='bx bx-trash-alt cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    saveCartItems();
    updateCartIcon();
}

// Função para atualizar o total
function updatetotal() {
    const cartBoxes = document.getElementsByClassName("cart-box");
    let total = 0;

    for (const cartBox of cartBoxes) {
        const priceElement = cartBox.getElementsByClassName("cart-price")[0];
        const quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        const price = parseCurrency(priceElement.innerText); // Converter preço para número
        const quantity = quantityElement.value;
        total += price * quantity;
    }

    // Formatando o total como moeda brasileira (BRL)
    const formattedTotal = formatCurrency(total);
    document.getElementsByClassName("total-price")[0].innerText = formattedTotal;

    // Total salvar = LocalStorage
    localStorage.setItem("cartTotal", total);
}

// Função para manter os itens no carrinho ao recarregar a página
function saveCartItems() {
    const cartContent = document.getElementsByClassName("cart-content")[0];
    const cartBoxes = cartContent.getElementsByClassName("cart-box");
    const cartItems = [];

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        const priceElement = cartBox.getElementsByClassName("cart-price")[0];
        const quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        const productImg = cartBox.getElementsByClassName("cart-img")[0].src;

        const item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Carregar itens do carrinho
function loadCartItems() {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        for (const item of cartItemsArray) {
            addProductToCart(item.title, item.price, item.productImg);
            const cartBoxes = document.getElementsByClassName("cart-box");
            const cartBox = cartBoxes[cartBoxes.length - 1];
            const quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = item.quantity;
        }
    }
    const cartTotal = localStorage.getItem("cartTotal");
    if (cartTotal) {
        const formattedTotal = formatCurrency(cartTotal);
        document.getElementsByClassName("total-price")[0].innerText = formattedTotal;
    }
    updateCartIcon();
}

// Quantidades no carrinho Icon
function updateCartIcon() {
    const cartBoxes = document.getElementsByClassName("cart-box");
    let quantity = 0;

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        quantity += parseInt(quantityElement.value);
    }
    const cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", quantity);
}
