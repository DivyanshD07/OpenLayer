import React from "react";
import "./Modal.css";

function Modal({ content, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        {content.type === "initial" ? (
          <p>{content.message}</p>
        ) : (
          <ul>
            {content.data.map((coord, index) => (
              <li key={index}>{`WP(${index + 1}): ${coord.join(", ")}`}</li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
