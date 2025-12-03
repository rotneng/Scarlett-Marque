const Cart = require("../Models/cartModel");

exports.addItemToCart = async (req, res) => {
  try {
    console.log("addItemToCart called. Req.user:", req.user);

    const userId = req.user._id || req.user.id || req.user.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User ID is missing. Please logout and login again.",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      const product = req.body.cartItems.product;
      const item = cart.cartItems.find((c) => c.product == product);

      if (item) {
        await Cart.findOneAndUpdate(
          { user: userId, "cartItems.product": product },
          {
            $inc: { "cartItems.$.quantity": req.body.cartItems.quantity },
            $set: { "cartItems.$.price": req.body.cartItems.price },
          }
        );
        return res.status(201).json({ message: "Cart quantity updated" });
      } else {
        await Cart.findOneAndUpdate(
          { user: userId },
          {
            $push: {
              cartItems: req.body.cartItems,
            },
          }
        );
        return res.status(201).json({ message: "Item added to cart" });
      }
    } else {
      const cart = new Cart({
        user: userId,
        cartItems: [req.body.cartItems],
      });

      const newCart = await cart.save();
      return res.status(201).json({ cart: newCart });
    }
  } catch (error) {
    console.log("addItemToCart Error:", error);
    return res.status(400).json({ error });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const cart = await Cart.findOne({ user: userId }).populate(
      "cartItems.product",
      "_id title price image category"
    );

    if (cart) {
      let cartItems = {};
      cart.cartItems.forEach((item) => {
        if (item.product) {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            title: item.product.title,
            image: item.product.image,
            price: item.product.price,
            qty: item.quantity,
            category: item.product.category,
          };
        }
      });
      return res.status(200).json({ cartItems });
    } else {
      return res.status(200).json({ cartItems: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.removeCartItems = async (req, res) => {
  const { productId } = req.body.payload;
  const userId = req.user._id || req.user.id || req.user.userId;

  if (productId && userId) {
    try {
      const result = await Cart.updateOne(
        { user: userId },
        {
          $pull: {
            cartItems: {
              product: productId,
            },
          },
        }
      );
      return res.status(202).json({ result });
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else {
    return res.status(400).json({ error: "Product ID or User ID missing" });
  }
};
