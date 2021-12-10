import React from 'react';
import { Button, Stack } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TodayIcon from '@mui/icons-material/Today';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Home = () => {

    return (
        <Stack alignItems="center" justifyContent="center">
            <HomeOutlinedIcon color="info" sx={{
                m: 5,
                fontSize: 300
            }} />
            <Stack alignItems="center" justifyContent="center" direction="row" spacing={2} sx={{m:5}}>
                <Button variant="outlined" href="/customers"><PersonIcon />Customers</Button>
                <Button variant="outlined" href="/trainings"><FitnessCenterIcon />Trainings</Button>
                <Button variant="outlined" href="/calendar"><TodayIcon />Calendar</Button>
                <Button variant="outlined" href="/statistics"><BarChartIcon />Statistics</Button>
            </Stack>
            <Button variant="outlined" color="error" onClick={() => {
                fetch(global.ApiURL + "/reset", {method: "post"})
            }}><RestartAltIcon />Reset</Button>
        </Stack>
    )

}

export default Home;