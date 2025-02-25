import React, {useContext, useState} from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Alert,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {authenticate} from "../services/keycloak";
import { getUserIdLocalStorage} from "../helpers/localStorageHelper";
import {AuthContext} from "../context/AuthContextProvider";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Toate câmpurile sunt obligatorii!");
            return;
        }

        const data = await authenticate(email, password);

        if (data?.error_description) {
            console.log("Error ", data.error_description);
        }
        else {
            const userId = getUserIdLocalStorage();
            console.log("User id", userId);
            await login(data);
            if (userId != null) {
                // ????
                //await updateToken();
                navigate("/home-page-parent");
            } else {
                console.log("User id is null");
            }
        }
        alert("Login reușit! 🎉");
    };

    return (
        <Container maxWidth="sm">
            <Box
                component={Paper}
                elevation={3}
                sx={{
                    p: 4,
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Autentificare
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <form onSubmit={handleLogin} style={{ width: "100%", marginTop: 16 }}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Parolă"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Nu ai cont? <a href="#">Înregistrează-te</a>
                </Typography>
            </Box>
        </Container>
    );
};

