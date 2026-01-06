import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { addProduct } from "../../../Actions/product.actions";

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    sizes: "",
    colors: "",
    stock: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const validFiles = files.filter((file) => file.type.startsWith("image/"));

      if (validFiles.length !== files.length) {
        setError("Some files were skipped because they are not valid images.");
      }

      setImages((prevImages) => [...prevImages, ...validFiles]);
      setError("");
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) {
      setError("Title, Price and Category are required");
      return;
    }

    if (images.length === 0) {
      setError("At least one product image is required");
      return;
    }

    setLoading(true);

    try {
      const submissionData = new FormData();

      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("price", formData.price);
      submissionData.append("category", formData.category);
      submissionData.append("stock", formData.stock);
      submissionData.append("sizes", formData.sizes);
      submissionData.append("colors", formData.colors);

      images.forEach((file) => {
        submissionData.append("images", file);
      });

      await dispatch(addProduct(submissionData, navigate));
    } catch (error) {
      console.log("error in adding products", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: { xs: "95%", sm: "80%", md: "600px" },
        maxWidth: "600px",
        margin: "0 auto",
        bgcolor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
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
          Add Product
        </Typography>

        <form onSubmit={handleAddProduct}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Product Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                value={formData.stock}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Category"
                name="category"
                fullWidth
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Sizes"
                name="sizes"
                fullWidth
                value={formData.sizes}
                onChange={handleInputChange}
                helperText="Comma separated (e.g. S,M,L)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Colors"
                name="colors"
                fullWidth
                value={formData.colors}
                onChange={handleInputChange}
                helperText="Comma separated (e.g. Red,Blue)"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px dashed #ccc",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Product Images
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    color: "#0f2a1d",
                    borderColor: "#0f2a1d",
                    mb: 2,
                    "&:hover": {
                      borderColor: "#144430",
                      bgcolor: "rgba(15, 42, 29, 0.04)",
                    },
                  }}
                >
                  Select Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleImage}
                    accept="image/*"
                  />
                </Button>

                {images.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {images.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 80,
                          height: 80,
                          border: "1px solid #ddd",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "rgba(255,255,255,0.8)",
                            p: "2px",
                            "&:hover": { bgcolor: "white", color: "red" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {images.length} file(s) selected
                </Typography>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                  bgcolor: "#0f2a1d",
                  mt: 2,
                  py: 1.5,
                  "&:hover": { bgcolor: "#144430" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Product"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProducts;
