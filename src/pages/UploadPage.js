import React from "react";
import "antd/dist/antd.css";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useRef } from "react";
import { fabric } from "fabric";
import { pdfjs, Document, Page } from "react-pdf";
import { useEffect, useContext } from "react";
import { GlobalDataContext } from "@/GlobalProvider.js";
import PDFEditModal from "@/components/PDFEditModal";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const { Dragger } = Upload;
const Base64Prefix = "data:application/pdf;base64,";
function UploadPage() {
  const { GlobalDispatch } = useContext(GlobalDataContext);
  const navigate = useNavigate();

  const props = {
    name: "file",
    multiple: false,
    accept:"image/*,.pdf",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange: async (e) => {
      const pdfImgArr = [];
      const { pdfDoc, totalPdfPage } = await printPDFInfo(e.target.files[0]);
      console.log("totalPdfPage", totalPdfPage);
      for (let index = 1; index <= totalPdfPage; index++) {
        const pdfData = await printPDF({ pdfDoc ,page:index});
        const pdfImage = await pdfToImage(pdfData);
        pdfImgArr.push(pdfImage);
        console.log(
          "🚀 ~ file: UploadPage.js:33 ~ onChange: ~ pdfImage",
          pdfImage
        );
      }
      console.log(
        "🚀 ~ file: App.js ~ line 29 ~ onChange: ~  ppdfImgArr ",
        pdfImgArr
      );
      GlobalDispatch({
        type: "setPDFImgArr",
        payload: { pdfImgArr: pdfImgArr },
      });
      navigate("/createSign");
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <div className="upload-page">
        <div className="upload__box">
          <div className="upload__box-left">
            <div className="upload__describe">
              響應無紙化的電子簽核，省時便利又環保。
            </div>
          </div>
          <div className="upload__box-right">
            <div className="file-drop-area">
              <span className="fake-btn">選擇檔案</span>
              <span className="file-msg">或拖曳檔案到此處</span>
              <span className="file-msg2">(限10MB 內的PDF或圖片檔)</span>
              <input className="file-input" type="file" multiple {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}
async function printPDF({pdfDoc,page}) {
  const pdfPage = await pdfDoc.getPage(page);
  // 設定尺寸及產生 canvas
  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 設定 PDF 所要顯示的寬高及渲染
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: context,
    viewport,
  };
  const renderTask = pdfPage.render(renderContext);

  // 回傳做好的 PDF canvas
  return renderTask.promise.then(() => canvas);
}
async function printPDFInfo(pdfData) {
  // 將檔案處理成 base64
  pdfData = await readBlob(pdfData);

  // 將 base64 中的前綴刪去，並進行解碼
  const data = atob(pdfData.substring(Base64Prefix.length));

  // 利用解碼的檔案，載入 PDF 檔及第一頁
  const pdfDoc = await pdfjs.getDocument({ data }).promise;
  const totalPdfPage = pdfDoc._pdfInfo.numPages;
  return {
    pdfDoc,
    totalPdfPage
  }
}

async function pdfToImage(pdfData) {
  // 設定 PDF 轉為圖片時的比例
  const scale = 1 / window.devicePixelRatio;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderPDF",
    scaleX: scale,
    scaleY: scale,
  });
}

export default UploadPage;
