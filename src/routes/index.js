import { Route, Link, Routes, Navigate } from "react-router-dom";
import UploadPage from "@/pages/UploadPage";
import CreateSign from "@/pages/CreateSign";
import PDFEditPage from "@/pages/PDFEditPage";

const routeConfig = [
  {
    path: "/",
    element: <UploadPage />,
    index: true,
  },
  {
    path: "/createSign",
    element: <CreateSign />,
  },
  {
    path: "/pdfEdit",
    element: <PDFEditPage />,
  },
];
export default routeConfig;
