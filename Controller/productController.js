const Product = require("../Models/productModel");
const { newCloud } = require("../Util/cloudinary");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "products shown", products });
  } catch (error) {
    console.log("error in getting products", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.addProducts = async (req, res) => {
  try {
    const { title, description, price, category, sizes, colors, stock } =
      req.body;
    const imageFiles = req.files;

    console.log(
      `Adding Product. Files received: ${imageFiles ? imageFiles.length : 0}`
    );

    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }

    let imageUrls = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const uploadResult = await newCloud(file.path);

        if (uploadResult && uploadResult.url) {
          imageUrls.push({
            img: uploadResult.url,
            public_id: uploadResult.public_id,
          });
        } else {
          console.log("Failed to upload image (Check Env Vars)");
        }
      }
      console.log("Images uploaded to cloudinary:", imageUrls);
    }

    const safeSizes = Array.isArray(sizes)
      ? sizes.join(",")
      : (sizes || "").trim();
    const safeColors = Array.isArray(colors)
      ? colors.join(",")
      : (colors || "").trim();

    const product = new Product({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      sizes: safeSizes,
      colors: safeColors,
      stock: stock ? Number(stock) : 0,
      images: imageUrls,
    });

    const saveProduct = await product.save();
    console.log("Product added successfully");

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
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(400).json({ message: "Product does not exist" });
    }

    if (req.body.title) product.title = req.body.title.trim();
    if (req.body.description) product.description = req.body.description.trim();
    if (req.body.price) product.price = req.body.price;
    if (req.body.category) product.category = req.body.category.trim();
    if (req.body.stock) product.stock = Number(req.body.stock);
    if (req.body.sizes) product.sizes = req.body.sizes;
    if (req.body.colors) product.colors = req.body.colors;

    let retainedImages = [];
    if (req.body.existingImages) {
      const incomingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];

      if (product.images && product.images.length > 0) {
        retainedImages = product.images.filter((dbImg) => {
          const dbUrl = typeof dbImg === "string" ? dbImg : dbImg.img;
          return incomingImages.includes(dbUrl);
        });
      }
    }
    const imageFiles = req.files;
    let newImageUrls = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const uploadResult = await newCloud(file.path);

        if (uploadResult && uploadResult.url) {
          newImageUrls.push({
            img: uploadResult.url,
            public_id: uploadResult.public_id,
          });
        }
      }
    }

    product.images = [...retainedImages, ...newImageUrls];

    const update = await product.save();
    console.log("Product updated successfully");

    if (update) {
      return res
        .status(200)
        .json({ message: "product update successful", product: update });
    }
  } catch (error) {
    console.log("error updating products", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ _id: id });
    if (product) {
      return res.status(200).json({ message: "product deleted" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("error deleting product", error);
    return res.status(500).json({ message: "Error deleting product" });
  }
};
