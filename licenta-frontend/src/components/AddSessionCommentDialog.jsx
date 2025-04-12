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
import { createCommentByParent } from '../api/session-comment/createCommentByParent';
import { createCommentByTrainer } from '../api/session-comment/createCommentByTrainer';

export const AddSessionCommentDialog = ({ open, onClose, sessionId, onSave }) => {
    const [comment, setComment] = React.useState('');
    const userIsTrainer = isTrainer();
    const createComment = async () => {
        try {
            if (userIsTrainer) {
                await createCommentByTrainer(
                    getTrainerId(),
                    sessionId,
                    comment,
                );
            } else {
                await createCommentByParent(
                    getParentId(),
                    sessionId,
                    comment
                );
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adaugă comment</DialogTitle>
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
                <Button onClick={() => createComment()} variant="contained">
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};

