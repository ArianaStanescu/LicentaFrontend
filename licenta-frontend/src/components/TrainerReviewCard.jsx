import React, {useState} from "react";
import {Box, Card, CardContent, IconButton, Rating, Typography} from "@mui/material";
import {getParentId, getTrainerId} from "../helpers/localStorageHelper";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteTrainerReview} from "../api/trainer-reviews/deleteTrainerReview";
import {EditTrainerReviewDialog} from "./parent/EditTrainerReviewDialog";
import {TrainerReviewGradeFromTextToNumber} from "../Enum";

export const TrainerReviewCard = ({review, refresh}) => {
    const [editReviewDialogOpen, setEditReviewDialogOpen] = useState(false);

    const isAuthor = () => {
        return review?.parent?.id == getParentId();
    }

    const handleDelete = async () => {
        try {
            await deleteTrainerReview(review.id, getParentId());
            refresh();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    }

    return (
        <Card sx={{width: "100%", mb: 2}}>
            <CardContent>
                <Box display="flex" flexDirection={"column"} justifyContent="space-between" alignItems="flex-start">
                    <Box display={"flex"} flexDirection={"row"}>
                        <Box mr={2} minWidth={150} flexDirection={"column"} display={"flex"} justifyContent={"center"}
                             gap={0.5}>
                            <Box display={"flex"} flexDirection="row" alignItems="center" gap={0.5}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {review?.parent?.firstName} {review?.parent?.lastName}
                                </Typography>
                                {isAuthor() &&
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{fontStyle: 'italic'}}>
                                        (Tu)
                                    </Typography>
                                }
                            </Box>
                            <Rating value={TrainerReviewGradeFromTextToNumber[review?.trainerReviewGrade]} precision={1} readOnly/>
                            <Typography variant="subtitle2" color="text.primary">
                                {new Date(review?.createdAt).toLocaleString("ro-RO")}
                            </Typography>
                        </Box>

                        <Box flexGrow={1}>
                            <Typography>
                                {review?.comment}
                            </Typography>
                        </Box>
                    </Box>

                    {isAuthor() && <Box display="flex" justifyContent="flex-end" sx={{width: "100%"}}>
                        <IconButton
                            size="small"
                            onClick={() => setEditReviewDialogOpen(true)}
                        >
                            <EditIcon/>
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDelete()}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </Box>}
                </Box>
                <EditTrainerReviewDialog
                    open={editReviewDialogOpen}
                    onClose={() => setEditReviewDialogOpen(false)}
                    reviewToEdit={review}
                    onSave={() => refresh()}
                />
            </CardContent>
        </Card>
    );
};
