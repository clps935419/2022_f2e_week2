import { Route, Link, Routes, Navigate } from "react-router-dom";
import UploadPage from "@/pages/UploadPage";
import CreateSign from "@/pages/CreateSign";
import PDFEditPage from "@/pages/PDFEditPage";
import App from "@/App.js";
import RouterInterceptor from "@/routes/RouterInterceptor"; //攔截器


const routeConfig = [
  {
    path: "/",
    children: [
      { index: true, element: <Navigate to="/upload" /> },
      {
        path: "/createSign",
        element: <RouterInterceptor inner={<CreateSign />} />,
      },
      {
        path: "/pdfEdit",
        element: <RouterInterceptor inner={<PDFEditPage />} />,
      },
      {
        path: "/upload",
        element: <UploadPage />,
      },
    ],
  },
];
export default routeConfig;
