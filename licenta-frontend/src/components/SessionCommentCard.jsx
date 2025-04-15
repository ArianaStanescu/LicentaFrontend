import React, { useState } from "react";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { getParentId, getTrainerId } from "../helpers/localStorageHelper";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteSessionComment } from "../api/session-comment/deleteSessionDocument";
import { EditSessionCommentDialog } from "./EditSessionCommentDialog";
import { useParams } from "react-router-dom";
export const SessionCommentCard = ({ comment, refresh }) => {

    const { sessionId } = useParams();
    const [editSessionCommentDialogOpen, setEditSessionCommentDialogOpen] = useState(false);

    const isAuthor = () => {
        return comment?.authorParent?.id == getParentId() || comment?.authorTrainer?.id == getTrainerId();
    }

    const handleDelete = async () => {
        try {
            await deleteSessionComment(comment.id);
            refresh();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

    return (
        <Card sx={{ width: "100%", mb: 2 }}>
            <CardContent>
                <Box display="flex" flexDirection={"column"} justifyContent="space-between" alignItems="flex-start">
                    <Box display={"flex"} flexDirection={"row"}>
                        <Box mr={2} minWidth={150} flexDirection={"column"} display={"flex"} justifyContent={"center"} gap={0.5}>
                            <Box display={"flex"} flexDirection="row" alignItems="center" gap={0.5}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {comment?.authorTrainer ? `${comment?.authorTrainer?.firstName} ${comment?.authorTrainer?.lastName}` : `${comment?.authorParent?.firstName} ${comment?.authorParent?.lastName}`}
                                </Typography>
                                {isAuthor() &&
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontStyle: 'italic' }}>
                                        (Tu)
                                    </Typography>
                                }
                            </Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {comment?.authorParent ? `Parinte ${comment?.authorParent?.children?.join(', ')}` : "Trainer"}
                            </Typography>
                            <Typography variant="subtitle2" color="text.primary">
                                {new Date(comment?.createdAt).toLocaleString("ro-RO")}
                            </Typography>
                            {!comment?.read && <Typography variant="subtitle2" color="red" sx={{ fontStyle: 'italic' }}>
                                (Nou)
                            </Typography>}
                        </Box>

                        <Box flexGrow={1}>
                            <Typography>
                                {comment?.content}
                            </Typography>
                        </Box>
                    </Box>

                    {isAuthor() && <Box display="flex" justifyContent="flex-end" sx={{ width: "100%" }}>
                        <IconButton
                            size="small"
                            onClick={() => setEditSessionCommentDialogOpen(true)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDelete()}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>}
                </Box>
                <EditSessionCommentDialog
                    open={editSessionCommentDialogOpen}
                    onClose={() => setEditSessionCommentDialogOpen(false)}
                    commentToEdit={comment}
                    sessionId={sessionId}
                    onSave={refresh}
                />
            </CardContent>
        </Card>
    );
};
