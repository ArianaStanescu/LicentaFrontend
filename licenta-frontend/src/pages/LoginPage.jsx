import React, {useContext, useState} from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Alert, FormControlLabel, Checkbox
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {authenticate} from "../services/keycloak";
import {clearTokensAndUsers, setParentId, setTrainerId} from "../helpers/localStorageHelper";
import {findByEmail} from "../api/findByEmail";
import {FirebaseMessagingContext} from "../context/FirebaseMessagingProvider";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isTrainer, setIsTrainer] = useState(false);
    const navigate = useNavigate();
    const {initializeMessaging} = useContext(FirebaseMessagingContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Toate câmpurile sunt obligatorii!");
            return;
        }

        const data = await authenticate(email, password);

        if (data?.error_description) {
            setError("Email sau parolă incorectă!");
        } else {
            try {
                const parentOrTrainerId = await findByEmail(email, isTrainer);
                if (parentOrTrainerId === null) {
                    setError("Email sau parolă incorectă!");
                    clearTokensAndUsers();
                    return;
                }
                if (isTrainer) {
                    setTrainerId(parentOrTrainerId);
                    initializeMessaging(parentOrTrainerId, true);
                    // navigate("/home-page-trainer");
                    navigate("/my-groups");
                } else {
                    setParentId(parentOrTrainerId);
                    initializeMessaging(parentOrTrainerId, false);
                    navigate("/home-page-parent");
                }
            } catch(e) {
                setError(e);
            }

        }

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

                <form onSubmit={handleLogin} style={{width: "100%", marginTop: 16}}>
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

                    <FormControlLabel
                        control={<Checkbox checked={isTrainer} onChange={(e) => setIsTrainer(e.target.checked)}/>}
                        label="Sunt trainer"
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 2}}>
                        Login
                    </Button>
                </form>

                <Typography variant="body2" sx={{mt: 2}}>
                    Nu ai cont? <a href="http://localhost:3000/register">Înregistrează-te</a>
                </Typography>
            </Box>
        </Container>
    );
};

