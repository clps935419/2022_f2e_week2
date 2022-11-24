import { GlobalDataContext } from "@/GlobalProvider.js";
import { useEffect, useContext, useRef } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";
import { message } from "antd";

function PDFEditPage() {
  const { GlobalDispatch, GlobalState } = useContext(GlobalDataContext);
  const { pdfImg, signImg } = GlobalState;
  const canvas = useRef(null);
  const pdf = new jsPDF();
  useEffect(() => {
    if (canvas.current !== null) {
      return;
    }
    canvas.current = new fabric.Canvas("canvas");
  }, []);
  useEffect(() => {
    if (!!!pdfImg) {
      return;
    }
    console.log("---", pdfImg);
    canvas.current.setWidth(pdfImg.width / window.devicePixelRatio);
    canvas.current.setHeight(pdfImg.height / window.devicePixelRatio);
    // 將 PDF 畫面設定為背景
    canvas.current.setBackgroundImage(
      pdfImg,
      canvas.current.renderAll.bind(canvas.current)
    );
  }, [pdfImg]);

  function handlePutSign() {
    console.log("***", signImg);
    fabric.Image.fromURL(signImg, function (image) {
      // 設定簽名出現的位置及大小，後續可調整
      image.top = 100;
      image.left = 100;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      console.log("img", image);
      canvas.current.add(image);
    });
  }
  function handleDownload() {
    const image = canvas.current.toDataURL("image/png");

    // 設定背景在 PDF 中的位置及大小
    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    pdf.addImage(image, "png", 0, 0, width, height);

    // 將檔案取名並下載
    pdf.save("download.pdf");
  }
  function handleDelImg(){
    const object = canvas.current.getActiveObject();
    if (!object) {
      message.error("請選擇簽名");
      return "";
    }
    message.success("刪除成功");
    canvas.current.remove(object);
  }

  return (
    <div className="pdf-edit-page">
      <canvas id="canvas"></canvas>
      <div className="pdf-edit-page__tool-bar">
        <div></div>
        <div>
          <button className="pdf-edit-page__big-btn" onClick={handleDelImg}>
            刪除簽名檔
          </button>
          <button className="pdf-edit-page__big-btn" onClick={handlePutSign}>
            放上簽名檔
          </button>
          <button className="pdf-edit-page__big-btn" onClick={handleDownload}>
            下載
          </button>
        </div>
      </div>
    </div>
  );
}
export default PDFEditPage;
