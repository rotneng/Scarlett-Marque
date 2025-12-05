import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getProducts, updateProduct } from "../../../Actions/product.actions"; 

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
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: { xs: "95%", sm: "80%", md: "600px" },
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "1.5rem", md: "2.125rem" },
            color: "#0f2a1d",
          }}
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

            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
              <Box
                sx={{
                  border: "1px dashed #ccc",
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Current Image / Preview
                </Typography>

                <img
                  src={newImage ? URL.createObjectURL(newImage) : currentImage}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: "1px solid #eee",
                  }}
                />

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    color: "#0f2a1d",
                    borderColor: "#0f2a1d",
                    "&:hover": { borderColor: "#144430", bgcolor: "#f0fdf4" },
                  }}
                >
                  Change Image
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  bgcolor: "#0f2a1d",
                  mt: 2,
                  py: 1.5,
                  "&:hover": { bgcolor: "#144430" },
                }}
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
