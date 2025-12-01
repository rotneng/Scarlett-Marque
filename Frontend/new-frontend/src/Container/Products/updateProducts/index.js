import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getProducts, updateProduct } from "../../../Actions";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  const products = productState?.products || [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts());
    } else {
      const productToEdit = products.find((p) => p._id === id);
      if (productToEdit) {
        setTitle(productToEdit.title);
        setDescription(productToEdit.description);
        setPrice(productToEdit.price);
        setCategory(productToEdit.category);
        setStock(productToEdit.stock);
        setCurrentImage(productToEdit.image);
      }
    }
  }, [id, products, dispatch]);

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("price", price);
    form.append("category", category);
    form.append("stock", stock);

    if (newImage) {
      form.append("image", newImage);
    }

    dispatch(updateProduct(id, form, navigate));
  };

  return (
    <Box sx={{ p: 4, maxWidth: "600px", margin: "0 auto" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Update Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Product Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Stock"
                type="number"
                fullWidth
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Image Preview:
              </Typography>
              <img
                src={newImage ? URL.createObjectURL(newImage) : currentImage}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <br />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Change Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ bgcolor: "#0f2a1d", mt: 2 }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateProduct;
