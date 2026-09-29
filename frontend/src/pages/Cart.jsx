import { useState } from "react";

function Cart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const removeItem = (index) => {
    const newCart = cart.filter((_, itemIndex) => itemIndex !== index);

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="cart-page">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>
                    {item.price.toFixed(2).replace(".", ",")} €
                  </strong>
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <strong>
              Total: {total.toFixed(2).replace(".", ",")} €
            </strong>
          </div>
        </>
      )}
    </main>
  );
}

export default Cart;
