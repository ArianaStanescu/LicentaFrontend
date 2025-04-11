// components/AddNoteDialog.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';

export const AddNoteDialog = ({ open, onClose, note, setNote, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adaugă notă</DialogTitle>
            <DialogContent>
                <TextField
                    label="Notă sesiune"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Închide</Button>
                <Button onClick={onSave} variant="contained">
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};

