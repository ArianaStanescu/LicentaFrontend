import {useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import {FilterMenu} from "../../components/FilterMenu";
import {AdCard} from "../../components/AdCard";
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from "@mui/material";
import {search} from "../../api/ads/search";
import {getAdImage} from "../../api/ads/getAdImage";
import {ArrowBack, ArrowForward} from "@mui/icons-material";

export const HomePageParent = () => {
    const [ads, setAds] = useState([]);
    const [images, setImages] = useState({});
    const [error, setError] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(true);

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
            const ads = await search(filters);
            setAds(ads || []);
            setHasNextPage(ads.length === filters.pageSize);
        } catch (err) {
            setError("Failed to load ads. Please try again.");
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

    // const handleFilterChange = (newFilters) => {
    //     setFilters({...newFilters, pageNumber: 0, pageSize: 5});
    // };
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
                    container
                    spacing={2}
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "auto",
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        paddingTop: '16px',
                        justifyContent: {xs: "center", md: "flex-start"},
                        width: "100%"
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
                    {error ? (
                        <Box sx={{
                            minHeight: {xs: "auto", md: "600px"}
                        }}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    ) : (
                        ads.length > 0 ? (
                            <>
                                {ads.map((ad, index) => (
                                    <Grid2 xs={12} sm={6} md={4} key={ad.id}>
                                        <AdCard {...ad} imageUrl={images[ad.id]}/>
                                    </Grid2>
                                ))}

                                <Grid2 xs={12}
                                       sx={{
                                           display: "flex",
                                           justifyContent: "space-between",
                                           mt: 3,
                                           gap: {xs: "auto", sm: 6},
                                       }}>
                                    <Button
                                        variant="text"
                                        onClick={handlePreviousPage}
                                        disabled={filters.pageNumber === 0}
                                        startIcon={<ArrowBack/>}
                                    >
                                        Înapoi
                                    </Button>
                                    <Box sx={{
                                        fontSize: "1.2rem", fontWeight: "bold",
                                        textAlign: "center", display: "flex", alignItems: "center"
                                    }}>
                                        Pagina {filters.pageNumber + 1}
                                    </Box>
                                    <Button
                                        variant="text"
                                        onClick={handleNextPage}
                                        disabled={!hasNextPage}
                                        endIcon={<ArrowForward/>}
                                    >
                                        Înainte
                                    </Button>
                                </Grid2>
                            </>
                        ) : (
                            <Box sx={{
                                minHeight: {xs: "auto", md: "600px"}
                            }}>
                                <Alert severity="info">Niciun anunț găsit!</Alert>
                            </Box>
                        )
                    )}
                </Grid2>
            </Grid2>
        </Box>
    );
};


