import { GlobalDataContext } from "@/GlobalProvider.js";
import { useEffect, useContext, useRef,useState } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";
import { message } from "antd";

function PDFEditPage() {
  const { GlobalDispatch, GlobalState } = useContext(GlobalDataContext);
  const { pdfImg, pdfImgArr, signImg, pageNo, record } = GlobalState;
  console.log("---", pdfImg, pdfImgArr, signImg, pageNo, record);
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
    canvas.current.clear();
    console.log("---", record, record[pageNo], pdfImg);
    
    if (record[pageNo]) {
      console.log('load')
      canvas.current.loadFromJSON(
        record[pageNo],
        canvas.current.renderAll.bind(canvas.current)
      );
    } else {
      canvas.current.setWidth(pdfImg.width / window.devicePixelRatio);
      canvas.current.setHeight(pdfImg.height / window.devicePixelRatio);
      canvas.current.setBackgroundImage(
        pdfImg,
        canvas.current.renderAll.bind(canvas.current)
      );
    }
      
    // 將 PDF 畫面設定為背景
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

    // 設定背景在 PDF 中的位置及大小
    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;

    for (let index = 0; index < pdfImgArr.length; index++) {
      if(index!==0){
        pdf.addPage();
      }
      console.log("record", record[index]);
      if(!!!record[index]){
        pdf.addImage(
          pdfImgArr[index].toDataURL("image/png"),
          "png",
          0,
          0,
          width,
          height
        );
      }else{
        pdf.addImage(record[index].url, "png", 0, 0, width, height);
      }
      console.log("***", pdfImgArr[index]);
      
    }
    // 將檔案取名並下載
    pdf.save("download.pdf");
  }
  function handleDelImg(){
    const object = canvas.current.getActiveObject();
    if (!object) {
      message.error("請選擇簽名");
      return "";
    }
    canvas.current.remove(object);
    message.success("刪除成功");
  }
  function handleDelAll() {
    const signArr = canvas.current.getObjects();
    if(signArr.length === 0){
      return;
    }
    signArr.forEach((item) => {
      canvas.current.remove(item);
    });
    message.success("刪除成功");
  }
  function handlePage(type){
    console.log("存檔", pageNo);
    GlobalDispatch({
      type: "setRecord",
      payload: {
        page: pageNo,
        content: canvas.current.toJSON(),
        url: canvas.current.toDataURL("image/png"),
      },
    });
    if(type==="add"){
      GlobalDispatch({
        type: "setPageNo",
        payload: { pageNo: pageNo + 1 },
      });
    }else{
      GlobalDispatch({
        type: "setPageNo",
        payload: { pageNo: pageNo - 1 },
      });
    }
  }

  return (
    <div className="pdf-edit-page">
      <canvas id="canvas"></canvas>
      <div className="pdf-edit-page__tool-bar">
        <div></div>
        <div>
          <button
            disabled={pageNo <= 0 }
            className="pdf-edit-page__big-btn"
            onClick={() => {
              handlePage("minus");
            }}
          >
            上一頁
          </button>
          <button
            disabled={pageNo + 1 >= pdfImgArr.length}
            className="pdf-edit-page__big-btn"
            onClick={() => {
              handlePage("add");
            }}
          >
            下一頁
          </button>
          <button className="pdf-edit-page__big-btn" onClick={handleDelAll}>
            刪除全部簽名檔
          </button>
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
