import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawType, setDrawType] = useState("LineString");
  const [coordinates, setCoordinates] = useState([]);
  const [modalContent, setModalContent] = useState(null);

  const startDrawing = (type) => {
    setIsDrawing(true);
    setDrawType(type);
    setModalContent({
      type: "initial",
      message: `Start drawing a ${type.toLowerCase()} on the map! Press Enter to finish.`,
    });
  };

  const stopDrawing = (newCoordinates) => {
    setIsDrawing(false);
    setCoordinates(newCoordinates);
    setModalContent({
      type: drawType.toLowerCase(),
      data: newCoordinates,
    });
  };

  return (
    <div className="App">
      <MapComponent isDrawing={isDrawing} drawType={drawType} onStopDrawing={stopDrawing} />
      {modalContent && (
        <Modal content={modalContent} onClose={() => setModalContent(null)} />
      )}
    </div>
  );
}

export default App;