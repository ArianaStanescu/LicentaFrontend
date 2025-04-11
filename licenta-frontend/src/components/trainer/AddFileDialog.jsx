import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Input,
    TextField,
    Typography,
    Box,
} from "@mui/material";

export const AddFileDialog = ({ open, onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile && title.trim()) {
            const formData = new FormData();
            formData.append("document", selectedFile);
            formData.append("title", title);
            onUpload(formData);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adaugă document sesiune</DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    <TextField
                        label="Titlu document"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                    />
                    {selectedFile && (
                        <Typography variant="body2" mt={1}>
                            Fișier selectat: {selectedFile.name}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anulează</Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    disabled={!selectedFile || !title.trim()}
                >
                    Încarcă
                </Button>
            </DialogActions>
        </Dialog>
    );
};
