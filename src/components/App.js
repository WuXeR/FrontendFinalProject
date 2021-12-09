import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import Customers from './Customers';
import Trainings from './Trainings';
import Calendar from './Calendar';
import Statistics from './Statistics';
import Home from './Home';

import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TodayIcon from '@mui/icons-material/Today';
import BarChartIcon from '@mui/icons-material/BarChart';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/trainings' element={<Trainings />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/statistics' element={<Statistics />} />
        </Routes>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation showLabels sx={{backgroundColor: '#1e1e1f', color: '#fff'}}>
            <BottomNavigationAction component={Link} to="/customers" label="Customers" icon={<PersonIcon />} sx={{color: '#fff'}} />
            <BottomNavigationAction component={Link} to="/trainings" label="Trainings" icon={<FitnessCenterIcon />} sx={{color: '#fff'}} />
            <BottomNavigationAction component={Link} to="/calendar" label="Calendar" icon={<TodayIcon />} sx={{color: '#fff'}} />
            <BottomNavigationAction component={Link} to="/statistics" label="Statistics" icon={<BarChartIcon />} sx={{color: '#fff'}} />
          </BottomNavigation>
        </Paper>
      </Router>
    </>
    );
}

export default App;
global.ApiURL = "https://customerrest.herokuapp.com";