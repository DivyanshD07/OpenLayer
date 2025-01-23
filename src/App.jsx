import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [modalContent, setModalContent] = useState(null);

  return (
    <div className="App">
      <MapComponent setModalContent={setModalContent} />
      {modalContent && (
        <Modal content={modalContent} onClose={() => setModalContent(null)} />
      )}
    </div>
  );
}

export default App;
