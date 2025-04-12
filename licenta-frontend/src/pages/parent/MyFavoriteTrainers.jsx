import {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button, Alert
} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {getAllFavoriteTrainers} from "../../api/parent/getAllFavoriteTrainers";
import {getParentId} from "../../helpers/localStorageHelper";
import Grid2 from "@mui/material/Grid2";
import {removeFavoriteTrainer} from "../../api/parent/removeFavoriteTrainer";

const PAGE_SIZE = 10;

export const MyFavoriteTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const parentId = getParentId();

    const fetchTrainers = async () => {
        try {
            setIsLoading(true);
            const response = await getAllFavoriteTrainers(parentId, pageNumber, PAGE_SIZE);
            setTrainers(response);
            setHasNextPage(response.length === PAGE_SIZE);
        } catch (error) {
            console.error("Eroare la încărcarea trainerilor favoriți:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, [pageNumber]);

    const handleNextPage = () => {
        if (hasNextPage) setPageNumber((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageNumber > 0) setPageNumber((prev) => prev - 1);
    };

    const handleRemoveFavoriteTrainer = async (trainerId) => {
        const parentId = getParentId();

        try {
            await removeFavoriteTrainer(parentId, trainerId);
            await fetchTrainers();
        } catch (error) {
            console.error(`Eroare la eliminarea trainerului ${trainerId} din favoriți:`, error);
        }
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Trainerii mei favoriți
            </Typography>

            {!isLoading && trainers.length === 0 ? (
                <Alert severity="info">Niciun trainer găsit!</Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nume</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefon</TableCell>
                                    <TableCell>Gen</TableCell>
                                    <TableCell>Data nașterii</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainers.map((trainer) => (
                                    <TableRow key={trainer.id}>
                                        <TableCell>{trainer.firstName} {trainer.lastName}</TableCell>
                                        <TableCell>{trainer.email}</TableCell>
                                        <TableCell>{trainer.phoneNumber}</TableCell>
                                        <TableCell>{trainer.gender === 'MALE' ? 'Masculin' : 'Feminin'}</TableCell>
                                        <TableCell>{new Date(trainer.birthDate).toLocaleDateString("ro-RO")}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="notification"
                                                onClick={() => handleRemoveFavoriteTrainer(trainer.id)}
                                            >
                                                Dezabonează-te
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid2 xs={12}
                           sx={{
                               display: "flex",
                               justifyContent: "center",
                               mt: 3,
                               gap: {xs: "auto", sm: 2},
                           }}>
                        <Button
                            variant="text"
                            onClick={handlePreviousPage}
                            disabled={pageNumber === 0}
                            startIcon={<ArrowBack/>}
                        >
                            Înapoi
                        </Button>
                        <Box sx={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            Pagina {pageNumber + 1}
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


        </Box>
    );
};

