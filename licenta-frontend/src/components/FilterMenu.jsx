import {useState} from "react";
import {MenuItem, Select, TextField, FormControl, InputLabel, Box, Button} from "@mui/material";
import {ActivityCategory, Gender} from "../Enum";

export const FilterMenu = ({onFilterChange}) => {
    const initialFilters = {
        title: "",
        category: "",
        minAge: "",
        maxAge: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "id",
        sortDirection: "desc",
    };

    const [filters, setFilters] = useState(initialFilters);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const applyFilters = () => {
        onFilterChange(filters);
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        onFilterChange(initialFilters);
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} padding={2}>
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="category-select">Categorie</InputLabel>
                <Select
                    id="category-select"
                    label="Category"
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                >
                    <MenuItem value="">Toate</MenuItem>
                    <MenuItem value="ART">{ActivityCategory.ART}</MenuItem>
                    <MenuItem value="EDUCATION">{ActivityCategory.EDUCATION}</MenuItem>
                    <MenuItem value="LANGUAGE">{ActivityCategory.LANGUAGE}</MenuItem>
                    <MenuItem value="MUSIC">{ActivityCategory.MUSIC}</MenuItem>
                    <MenuItem value="EXAM_PREP">{ActivityCategory.EXAM_PREP}</MenuItem>
                    <MenuItem value="SPORTS">{ActivityCategory.SPORTS}</MenuItem>
                    <MenuItem value="SCIENCE">{ActivityCategory.SCIENCE}</MenuItem>
                    <MenuItem value="TECHNOLOGY">{ActivityCategory.TECHNOLOGY}</MenuItem>
                </Select>
            </FormControl>

            <TextField label="Vârstă minimă" name="minAge" type="number" value={filters.minAge} onChange={handleChange}
                       fullWidth/>
            <TextField label="Vârstă maximă" name="maxAge" type="number" value={filters.maxAge} onChange={handleChange}
                       fullWidth/>

            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="gender-select">Gen</InputLabel>
                <Select
                    id="gender-select"
                    label="Gen"
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                >
                    <MenuItem value="NEUTRAL">{Gender.NEUTRAL}</MenuItem>
                    <MenuItem value="MALE">{Gender.MALE}</MenuItem>
                    <MenuItem value="FEMALE">{Gender.FEMALE}</MenuItem>
                </Select>
            </FormControl>

            <TextField label="Preț minim" name="minPrice" type="number" value={filters.minPrice} onChange={handleChange}
                       fullWidth/>
            <TextField label="Preț maxim" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleChange}
                       fullWidth/>

            <Button variant="contained" onClick={applyFilters}>Aplică filtre</Button>

            <Button variant="text" color="primary" onClick={resetFilters}>
                Resetează filtrele
            </Button>
        </Box>
    );
};
