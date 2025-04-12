// src/components/session/SessionComments.jsx

import {
    Box,
    Typography,
    Button,
    TextareaAutosize
} from "@mui/material";
import { isTrainer } from "../../context/AuthContextProvider";

export const SessionNote = ({ note, setNote, updateNote }) => {
    const userIsTrainer = isTrainer();
    return (
        <Box mt={5}>
            <Typography variant="h6" gutterBottom>Nota sesiune</Typography>

            <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextareaAutosize
                    placeholder="Adauga nota"
                    multiline
                    minRows={5}
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                        resize: 'vertical', maxHeight: '500px', minHeight: '50px'
                    }}
                    readOnly={!userIsTrainer}
                />
               {userIsTrainer && <Box mt={1}>
                    <Button
                        variant="contained"
                        onClick={() => updateNote()}
                        disabled={!note?.trim()}
                    >
                        Salveaza
                    </Button>
                </Box>}
            </Box>
        </Box>
    );
};
