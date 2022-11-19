import React, { useRef, useContext } from "react";
import { useEffect } from "react";
import { GlobalDataContext } from "@/GlobalProvider.js";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import Form from "react-bootstrap/Form";

function CreateSign() {
  const canvas = useRef(null);
  const ctx = useRef(null);
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const { GlobalDispatch } = useContext(GlobalDataContext);
  const props = {
    name: "file",
    multiple: false,
    onChange: async (e) => {
      console.log("in", e.target.files);
      const signData = await toBase64(e.target.files[0]);
      
      console.log(
        "🚀 ~ file: App.js ~ line 29 ~ onChange: ~  pdfData ",
        signData
      );
      GlobalDispatch({
        type: "setSignImg",
        payload: { signImg: signData },
      });
      navigate("/pdfEdit");
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  let isPainting = false;
  useEffect(() => {
    ctx.current = canvas.current.getContext("2d");
    ctx.current.lineWidth = 4;
    ctx.current.lineCap = "round";
    canvas.current.addEventListener("mousedown", startPosition);
    canvas.current.addEventListener("mouseup", finishedPosition);
    canvas.current.addEventListener("mouseleave", finishedPosition);
    canvas.current.addEventListener("mousemove", draw);
    return () => {
      // canvas.current.removeEventListener("mousedown", startPosition);
      // canvas.current.removeEventListener("mouseup", finishedPosition);
      // canvas.current.removeEventListener("mouseleave", finishedPosition);
      // canvas.current.removeEventListener("mousemove", draw);
    };
  }, []);

  function toBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }


  // 重新設定畫布
  // 取得滑鼠 / 手指在畫布上的位置
  function getPaintPosition(e) {
    const canvasSize = canvas.current.getBoundingClientRect();
    console.log("🚀 ~ file: CreateSign.js ~ line 67 ~ getPaintPosition ~ canvasSize", canvasSize)

    if (e.type === "mousemove") {
      return {
        x: e.clientX - canvasSize.left,
        y: e.clientY - canvasSize.top,
      };
    } else {
      return {
        x: e.touches[0].clientX - canvasSize.left,
        y: e.touches[0].clientY - canvasSize.top,
      };
    }
  }

  // 開始繪圖時，將狀態開啟
  function startPosition(e) {
    e.preventDefault();
    isPainting = true;
  }

  // 結束繪圖時，將狀態關閉，並產生新路徑
  function finishedPosition() {
    isPainting = false;
    ctx.current.beginPath();
  }

  // 繪圖過程
  function draw(e) {
    // 滑鼠移動過程中，若非繪圖狀態，則跳出
    if (!isPainting) return;

    // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
    const paintPosition = getPaintPosition(e);

    // 移動滑鼠位置並產生圖案
    ctx.current.lineTo(paintPosition.x, paintPosition.y);
    ctx.current.stroke();
  }
  function reset() {
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }
  function saveImage() {
    // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
    const newImg = canvas.current.toDataURL("image/png");
    // imgRef.current.src = newImg;
    GlobalDispatch({
      type: "setSignImg",
      payload: { signImg: newImg },
    });
    navigate("/pdfEdit");
  }

  return (
    <>
      <div className="create-sign-page">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="手寫簽名" key="1">
            <div className="create-sign__color-picker">
              <div className="color-input-wrapper">
                <Form.Control
                  type="color"
                  id="exampleColorInput"
                  defaultValue="#000000"
                  title="Choose your color"
                />
              </div>
              <div className="color-input-wrapper">
                <Form.Control
                  type="color"
                  id="exampleColorInput"
                  defaultValue="#0014C7"
                  title="Choose your color"
                />
              </div>
              <div className="color-input-wrapper">
                <Form.Control
                  type="color"
                  id="exampleColorInput"
                  defaultValue="#CA0000"
                  title="Choose your color"
                />
              </div>
            </div>
            <div className="create-sign__box">
              <canvas
                ref={canvas} // ADDED
                width="400"
                height="200"
              />
            </div>
            <div className="create-sign__btns">
              <button className="create-sign__btn-clear" onClick={reset}>
                清除
              </button>
              <button className="create-sign__btn-save" onClick={saveImage}>
                存檔
              </button>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="匯入簽名檔" key="2">
            <div className="file-drop-area">
              <span className="fake-btn">選擇檔案</span>
              <span className="file-msg">或拖曳檔案到此處</span>
              <input className="file-input" type="file" multiple {...props} />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* <h1>create sign</h1>
      

      <canvas
        ref={canvas} // ADDED
        width="500"
        height="300"
        style={{ border: "1px solid black" }}
      />
      <img ref={imgRef}  alt="" /> */}
    </>
  );
}

export default CreateSign;
