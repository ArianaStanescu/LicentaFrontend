import { Box, Button, Container, Grid2, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isParent, isTrainer } from "../context/AuthContextProvider";
import { getAllCommentsForTrainer } from "../api/session-comment/getAllCommentsForTrainer";
import { getParentId, getTrainerId } from "../helpers/localStorageHelper";
import { getAllCommentsForParent } from "../api/session-comment/getAllCommentsForParent";
import { AddSessionCommentDialog } from "../components/AddSessionCommentDialog";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import { SessionCommentCard } from "../components/SessionCommentCard";

export const ViewSessionCommentsPage = () => {
    const { sessionId, groupId } = useParams();
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const userIsTrainer = isTrainer();
    const userIsParent = isParent();
    const [addCommentDialogOpen, setAddCommentDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        pageNumber: 0,
        pageSize: 10
    });
    const [hasNextPage, setHasNextPage] = useState(false);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            if (isTrainer()) {
                const data = await getAllCommentsForTrainer(getTrainerId(), sessionId, filters);
                setComments(data || []);
                setHasNextPage(data.length === filters.pageSize);
            } else {
                const data = await getAllCommentsForParent(getParentId(), sessionId, filters);
                setComments(data || []);
                setHasNextPage(data.length === filters.pageSize);
            }

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
        fetchComments();
    }, []);

    return (<Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
            Comentarii sesiune
        </Typography>
        <Button onClick={() => setAddCommentDialogOpen(true)} variant="contained" sx={{ mb: 2 }}>
            Adaugă comentariu
        </Button>
        {!isLoading && !error && comments?.length === 0 &&
            <Typography color="text.secondary">Niciun comentariu înregistrat.</Typography>

        }
        {!isLoading && !error && comments?.length > 0 &&
            <>
                <Grid2 container spacing={2}>
                    {comments?.map((comment) => (
                        <Grid2 item xs={12} sm={6} md={4} key={comment.id} style={{"width": "100%"}}>
                            <SessionCommentCard
                                comment={comment}
                                sessionId={sessionId}
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
        <AddSessionCommentDialog
            open={addCommentDialogOpen}
            onClose={() => setAddCommentDialogOpen(false)}
            sessionId={sessionId}
            onSave={fetchComments}
        />
    </Container>)
}