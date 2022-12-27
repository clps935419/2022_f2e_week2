import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routeConfig from "@/routes/index";
import Header from "@/components/Header";
import { useEffect, useContext } from "react";
import { GlobalDataContext } from "@/GlobalProvider.js";


function App() {
  const routElement = useRoutes(routeConfig);
  const { GlobalState } = useContext(GlobalDataContext);
  console.log("🚀 ~ file: App.js:12 ~ App ~ GlobalState", GlobalState)
  const { isLoading } = GlobalState;
  console.log("🚀 ~ file: App.js:13 ~ App ~ isLoading", isLoading)
  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="content">{routElement}</div>
      </div>
      {isLoading && (
        <div className="loading-mask">
          <div>...上傳中</div>
        </div>
      )}
    </>
  );
}

export default App;
