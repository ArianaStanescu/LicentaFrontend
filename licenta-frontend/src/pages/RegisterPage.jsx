import React, { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Alert, Snackbar, Grid, Grid2,
    TextareaAutosize
} from "@mui/material";
import {register} from "../services/keycloak.js";
import {registerUser} from "../api/register";
import {useNavigate} from "react-router-dom";

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: "",
        birthDate: "",
        trainerDescription: "",
        trainerImage: null,
        isTrainer: false,
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageUpload = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            "trainerImage": e.target.files[0],
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "Numele este obligatoriu.";
        if (!formData.lastName.trim()) newErrors.lastName = "Prenumele este obligatoriu.";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Este necesar un email valid.";
        if (!formData.password.trim() || formData.password.length < 6)
            newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere.";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Numărul de telefon este obligatoriu.";
        if (!formData.gender) newErrors.gender = "Vă rugăm să selectați genul.";
        if (formData.isTrainer && !formData.birthDate) newErrors.birthDate = "Data nașterii este necesară pentru trainer.";
        if (formData.isTrainer && !formData.trainerDescription) newErrors.trainerDescription = "Descrierea trainer-ului este obligatorie.";
        if (formData.isTrainer && !formData.trainerImage) newErrors.trainerImage = "Imaginea trainer-ului este obligatorie.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            enabled: true,
            username: formData.email,
            emailVerified: true,
            credentials: [
                {
                    type: "password",
                    value: formData.password,
                    temporary: false,
                },
            ],
        }

        try {
            const registerResponse = await register(userData, formData.isTrainer);
            const allUserData = {...formData};
            allUserData.gender = allUserData.gender.toUpperCase();

            if (registerResponse?.success && registerResponse?.keycloakUserId) {
            const backendRegisterResponse = await registerUser(allUserData);
            if (backendRegisterResponse?.success) {
                setOpenSnackbar(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
            }
        } catch (error) {
            setErrorMessage("Verifică dacă ai cont valid.");
        }

    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: "flex", alignItems: "stretch", height: "100%", flexDirection: { xs: "column", md: "row" } }}>
                <Box
                    component="img"
                    src={`${process.env.PUBLIC_URL}/register.png`}
                    alt="Ilustrare înregistrare"
                    sx={{
                        width: "50%",
                        height: "auto",
                        boxShadow: 3,
                        display: { xs: "none", md: "block" },
                        borderRadius: "16px 0 0 16px",
                    }}
                />
                <Box sx={{
                    p: 3,
                    boxShadow: 3,
                    bgcolor: "white",
                    width: { xs: "100%", md: "50%" },
                    borderRadius: "0px 16px 16px 0px",
                    minHeight: "100vh",

                }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Creare cont
                    </Typography>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Prenume"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Nume"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            margin="normal"
                            type="email"
                        />
                        <TextField
                            fullWidth
                            label="Parolă"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Număr de telefon"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            select
                            label="Gen"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            error={!!errors.gender}
                            helperText={errors.gender}
                            margin="normal"
                        >
                            <MenuItem value="Male">Masculin</MenuItem>
                            <MenuItem value="Female">Feminin</MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isTrainer"
                                    checked={formData.isTrainer}
                                    onChange={handleChange}
                                />
                            }
                            label="Sunteți trainer?"
                        />
                        {formData.isTrainer && (
                            <TextField
                                fullWidth
                                label="Data nașterii"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleChange}
                                error={!!errors.birthDate}
                                helperText={errors.birthDate}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    inputProps: {
                                        max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0],
                                    },
                                }}
                            />
                        )}
                        {formData.isTrainer && (
                            <TextareaAutosize
                                placeholder="Descriere trainer"
                                multiline
                                name="trainerDescription"
                                minRows={3}
                                fullWidth
                                value={formData.trainerDescription}
                                onChange={handleChange}
                                style={{
                                    resize: 'vertical', maxHeight: '500px', minHeight: '50px', width: '100%', marginTop: '10px'
                                }} />)}
                        {formData.isTrainer && errors.trainerDescription && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {errors.trainerDescription}
                            </Typography>
                        )}
                        {formData.isTrainer && (
                            <Button variant="contained" component="label">
                                Încarcă imagine (JPEG)
                                <input
                                    type="file"
                                    accept="image/jpeg"
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        )}

                        {formData.isTrainer && errors.trainerImage && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {errors.trainerImage}
                            </Typography>
                        )}
                        {formData.isTrainer && formData.trainerImage && (
                            <Box sx={{ fontSize: "0.9rem", color: "gray" }}>
                                Fișier selectat: {formData.trainerImage.name}
                            </Box>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{mt: 2}}
                        >
                            Creare cont
                        </Button>
                    </form>
                </Box>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
                    Utilizator creat cu succes!
                </Alert>
            </Snackbar>
        </Container>
    );

};

