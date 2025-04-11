import {
    Box,
    Button,
    Alert,
 Typography
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {GroupCard} from "../../components/GroupCard";
import {useParams} from "react-router-dom";
import {getGroupsByChild} from "../../api/group/getGroupsByChild";
import {getChild} from "../../api/children/getChild";

export const ChildGroupsPage = () => {
    const {childId} = useParams();
    const [groups, setGroups] = useState([]);
    const [child, setChild] = useState([]);
    const [error, setError] = useState(null);

    const fetchGroups = async () => {
        setError(null);
        try {
            const data = await getGroupsByChild(childId);
            const sorted = (data || []).sort((a, b) => b.id - a.id);
            setGroups(sorted);
        } catch (err) {
            setError("Eroare la încărcarea grupurilor.");
        }
    };

    const fetchChild = async () => {
        setError(null);
        try {
            const data = await getChild(childId);
            setChild(data);
        } catch (err) {
            setError("Eroare la încărcarea copilului.");
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchChild();
    }, [childId]);

    return (
        <Box sx={{padding: 2}}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                {child && (<Typography variant="h4" gutterBottom>
                    Grupele la care este înscris copilul {child.firstName} {child.lastName}
                </Typography>)}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {groups.length === 0 ? (
                <Alert severity="info">Copilul nu e înscris la nicio grupă.</Alert>
            ) : (
                <Grid2 container spacing={2}>
                    {groups?.map((group) => (
                        <Grid2 sx={{width: '100%'}} xs={12} key={group.id}>
                            <GroupCard group={group}/>
                        </Grid2>
                    ))}
                </Grid2>
            )}
        </Box>
    );
};
