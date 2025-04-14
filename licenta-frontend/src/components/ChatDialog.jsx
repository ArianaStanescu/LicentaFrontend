import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { sendResponse } from "../api/chatbot/sendResponse";

export const ChatDialog = ({ open, onClose }) => {
  const initMessageFromGpt = "Salut! Cu ce te pot ajuta?";
  const initialResponseId = "resp_67fbd96ff3588192846b862249c0b51b088f3a915b1e5a83";
  const [messages, setMessages] = useState([
    { from: "gpt", text: initMessageFromGpt },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState(null);

  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { from: "user", text: input };
    const loadingMessage = { loading: true }; 

    setMessages([...messages, userMessage, loadingMessage]);
    setLoading(true);

    const response = await sendResponse(input, previousResponseId);
    setLoading(false);

    if (!response || !response.success) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "gpt", text: "Eroare la comunicarea cu chatbot-ul! Încearcă din nou." },
      ]);
      return;
    }

    const gptMessage = {
      from: "gpt",
      text: response?.data?.output[0]?.content[0]?.text || "Eroare la comunicarea cu chatbot-ul!",
    };

    setPreviousResponseId(response?.data?.id);

    setMessages((prev) => [...prev.slice(0, -1), gptMessage]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const closeChat = () => {
    onClose();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setMessages([{ from: "gpt", text: initMessageFromGpt }]);
      setPreviousResponseId(initialResponseId);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={closeChat} fullWidth maxWidth="sm">
      <DialogTitle>Discuție cu ChatBot</DialogTitle>

      <DialogContent
        sx={{
          height: 400,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.from === "user" ? "flex-end" : "flex-start"}
            mb={1}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: "80%",
                bgcolor: msg.from === "user" ? "#90EE90" : "#f5f5f5",
                display: "flex",
                alignItems: "center",
              }}
            >
              {msg.loading ? (
                <Box display={"flex"} flexDirection={"row"} gap={2}>
                    <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  Scrie...
                </Typography>
                <CircularProgress size={16} />
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {msg.text}
                </Typography>
              )}
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </DialogContent>

      <DialogActions
        sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, px: 3, pb: 2 }}
      >
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Scrie un mesaj..."
          disabled={loading}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={closeChat}>Închide</Button>
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" onClick={handleSend} disabled={loading}>
              Trimite
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
