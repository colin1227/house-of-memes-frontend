import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";

import "./SearchBar.scss";
import vars from "../../constants/vars";

const SearchBar = (props: any) => {
  const [searchTerm, editSearchTerm] = useState('');
  const [results, editResults] = useState([]);

  const queryBySearchTerm = async(term: string ) => {
    const request = await axios.get(`${vars.apiURL}/search/meme/${term}`);
    editResults(request.data.options.map((r: Object) => {
      return { ...r}
    }));
  }

  const changeSearchTerm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    editSearchTerm(event.target.value);
    if (event.target.value.length) {
      queryBySearchTerm(event.target.value);
    }
  }

  const openMeme = (term: string) => {
    const options = results.filter((f: any) => f.label === term);
    if(options.length > 0) {
      props.addSearchedMeme(options[0]);
    }
  }

  return (
    <div className="search-component">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off">
          <Autocomplete
            value={searchTerm}
            className="search-bar"
            id="combo-box-demo"
            options={results}
            onChange={(v:any) => openMeme(v.target.innerText)}
            sx={{ width: "100" }}
            renderInput={(params) => {
              return <TextField
                {...params}
                value={searchTerm}
                className="search-bar"
                onChange={(event: any) => changeSearchTerm(event)}
                label="Search"
                id="standard-search"
                variant="standard" />
            }}
          />
        </Box>
    </div>
  )
}

export default SearchBar;