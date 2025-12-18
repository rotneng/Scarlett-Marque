import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Card,
  Container 
} from '@mui/material';

const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const TrackOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const activeStep = 1; 

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Button 
          onClick={() => navigate(-1)} 
          sx={{ mb: 3 }}
        >
          &larr; Back to Order
        </Button>

        <Card sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#0f2a1d" }}>
            Tracking Order
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Order ID: {id}
          </Typography>

          <Box sx={{ width: '100%', mt: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ mt: 5, p: 3, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Current Status: {steps[activeStep]}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your order is currently being processed by our team. We will notify you when it ships.
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default TrackOrderPage;