import { Button, Container, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isParent, isTrainer } from "../context/AuthContextProvider";
import { getAllCommentsForTrainer } from "../api/session-comment/getAllCommentsForTrainer";
import { getParentId, getTrainerId } from "../helpers/localStorageHelper";
import { getAllCommentsForParent } from "../api/session-comment/getAllCommentsForParent";
import { AddSessionCommentDialog } from "../components/AddSessionCommentDialog";

export const ViewSessionCommentsPage = () => {
    const { sessionId, groupId } = useParams();
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const userIsTrainer = isTrainer();
    const userIsParent = isParent();
    const [addCommentDialogOpen, setAddCommentDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        pageNumber: 0,
        pageSize: 10
    });

    const fetchComments = async () => {
        try {
            if (isTrainer()) {
                const data = await getAllCommentsForTrainer(getTrainerId(), sessionId, filters);
                setComments(data || []);
            } else {
                const data = await getAllCommentsForParent(getParentId(), sessionId, filters);
                setComments(data || []);
            }
        } catch (err) {
            setError("Eroare la încărcarea grupului.");
        }
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
        <AddSessionCommentDialog
            open={addCommentDialogOpen}
            onClose={() => setAddCommentDialogOpen(false)}
            sessionId={sessionId}
            onSave={fetchComments}
        />
    </Container>)
}