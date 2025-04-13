import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Input,
    Typography,
    Box,
} from "@mui/material";

export const AddFileDialog = ({ open, onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("document", selectedFile);
            formData.append("title", selectedFile.name);
            onUpload(formData);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adaugă document sesiune</DialogTitle>
            <DialogContent>
                <Box mt={2}>
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
                    disabled={!selectedFile}
                >
                    Încarcă
                </Button>
            </DialogActions>
        </Dialog>
    );
};
