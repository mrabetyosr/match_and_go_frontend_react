import React from 'react';
import './Home.css'; // Assuming you have a CSS file for styling
import Header from '../../components/Header/Header.jsx';
import ExploreCompanies from '../../components/ExploreCampanies/ExploreCampanies.jsx';
import { useState } from 'react';
import DisplayCompanies from '../../components/DisplayCampanies/DisplayCampanies.jsx';
const Home = () => {
     const [category, setCategory] = useState("All");
  return (
    
    <div>
      <Header></Header>
      <ExploreCompanies category={category} setCategory={setCategory}></ExploreCompanies>
      <DisplayCompanies category={category} /> 
    </div>
  );
}

export default Home;
