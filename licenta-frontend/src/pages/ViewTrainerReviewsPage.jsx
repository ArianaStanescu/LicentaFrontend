import {useEffect, useState} from "react";
import {getTrainer} from "../api/trainer/getTrainer";
import {useParams} from "react-router-dom";
import {Box, Button, Container, Grid2, Typography} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {getAllReviewsByTrainer} from "../api/trainer-reviews/getAllReviewsByTrainer";
import {getParentId} from "../helpers/localStorageHelper";
import {AddTrainerReviewDialog} from "../components/AddTrainerReviewDialog";
import {TrainerReviewCard} from "../components/TrainerReviewCard";
import {isParent} from "../context/AuthContextProvider";

export const ViewTrainerReviewsPage = () => {
    const {trainerId} = useParams();
    const [trainer, setTrainer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        pageNumber: 0,
        pageSize: 10
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [addReviewDialogOpen, setAddReviewDialogOpen] = useState(false);

    const fetchTrainer = async () => {
        try {
            const data = await getTrainer(trainerId);
            setTrainer(data)
        } catch (error) {
            console.error("Eroare la încărcarea trainerului:", error);
        }
    };

    useEffect(() => {
        fetchTrainer();
    }, [trainerId]);


    const fetchReviews= async () => {
        try {
            setIsLoading(true);
            const data = await getAllReviewsByTrainer(trainerId, filters);
            setReviews(data || []);
            console.log(data);
            setHasNextPage(data.length === filters.pageSize);

        } catch (err) {
            setError("Eroare la încărcarea grupului.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setFilters({
                ...filters,
                pageNumber: filters.pageNumber + 1
            });
        }
    };

    const handlePreviousPage = () => {
        setFilters({
            ...filters,
            pageNumber: Math.max(filters.pageNumber - 1, 0)
        });
    };

    useEffect(() => {
        fetchReviews();
    }, [filters]);

    return (<Container maxWidth="lg" sx={{ mt: 4 }}>
        {trainer && <Typography variant="h4" gutterBottom>
            Recenzii pentru trainerul {trainer?.firstName} {trainer?.lastName}
        </Typography>}
        {isParent() && <Button onClick={() => setAddReviewDialogOpen(true)} variant="contained" sx={{ mb: 2 }}>
            Adaugă recenzie
        </Button> }
        {!isLoading && !error && reviews?.length === 0 &&
            <Typography color="text.secondary">Nicio recenzie înregistrată.</Typography>

        }
        {!isLoading && !error && reviews?.length > 0 &&
            <>
                <Grid2 container spacing={2}>
                    {reviews?.map((review) => (
                        <Grid2 item xs={12} sm={6} md={4} key={review.id} style={{ "width": "100%" }}>
                            <TrainerReviewCard
                                review={review}
                                refresh={fetchReviews}
                            />
                        </Grid2>
                    ))}

                </Grid2>
                <Grid2 xs={12}
                       sx={{
                           display: "flex",
                           justifyContent: "center",
                           mt: 3,
                           gap: { xs: "auto", sm: 6 },
                       }}>
                    <Button
                        variant="text"
                        onClick={handlePreviousPage}
                        disabled={filters.pageNumber === 0}
                        startIcon={<ArrowBack />}
                    >
                        Înapoi
                    </Button>
                    <Box sx={{
                        fontSize: "1.2rem", fontWeight: "bold",
                        textAlign: "center", display: "flex", alignItems: "center"
                    }}>
                        Pagina {filters.pageNumber + 1}
                    </Box>
                    <Button
                        variant="text"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                        endIcon={<ArrowForward />}
                    >
                        Înainte
                    </Button>
                </Grid2>
            </>
        }
        <AddTrainerReviewDialog
            open={addReviewDialogOpen}
            onClose={() => setAddReviewDialogOpen(false)}
            parentId={getParentId()}
            trainerId={trainerId}
            onSave={fetchReviews}
        />
    </Container>)
};