import { GlobalDataContext } from "@/GlobalProvider.js";
import { useEffect, useContext } from "react";
import { fabric } from "fabric";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default NiceModal.create(({}) => {
  const modal = useModal();
  
  const { GlobalDispatch, GlobalState } = useContext(GlobalDataContext);
  const { pdfImg } = GlobalState;
  useEffect(() => {
    if (!!!pdfImg) {
      return;
    }
    if (!modal.visible) {
      return;
    }
    console.log("---", pdfImg);

    const canvas = new fabric.Canvas("canvas");
    canvas.requestRenderAll();
    canvas.setWidth(pdfImg.width / window.devicePixelRatio);
    canvas.setHeight(pdfImg.height / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImg, canvas.renderAll.bind(canvas));
  }, [pdfImg, modal.visible]);

  function handleClose() {
    modal.remove();
  }
  return (
    <>
      <Modal
        show={modal.visible}
        onHide={handleClose}
        fullscreen={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <canvas id="canvas"></canvas>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
