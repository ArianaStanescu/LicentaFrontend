import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import { isTrainer } from '../context/AuthContextProvider';
import { getParentId, getTrainerId } from '../helpers/localStorageHelper';
import { editCommentByParent } from '../api/session-comment/editCommentByParent';
import { editCommentByTrainer } from '../api/session-comment/editCommentByTrainer';

export const EditSessionCommentDialog = ({ open, onClose, commentToEdit, onSave }) => {
    const [comment, setComment] = React.useState(commentToEdit?.content);
    const userIsTrainer = isTrainer();
    const editComment = async () => {
        try {
            if (userIsTrainer) {
                await editCommentByTrainer(
                    getTrainerId(),
                    commentToEdit?.id,
                    comment,
                );
            } else {
                await editCommentByParent(
                    getParentId(),
                    commentToEdit?.id,
                    comment
                );
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving comment:', error);
        } finally {
            setComment('');
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Modifică comment</DialogTitle>
            <DialogContent>
                <TextField
                    label="Comment sesiune"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Închide</Button>
                <Button onClick={() => editComment()} variant="contained">
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};

