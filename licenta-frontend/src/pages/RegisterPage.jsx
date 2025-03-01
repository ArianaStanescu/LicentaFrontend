import React, {useState} from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Alert, Snackbar, Grid, Grid2
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
        isTrainer: false,
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);


    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Valid email is required";
        if (!formData.password.trim() || formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!formData.gender) newErrors.gender = "Please select your gender";
        if (formData.isTrainer && !formData.birthDate) newErrors.birthDate = "Birth date is required for trainers";

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
            <Box sx={{display: "flex", alignItems: "stretch", height: "100%", flexDirection: {xs: "column", md: "row"}}}>
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
                            label="Sunteți tutore?"
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
                                InputLabelProps={{shrink: true}}
                            />
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
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{width: "100%"}}>
                    Utilizator creat cu succes!
                </Alert>
            </Snackbar>
        </Container>
    );

};

