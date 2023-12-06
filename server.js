import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";

// Carregar variáveis de ambiente
dotenv.config();

// Iniciar o servidor Express
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// Rota de sucesso
app.get("/sucesso", (req, res) => {
    res.sendFile("sucesso.html", { root: "public" });
});

// Rota de cancelamento
app.get("/cancel", (req, res) => {
    res.sendFile("cancelar.html", { root: "public" });
});

// Configuração do Stripe
const stripeGateway = new stripe(process.env.STRIPE_SECRET_KEY); // Certifique-se de que a chave seja STRIPE_SECRET_KEY no seu arquivo .env
const DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 1);
        console.log("item-price:", item.price);
        console.log("unitAmount:", unitAmount);
        return {
            price_data: {
                currency: "BRL", // Moeda em Reais
                product_data: {
                    name: item.title,
                    images: [item.productImg],
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems:", lineItems);

    try {
        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${DOMAIN}/sucesso`,
            cancel_url: `${DOMAIN}/cancel`,
            line_items: lineItems,
            billing_address_collection: "required",
            locale: "pt-BR", // Definir o locale como português do Brasil
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error("Erro ao criar sessão de checkout:", error);
        res.status(500).json({ error: "Erro ao criar sessão de checkout" });
    }
});

app.listen(3000, () => {
    console.log("O servidor está ouvindo na porta 3000");
});
