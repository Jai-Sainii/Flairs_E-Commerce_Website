import React from "react";
import Hero from "../components/Hero";
import FeaturedIn from "../components/FeaturedIn";
import NewsLetter from "./NewsLetter";
import PromoSections from "./PromoSections";
import Categories from "./Categories";

const Home = () => {

  return (
    <div>
      <Hero />
      <FeaturedIn />
      <Categories />
      <PromoSections />
      <NewsLetter />
    </div>
  );
};

export default Home;
