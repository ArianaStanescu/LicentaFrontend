import {useEffect, useState} from "react";
import {getAdImage} from "../../api/ads/getAdImage";
import {
    Alert,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField, Typography
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {FilterMenu} from "../../components/FilterMenu";
import {AdCard} from "../../components/AdCard";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {getTrainerId} from "../../helpers/localStorageHelper";
import {searchByTrainerId} from "../../api/ads/searchByTrainerId";
import {getActivities} from "../../api/activities/getActivities";
import {Weekday} from "../../Enum";
import {createAd} from "../../api/ads/createAd";

export const MyAdsPage = () => {
    const [ads, setAds] = useState([]);
    const [images, setImages] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [hasNextPage, setHasNextPage] = useState(true);
    const trainerId = getTrainerId();
    const [openAdDialog, setOpenAdDialog] = useState(false);
    const [dropdownActivities, setDropdownActivities] = useState([]);
    const [newAd, setNewAd] = useState({
        activityId: "",
        price: "",
        minAge: "",
        maxAge: "",
        totalSpots: "",
        startDate: "",
        endDate: "",
        durationRules: [],
        image: null,
    });
    const [filters, setFilters] = useState({
        title: "",
        category: "",
        minAge: "",
        maxAge: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        status: 'ACTIVE',
        pageNumber: 0,
        pageSize: 5,
        sortBy: "id",
        sortDirection: "desc"
    });

    const fetchAds = async () => {
        setError(null);
        try {
            setIsLoading(true);
            const ads = await searchByTrainerId(trainerId, filters);
            setAds(ads || []);
            setHasNextPage(ads.length === filters.pageSize);
        } catch (err) {
            setError("Failed to load ads. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchImage = async (adId) => {
        try {
            const imageUrl = await getAdImage(adId);
            setImages((prevImages) => ({
                ...prevImages,
                [adId]: imageUrl,
            }));
        } catch (err) {
            console.error(`Failed to load image for ad ${adId}`);
        }
    };

    useEffect(() => {
        fetchAds();
    }, [filters]);

    useEffect(() => {
        ads.forEach((ad) => {
            if (!images[ad.id]) {
                fetchImage(ad.id);
            }
        });
    }, [ads]);

    const fetchDropdownActivities = async () => {
        try {
            const data = await getActivities(getTrainerId());
            setDropdownActivities(data || []);
        } catch (err) {
            console.error("Eroare la încărcarea activităților pentru dropdown:", err);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
            pageNumber: 0
        }));
    };

    const handlePreviousPage = () => {
        setFilters({
            ...filters,
            pageNumber: Math.max(filters.pageNumber - 1, 0)
        });
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setFilters({
                ...filters,
                pageNumber: filters.pageNumber + 1
            });
        }
    };

    const handleOpenAdDialog = () => {
        setNewAd({
            activityId: "",
            price: "",
            minAge: "",
            maxAge: "",
            totalSpots: "",
            startDate: "",
            endDate: "",
            durationRules: [],
            image: null,
        });
        fetchDropdownActivities();
        setOpenAdDialog(true);
    };

    const handleCloseAdDialog = () => {
        setOpenAdDialog(false);
    };

    const handleAdChange = (e) => {
        const { name, value, type } = e.target;
        setNewAd((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleDurationRuleChange = (index, field, value) => {
        setNewAd((prev) => {
            const updatedRules = [...prev.durationRules];
            updatedRules[index] = {
                ...updatedRules[index],
                [field]: value,
            };
            return { ...prev, durationRules: updatedRules };
        });
    };

    const addDurationRule = () => {
        setNewAd((prev) => ({
            ...prev,
            durationRules: [...prev.durationRules, { day: "", startHour: 8, numberOfHours: 1 }],
        }));
    };

    const removeDurationRule = (index) => {
        setNewAd((prev) => ({
            ...prev,
            durationRules: prev.durationRules.filter((_, i) => i !== index),
        }));
    };

    const handleImageUpload = (e) => {
        setNewAd((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!newAd.activityId) newErrors.activityId = "Activitatea este obligatorie";
        if (!newAd.price) newErrors.price = "Prețul este obligatoriu";
        if (!newAd.minAge) newErrors.minAge = "Vârsta minimă este obligatorie";
        if (!newAd.maxAge) newErrors.maxAge = "Vârsta maximă este obligatorie";
        if (!newAd.totalSpots) newErrors.totalSpots = "Numărul de locuri este obligatoriu";
        if (!newAd.startDate) newErrors.startDate = "Data de început este obligatorie";
        if (!newAd.endDate) newErrors.endDate = "Data de sfârșit este obligatorie";
        if (!newAd.image) newErrors.image = "Imaginea este obligatorie";
        if (!newAd.durationRules || newAd.durationRules.length === 0) {
            newErrors.durationRules = "Regulile de durată sunt obligatorii";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdSubmit = async () => {
        if (!validateForm()) return;


        try {
            const response = await createAd(newAd.activityId, newAd);

            if (!response.success) {
                setError(response.error || "Anunțul nu a fost salvat.");
                return;
            }

            setOpenAdDialog(false);
            fetchAds();
        } catch (err) {
            setError("A apărut o eroare la salvarea anunțului.");
        }
    };

    return (
        <Box sx={{padding: 2}}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12} sm={4} md={3}>
                    <FilterMenu onFilterChange={handleFilterChange}/>
                </Grid2>

                <Grid2
                    xs={12}
                    sm={8}
                    md={9}
                    spacing={2}
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        flex: "auto",
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        paddingTop: '16px',
                        justifyContent: {xs: "center", md: "flex-start"},
                        width: "100%",
                        alignItems: "center",
                    }}>
                        <TextField
                            label="Căutare"
                            value={filters.title}
                            onChange={(e) => handleFilterChange({title: e.target.value})}
                            variant="outlined"
                            fullWidth
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel sx={{backgroundColor: "white", px: 1}}>Sortare după</InputLabel>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({sortBy: e.target.value})}
                            >
                                <MenuItem value="id">Cele mai recente</MenuItem>
                                <MenuItem value="price">Preț</MenuItem>
                                <MenuItem value="title">Titlu</MenuItem>
                                <MenuItem value="category">Categorie</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel sx={{backgroundColor: "white", px: 1}}>Direcție</InputLabel>
                            <Select
                                value={filters.sortDirection}
                                onChange={(e) => handleFilterChange({sortDirection: e.target.value})}
                            >
                                <MenuItem value="asc">Crescător</MenuItem>
                                <MenuItem value="desc">Descrescător</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>
                    <Box sx={{flexDirection: 'column', alignItems: 'flex-end', display: 'flex', width: '100%'}}>
                        <Button
                            variant="contained"
                            onClick={handleOpenAdDialog}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Adăugare anunț
                        </Button>
                    </Box>
                    {error && (
                        <Box sx={{ minHeight: { xs: "auto", md: "600px" } }}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    )}

                    {!error && !isLoading && ads.length > 0 && (
                        <>
                            {ads.map((ad, index) => (
                                <Grid2 xs={12} sm={6} md={4} key={ad.id}>
                                    <AdCard {...ad} imageUrl={images[ad.id]} />
                                </Grid2>
                            ))}

                            <Grid2
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 3,
                                    gap: { xs: "auto", sm: 2 },
                                }}
                            >
                                <Button
                                    variant="text"
                                    onClick={handlePreviousPage}
                                    disabled={filters.pageNumber === 0}
                                    startIcon={<ArrowBack />}
                                >
                                    Înapoi
                                </Button>
                                <Box
                                    sx={{
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Pagina {filters.pageNumber + 1}
                                </Box>
                                <Button
                                    variant="text"
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage}
                                    endIcon={<ArrowForward />}
                                >
                                    Înainte
                                </Button>
                            </Grid2>
                        </>
                    )}

                    {!error && !isLoading && ads.length === 0 && (
                        <Box sx={{ minHeight: { xs: "auto", md: "600px" } }}>
                            <Alert severity="info">Niciun anunț găsit!</Alert>
                        </Box>
                    )}
                </Grid2>
            </Grid2>
            <Dialog open={openAdDialog} onClose={handleCloseAdDialog} fullWidth maxWidth="sm">
                <DialogTitle>Adaugă anunț</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        sx={{mt:1}}
                        select
                        label="Activitate"
                        name="activityId"
                        value={newAd.activityId}
                        onChange={handleAdChange}
                        error={!!errors.activityId}
                        helperText={errors.activityId}
                        fullWidth
                    >
                        {dropdownActivities.map((activity) => (
                            <MenuItem key={activity.id} value={activity.id}>
                                {activity.title}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Preț (RON)"
                        name="price"
                        type="number"
                        value={newAd.price}
                        onChange={handleAdChange}
                        error={!!errors.price}
                        helperText={errors.price}
                        fullWidth
                    />
                    <TextField
                        label="Vârstă minimă"
                        name="minAge"
                        type="number"
                        value={newAd.minAge}
                        onChange={handleAdChange}
                        error={!!errors.minAge}
                        helperText={errors.minAge}
                        fullWidth
                    />
                    <TextField
                        label="Vârstă maximă"
                        name="maxAge"
                        type="number"
                        value={newAd.maxAge}
                        onChange={handleAdChange}
                        error={!!errors.maxAge}
                        helperText={errors.maxAge}
                        fullWidth
                    />
                    <TextField
                        label="Locuri disponibile"
                        name="totalSpots"
                        type="number"
                        value={newAd.totalSpots}
                        onChange={handleAdChange}
                        error={!!errors.totalSpots}
                        helperText={errors.totalSpots}
                        fullWidth
                    />
                    <TextField
                        label="Dată început"
                        name="startDate"
                        type="date"
                        value={newAd.startDate}
                        onChange={handleAdChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        fullWidth
                    />
                    <TextField
                        label="Dată sfârșit"
                        name="endDate"
                        type="date"
                        value={newAd.endDate}
                        onChange={handleAdChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        fullWidth
                    />
                    <Button variant="contained" onClick={addDurationRule} fullWidth>
                        Adaugă Regulă de Durată
                    </Button>

                    {newAd.durationRules?.map((rule, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                select
                                label="Zi"
                                name="day"
                                value={rule.day}
                                onChange={(e) => handleDurationRuleChange(index, "day", e.target.value)}
                                error={!!errors[`durationRules.${index}.day`]}
                                helperText={errors[`durationRules.${index}.day`]}
                                fullWidth
                            >
                                {Object.entries(Weekday).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Ora început"
                                name="startHour"
                                value={rule.startHour}
                                onChange={(e) => handleDurationRuleChange(index, "startHour", Number(e.target.value))}
                                error={!!errors[`durationRules.${index}.startHour`]}
                                helperText={errors[`durationRules.${index}.startHour`]}
                                fullWidth
                            >
                                {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                                    <MenuItem key={hour} value={hour}>
                                        {hour.toString().padStart(2, '0')}:00
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Număr de ore"
                                name="numberOfHours"
                                type="number"
                                value={rule.numberOfHours}
                                onChange={(e) => handleDurationRuleChange(index, "numberOfHours", Number(e.target.value))}
                                error={!!errors[`durationRules.${index}.numberOfHours`]}
                                helperText={errors[`durationRules.${index}.numberOfHours`]}
                                fullWidth
                            />
                            <Button variant="containedSecondary" onClick={() => removeDurationRule(index)}>
                                Șterge
                            </Button>
                        </Box>
                    ))}

                    {errors.durationRules && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errors.durationRules}
                        </Typography>
                    )}

                    <Button variant="contained" component="label">
                        Încarcă imagine (JPEG)
                        <input
                            type="file"
                            accept="image/jpeg"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </Button>
                    {errors.image && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errors.image}
                        </Typography>
                    )}
                    {newAd.image && (
                        <Box sx={{ fontSize: "0.9rem", color: "gray" }}>
                            Fișier selectat: {newAd.image.name}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdDialog}>Anulează</Button>
                    <Button onClick={handleAdSubmit} variant="contained">
                        Salvează
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};