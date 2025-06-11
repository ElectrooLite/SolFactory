import React from "react";
import ClientOnly from "../components/ClientOnly";

import HowToUseGuide from "../components/HowToUseGuide";
import MainComponent from "../components/token-creator/MainComponent";

const HomePage = () => {
  return (
    <ClientOnly>
      <>
        <MainComponent />
        <HowToUseGuide />

    
      </>
    </ClientOnly>
  );
};

export default HomePage;
