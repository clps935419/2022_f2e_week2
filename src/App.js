import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routeConfig from "@/routes/index";
import Header from "@/components/Header";
// import "@/framework/styles/main.scss";
// import "@/styles/main.scss";

function App() {
  const routElement = useRoutes(routeConfig);

  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="content">{routElement}</div>
      </div>
    </>
  );
}

export default App;
