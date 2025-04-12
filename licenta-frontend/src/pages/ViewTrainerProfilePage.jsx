import {Box, Button, Paper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {calculateAge} from "../helpers/calculateAge";
import {Gender} from "../Enum";
import {getTrainer} from "../api/trainer/getTrainer";
import {addFavoriteTrainer} from "../api/parent/addFavoriteTrainer";
import {hasFavoriteTrainer} from "../api/parent/hasFavoriteTrainer";
import {getParentId} from "../helpers/localStorageHelper";

export const ViewTrainerProfilePage = () => {
    const {trainerId} = useParams();
    const [trainer, setTrainer] = useState(null);
    const [showAddFavoriteTrainer, setShowAddFavoriteTrainer] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrainer = async () => {
        try {
            const data = await getTrainer(trainerId);
            setTrainer(data)
        } catch (error) {
            console.error("Eroare la încărcarea trainerilor favoriți:", error);
        }
    };

    useEffect(() => {
        fetchTrainer();
    }, [trainerId]);

    useEffect(() => {
        if (trainer) {
            verifyIfTrainerIsFavorite();
        }
    }, [trainer]);

    const handleAddFavoriteTrainer = async () => {
        await addFavoriteTrainer(getParentId(), trainerId);
        await verifyIfTrainerIsFavorite();
    };

    const verifyIfTrainerIsFavorite = async () => {
        try {
            const response = await hasFavoriteTrainer(getParentId(), trainerId);
            setShowAddFavoriteTrainer(!response);
        } catch (error) {
            console.error("Eroare la verificarea antrenorului favorit:", error);
        }
    }


    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Profil trainer
            </Typography>

            <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
                <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, mb: 2 }}
                >
                    Informații de contact:
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                >
                    Nume trainer: {trainer ? `${trainer.firstName} ${trainer.lastName}` : ""}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                >
                    Vârstă: {trainer ? `${calculateAge(trainer.birthDate)} ani` : ""}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                >
                    Gen: {trainer ? Gender[trainer.gender] : ""}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                >
                    Email: {trainer ? trainer.email : ""}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 2 }}
                >
                    Telefon: {trainer ? trainer.phoneNumber : ""}
                </Typography>

                {showAddFavoriteTrainer && (
                    <Button variant="text" onClick={handleAddFavoriteTrainer}>
                        Abonează-te!
                    </Button>
                )}
            </Paper>
        </Box>
    );
};