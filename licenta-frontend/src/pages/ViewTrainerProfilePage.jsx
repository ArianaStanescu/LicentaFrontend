import {
    Alert,
    Box,
    Button,
    CardMedia,
    Paper, Rating, TextareaAutosize, Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {calculateAge} from "../helpers/calculateAge";
import {Gender} from "../Enum";
import {getTrainer} from "../api/trainer/getTrainer";
import {addFavoriteTrainer} from "../api/parent/addFavoriteTrainer";
import {hasFavoriteTrainer} from "../api/parent/hasFavoriteTrainer";
import {getParentId, getTrainerId} from "../helpers/localStorageHelper";
import {searchByTrainerId} from "../api/ads/searchByTrainerId";
import {getAdImage} from "../api/ads/getAdImage";
import Grid2 from "@mui/material/Grid2";
import {AdCard} from "../components/AdCard";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {getTrainerImage} from "../api/trainer/getTrainerImage";
import {isParent, isTrainer} from "../context/AuthContextProvider";
import { EditTrainerProfileDialog } from "../components/EditTrainerProfileDialog";

export const ViewTrainerProfilePage = () => {
    const {trainerId} = useParams();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [showAddFavoriteTrainer, setShowAddFavoriteTrainer] = useState(false);
    const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
    const [ads, setAds] = useState([]);
    const [images, setImages] = useState({});
    const [trainerImage, setTrainerImage] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        title: "",
        category: "",
        minAge: "",
        maxAge: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        status: 'ACTIVE',
        pageNumber: 0,
        pageSize: 5,
        sortBy: "id",
        sortDirection: "desc"
    });

    const fetchTrainer = async () => {
        try {
            const data = await getTrainer(trainerId);
            setTrainer(data);
            const savedImage = await getTrainerImage(trainerId);
            setTrainerImage(savedImage);
        } catch (error) {
            console.error("Eroare la încărcarea trainerilor favoriți:", error);
        }
    };

    useEffect(() => {
        fetchTrainer();
    }, [trainerId]);

    useEffect(() => {
        if (trainer && getParentId()) {
            verifyIfTrainerIsFavorite();
        }
    }, [trainer]);

    const fetchAds = async () => {
        setError(null);
        try {
            setIsLoading(true);
            const ads = await searchByTrainerId(trainerId, filters);
            setAds(ads || []);
            console.log(ads);
            setHasNextPage(ads.length === filters.pageSize);
        } catch (err) {
            setError("Failed to load ads. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchImage = async (adId) => {
        try {
            const imageUrl = await getAdImage(adId);
            setImages((prevImages) => ({
                ...prevImages,
                [adId]: imageUrl,
            }));
        } catch (err) {
            console.error(`Failed to load image for ad ${adId}`);
        }
    };

    useEffect(() => {
        fetchAds();
    }, [filters]);

    useEffect(() => {
        ads.forEach((ad) => {
            if (!images[ad.id]) {
                fetchImage(ad.id);
            }
        });
    }, [ads]);

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

    const handlePreviousPage = () => {
        setFilters({
            ...filters,
            pageNumber: Math.max(filters.pageNumber - 1, 0)
        });
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setFilters({
                ...filters,
                pageNumber: filters.pageNumber + 1
            });
        }
    };

    return (
        <>
            <Box sx={{padding: 3}}>
                <Typography variant="h4" gutterBottom>
                    Profil trainer
                </Typography>

                <Paper elevation={3} sx={{ padding: 3, mt: 3, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

                    <Box sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", md: "50%" } }}>
                        {trainerImage && <CardMedia
                            component="img"
                            image={trainerImage}
                            sx={{
                                height: "100%",
                                width: "25%",
                                objectFit: "contain",
                            }}
                        />}
                        <Typography
                            variant="body1"
                            sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, mb: 2, mt: 2 }}
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
                        <Box sx={{ gap: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
                            {trainer?.reviewGrade && <Rating
                                name="rating"
                                value={trainer?.reviewGrade ?? 5}
                                max={5}
                                precision={0.1}
                                sx={{ alignSelf: "flex-start" }}
                                readOnly={true}
                            />}
                            {trainer?.reviewGrade && <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.9rem", md: "1rem", mt: 1 } }}
                            >
                                ({trainer?.reviewGrade})
                            </Typography>}
                        </Box>
                        {showAddFavoriteTrainer && (
                            <Button variant="text"
                                onClick={handleAddFavoriteTrainer}
                                sx={{ alignSelf: "flex-start" }}>
                                Abonează-te!
                            </Button>
                        )}
                        <Button variant="text"
                            onClick={() => navigate('/view-trainer-reviews/' + trainerId)}
                            sx={{ alignSelf: "flex-start" }}>
                            Recenzii
                        </Button>
                        {isTrainer() && getTrainerId() == trainer?.id && <Button
                            size="small"
                            variant="text"
                            onClick={() => setEditProfileDialogOpen(true)}
                            sx={{ alignSelf: "flex-start" }}
                        >
                            Editează
                        </Button>}
                    </Box>
                    <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                        <TextareaAutosize
                            placeholder="Descriere trainer"
                            multiline
                            name="trainerDescription"
                            minRows={7}
                            fullWidth
                            value={trainer?.description ?? ""}
                            style={{
                                resize: 'vertical', maxHeight: '500px', minHeight: '50px', width: '100%', marginTop: '10px'
                            }} />
                    </Box>
                    {editProfileDialogOpen &&
                        <EditTrainerProfileDialog
                            open={editProfileDialogOpen}
                            onClose={() => setEditProfileDialogOpen(false)}
                            trainerToEdit={trainer}
                            onSave={fetchTrainer}
                        />}
                </Paper>

                <Box
                    xs={12}
                    sm={8}
                    md={9}
                    spacing={2}
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        flex: "auto",
                    }}
                >
                    {error && (
                        <Box sx={{minHeight: {xs: "auto", md: "600px"}}}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    )}

                    {!error && !isLoading && ads.length > 0 && (
                        <>
                            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                {ads.map((ad, index) => (
                                    <Grid2 xs={12} sm={6} md={4} key={ad.id}>
                                        <AdCard {...ad} imageUrl={images[ad.id]}/>
                                    </Grid2>
                                ))}
                            </Box>

                            <Grid2
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 3,
                                    gap: {xs: "auto", sm: 2},
                                }}
                            >
                                <Button
                                    variant="text"
                                    onClick={handlePreviousPage}
                                    disabled={filters.pageNumber === 0}
                                    startIcon={<ArrowBack/>}
                                >
                                    Înapoi
                                </Button>
                                <Box
                                    sx={{
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Pagina {filters.pageNumber + 1}
                                </Box>
                                <Button
                                    variant="text"
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage}
                                    endIcon={<ArrowForward/>}
                                >
                                    Înainte
                                </Button>
                            </Grid2>
                        </>
                    )}

                    {!error && !isLoading && ads.length === 0 && (
                        <Box sx={{minHeight: {xs: "auto", md: "600px"}, mt: 3}}>
                            <Alert severity="info">Trainer-ul nu are niciun anunț activ!</Alert>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};