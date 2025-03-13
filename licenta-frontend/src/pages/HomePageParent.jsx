import {useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import {FilterMenu} from "../components/FilterMenu";
import {CardComponent} from "../components/CardComponent";
import {Alert, Box, CircularProgress, Button} from "@mui/material";
import {search} from "../api/ads/search";
import {getAdImage} from "../api/ads/getAdImage";

export const HomePageParent = () => {
    const [ads, setAds] = useState([]);
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(true);

    const [filters, setFilters] = useState({
        // title: "",
        category: "",
        minAge: "",
        maxAge: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        pageNumber: 0,
        pageSize: 5,
        // sortDirection: "desc"
    });

    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            const ads = await search(filters);
            setAds(ads || []);
            setHasNextPage(ads.length === filters.pageSize);
        } catch (err) {
            setError("Failed to load ads. Please try again.");
        } finally {
            setLoading(false);
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

    const handleFilterChange = (newFilters) => {
        setFilters({...newFilters, pageNumber: 0, pageSize: 5});
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
                <Grid2 item xs={12} sm={4} md={3}>
                    <FilterMenu onFilterChange={handleFilterChange}/>
                </Grid2>

                <Grid2
                    item
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
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", left: 120, transform: "translateX(-50%)" }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        ads.length > 0 ? (
                            <>
                                {ads.map((ad, index) => (
                                    <Grid2 item xs={12} sm={6} md={4} key={ad.id}>
                                        <CardComponent {...ad} imageUrl={images[ad.id]}/>
                                    </Grid2>
                                ))}

                                <Grid2 item xs={12}
                                       sx={{display: "flex", justifyContent: "space-between", mt: 3, gap: 8}}>
                                    <Button
                                        variant="text"
                                        onClick={handlePreviousPage}
                                        disabled={filters.pageNumber === 0}
                                    >
                                        Pagina anterioară
                                    </Button>

                                    <Button
                                        variant="text"
                                        onClick={handleNextPage}
                                        disabled={!hasNextPage}
                                    >
                                        Pagina următoare
                                    </Button>
                                </Grid2>
                            </>
                        ) : (
                            <Alert severity="info">Niciun anunț găsit!</Alert>
                        )
                    )}
                </Grid2>
            </Grid2>
        </Box>
    );
};


