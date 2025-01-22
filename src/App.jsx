import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [modalContent, setModalContent] = useState(null);

  const startDrawing = () => {
    setIsDrawing(true);
    setModalContent({
      type: "initial",
      message: "Start drawing on the map! Press Enter to finish.",
    });
  };

  const stopDrawing = (newCoordinates) => {
    setIsDrawing(false);
    setCoordinates(newCoordinates);
    setModalContent({
      type: "linestring",
      data: newCoordinates,
    });
  };

  return (
    <div className="App">
      <button onClick={startDrawing} className="draw-button">
        Draw on the Map
      </button>
      <MapComponent isDrawing={isDrawing} onStopDrawing={stopDrawing} />
      {modalContent && (
        <Modal content={modalContent} onClose={() => setModalContent(null)} />
      )}
    </div>
  );
}

export default App;