import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button, Rating
} from '@mui/material';
import {getParentId} from "../../helpers/localStorageHelper";
import {editTrainerReview} from "../../api/trainer-reviews/editTrainerReview";
import {TrainerReviewGradeFromNumberToText, TrainerReviewGradeFromTextToNumber} from "../../Enum";

export const EditTrainerReviewDialog = ({open, onClose, reviewToEdit, onSave}) => {
    const [review, setReview] = React.useState({
        comment: reviewToEdit?.comment || "",
        trainerReviewGrade: reviewToEdit?.trainerReviewGrade || 1
    });
    const handleEditReview = async () => {
        try {
            await editTrainerReview(
                getParentId(),
                reviewToEdit?.id,
                review
            );
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving review:', error);
        } finally {
            setReview({
                comment: '',
                rating: 0
            });
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Modifică review-ul</DialogTitle>
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
                    value={TrainerReviewGradeFromTextToNumber[review?.trainerReviewGrade]}
                    onChange={(e, newValue) => setReview({ ...review, trainerReviewGrade: TrainerReviewGradeFromNumberToText[newValue] })}
                    max={5}
                    sx={{ mt: 3 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Închide</Button>
                <Button onClick={() => handleEditReview()} variant="contained">
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};

