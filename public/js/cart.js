const PAYMENT_ENDPOINT = "/stripe-checkout";
const payBtn = document.querySelector(".btnbuy");

payBtn.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (!cartItems || cartItems.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de prosseguir com o pagamento.");
        return;
    }

    fetch(PAYMENT_ENDPOINT, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({
            items: cartItems,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data && data.url) {
            location.href = data.url;
        } else {
            console.error("A resposta do servidor não contém um URL válido.");
            alert("Ocorreu um problema durante o processamento do pagamento. Tente novamente mais tarde.");
        }
    })
    .catch((err) => {
        console.error("Erro durante a solicitação ao servidor:", err);
        alert("Ocorreu um erro durante o processamento do pagamento. Tente novamente mais tarde.");
    });
});
