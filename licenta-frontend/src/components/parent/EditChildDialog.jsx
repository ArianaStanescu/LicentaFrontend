import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button
} from "@mui/material";
import { Gender } from "../../Enum";

export const EditChildDialog = ({ open, onClose, child, setChild, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Editează copilul</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Prenume"
                    name="firstName"
                    value={child?.firstName || ""}
                    onChange={(e) => setChild({ ...child, firstName: e.target.value })}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Nume"
                    name="lastName"
                    value={child?.lastName || ""}
                    onChange={(e) => setChild({ ...child, lastName: e.target.value })}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Data nașterii"
                    name="birthDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        inputProps: {
                            max: new Date().toISOString().split("T")[0],
                        },
                    }}
                    value={child?.birthDate || ""}
                    onChange={(e) => setChild({ ...child, birthDate: e.target.value })}
                />
                <TextField
                    select
                    fullWidth
                    margin="dense"
                    label="Gen"
                    name="gender"
                    value={child?.gender || ""}
                    onChange={(e) => setChild({ ...child, gender: e.target.value })}
                >
                    <MenuItem value="MALE">{Gender.MALE}</MenuItem>
                    <MenuItem value="FEMALE">{Gender.FEMALE}</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anulează</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        onSave(child);
                        onClose();
                    }}
                >
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};

