import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button, Rating
} from '@mui/material';
import {createTrainerReview} from "../api/trainer-reviews/createTrainerReview";
import {TrainerReviewGradeFromNumberToText} from "../Enum";

export const AddTrainerReviewDialog = ({open, onClose, parentId, trainerId, onSave}) => {
    const [review, setReview] = React.useState({
        comment: "",
        trainerReviewGrade: 0
    });

    const handleCreateReview = async () => {
        try {
            await createTrainerReview(
                parentId,
                trainerId,
                review
            );
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving review:', error);
        } finally {
            setReview({
                comment: '',
                trainerReviewGrade: 0
            });
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adaugă review</DialogTitle>
            <DialogContent>
                <TextField
                    label="Review trainer"
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{mt: 2}}
                />
                <Rating
                    name="rating"
                    value={TrainerReviewGradeFromNumberToText[review.trainerReviewGrade]}
                    onChange={(e, newValue) => setReview({ ...review, trainerReviewGrade: TrainerReviewGradeFromNumberToText[newValue] })}
                    max={5}
                    sx={{ mt: 3 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Închide</Button>
                <Button onClick={() => handleCreateReview()} variant="contained">
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};

