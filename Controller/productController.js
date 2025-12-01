const Product = require("../Models/productModel");
const cloudinary = require("../Util/cloudinary");
const { newCloud } = require("../Util/cloudinary")

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "products shown", products });
  } catch (error) {
    console.log("error in getting products", error);
  }
};

exports.addProducts = async (req, res) => {
  try {
    const { title, description, price, category, sizes, colors, stock,  } =
      req.body;
    const imageFile = req.file;
    let imageUrl = "";

    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }

    if (imageFile) {
      const uploadResult = await newCloud(imageFile.path);
      if (uploadResult && uploadResult.url) {
        imageUrl = uploadResult.url;
        console.log("image uploaded to cloudinary", imageUrl);
      }
    }

    // const publicationDate = new Date(date);

    const product = new Product({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      sizes: sizes ? sizes.trim() : "",
      colors: colors ? colors.trim() : "",
      stock: stock ? Number(stock) : 0,
      price: Number(price),
      image: imageUrl,
      // date: publicationDate,
    });
    const saveProduct = await product.save();
    console.log("product added succesfully");

    return res
      .status(200)
      .json({ message: "product added succesfully", product: saveProduct });
  } catch (error) {
    console.log("error in adding products", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(","),
      });
    }
    res.status(500).json({ success: "false", message: "error adding product" });
    console.log("error in adding products", error);
    
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(400).json({ message: "Product does not exist" });
    }
    console.log("product", product);

    title = req.body.title;
    description = req.body.description;
    price = req.body.price;
    category = req.body.category;
    sizes = req.body.sizes;
    colors = req.body.colors;
    stock = req.body.stock;
    // date = req.body.date;

    const imageFile = req.file;
    let imageUrl = product.image;

    if (imageFile) {
      const uploadResult = await newCloud(imageFile.path);
      if (uploadResult && uploadResult.url) {
        imageUrl = uploadResult.url;
        console.log("image added to cloudinary", imageUrl);
      }
    }

    // const publicationDate = new Date(date);

    product.title = title.trim();
    product.description = description.trim();
    product.price = price.trim();
    product.category = category.trim();
    product.sizes = sizes ? sizes.trim() : "";
    product.colors = colors ? colors.trim() : "";
    product.stock = stock ? Number(stock) : 0;
    product.image = imageUrl;
    // product.date = publicationDate;

    const update = await product.save();

    if (update) {
      console.log("updating product success");
      return res.status(200).json({ message: "product update succesfull" });
    }
  } catch (error) {
    console.log("error updating products", error);
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
      console.log("Product deleted succesfully");
      return res.status(200).json({ message: "product deleted" });
    }
  } catch (error) {
    console.log("error deleting books", error);
    return res.status(200).json({ message: "product deleted" });
  }
};
