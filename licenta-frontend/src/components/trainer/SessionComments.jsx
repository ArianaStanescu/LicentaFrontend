// src/components/session/SessionComments.jsx

import {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Alert
} from "@mui/material";

export const SessionComments = ({sessionId}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // const fetchComments = async () => {
    //     try {
    //         const data = await getSessionComments(sessionId);
    //         setComments(data);
    //     } catch (err) {
    //         setError("Eroare la încărcarea comentariilor.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    //
    // useEffect(() => {
    //     if (sessionId) {
    //         fetchComments();
    //     }
    // }, [sessionId]);
    //
    // const handleAddComment = async () => {
    //     if (!newComment.trim()) return;
    //     try {
    //         await addSessionComment(sessionId, newComment);
    //         setNewComment('');
    //         await fetchComments();
    //     } catch (err) {
    //         setError("Eroare la trimiterea comentariului.");
    //     }
    // };

    return (
        <Box mt={5}>
            <Typography variant="h6" gutterBottom>Comentarii</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
                <Typography>Se încarcă comentariile...</Typography>
            ) : (
                <Box>
                    {comments.length === 0 ? (
                        <Typography variant="body2">Nu există comentarii.</Typography>
                    ) : (
                        comments.map((comment) => (
                            <Paper key={comment.id} sx={{p: 2, mb: 2}}>
                                <Typography variant="subtitle2">
                                    {comment.authorName} — <small>{new Date(comment.createdAt).toLocaleString()}</small>
                                </Typography>
                                <Typography variant="body1">{comment.content}</Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            )}

            <Box mt={2}>
                <TextField
                    label="Adaugă comentariu"
                    multiline
                    rows={3}
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Box mt={1}>
                    <Button
                        variant="contained"
                        // onClick={handleAddComment}
                        disabled={!newComment.trim()}
                    >
                        Trimite
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
