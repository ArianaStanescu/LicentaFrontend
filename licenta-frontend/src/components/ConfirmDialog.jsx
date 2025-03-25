import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";

export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Anulează</Button>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    Confirmă
                </Button>
            </DialogActions>
        </Dialog>
    );
};
