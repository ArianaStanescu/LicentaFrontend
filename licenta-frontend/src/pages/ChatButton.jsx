import React, { useState } from "react";
import { Box, IconButton} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import { ChatDialog } from "../components/ChatDialog";
export const ChatButton = () => {
    const [chatDialogOpen, setChatDialogOpen] = useState(false);

    const handleToggle = () => {
        setChatDialogOpen(!chatDialogOpen);
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    bottom: 25,
                    right: 25,
                    zIndex: 10,
                }}
            >
                <IconButton
                    color="primary"
                    onClick={handleToggle}
                    sx={{
                        width: 70,
                        height: 70,
                        backgroundColor: "white",
                        boxShadow: 3,
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                >
                    <ChatIcon fontSize="large"/>
                </IconButton>
            </Box>

        <ChatDialog
            open={chatDialogOpen}
            onClose={() => setChatDialogOpen(false)}
        />
        </>
    );
};
