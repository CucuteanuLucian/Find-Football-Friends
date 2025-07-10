import { useState, useEffect } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import api from "../../api";
import { debounce } from "lodash";

const SearchTeam = ({ onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debouncedFetch = debounce(async (query) => {
      if (!query) {
        setTeams([]);
        return;
      }

      try {
        const response = await api.get(`/api/teams/?search=${query}`);
        setTeams(response.data);
      } catch (error) {
        console.error("Eroare la fetch echipe:", error);
      }
    }, 500);

    debouncedFetch(searchTerm);

    return () => debouncedFetch.cancel();
  }, [searchTerm]);

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: { xs: "65vw", sm: "45vw", md: "25vw" },
      }}
    >
      <Autocomplete
        options={teams}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => onTeamSelect?.(newValue)}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box sx={{ width: 30, height: 30 }}>
              <img
                src={option.logo}
                alt={option.name}
                style={{ height: "100%" }}
              />
            </Box>
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for team..."
            sx={{
              height: { xs: 30, sm: 35, md: 40 },
              "& .MuiInputBase-root": {
                height: "100%",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiOutlinedInput-input": {
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default SearchTeam;
