import React, { useRef, useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

function MapComponent({ isDrawing, onStopDrawing }) {
  const mapRef = useRef(null);
  const sourceRef = useRef(new VectorSource());
  const mapInstanceRef = useRef(null);
  const [currentCoordinates, setCurrentCoordinates] = useState([]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: sourceRef.current,
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
    } else {
      mapInstanceRef.current.updateSize();
    }
  }, []);

  useEffect(() => {
    if (isDrawing) {
      const drawInteraction = new Draw({
        source: sourceRef.current,
        type: "LineString",
        stopClick: true,
      });
      mapInstanceRef.current.addInteraction(drawInteraction);

      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          drawInteraction.finishDrawing();
        }
      };

      const updateCoordinates = (event) => {
        const geometry = event.feature.getGeometry();
        setCurrentCoordinates(geometry.getCoordinates());
      };

      document.addEventListener("keydown", handleKeyDown);
      drawInteraction.on("drawstart", () => {
        setCurrentCoordinates([]);
      });
      drawInteraction.on("drawend", (event) => {
        const coordinates = event.feature.getGeometry().getCoordinates();
        onStopDrawing(coordinates);
        mapInstanceRef.current.removeInteraction(drawInteraction);
        document.removeEventListener("keydown", handleKeyDown);
      });
      drawInteraction.on("drawmove", updateCoordinates);

      return () => {
        mapInstanceRef.current.removeInteraction(drawInteraction);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isDrawing, onStopDrawing]);

  return (
    <div>
      <div ref={mapRef} className="map-container"></div>
      {isDrawing && (
        <div className="coordinate-list-overlay">
          <h3>Current Coordinates:</h3>
          <ul>
            {currentCoordinates.map((coord, index) => (
              <li key={index}>{`WP(${index + 1}): ${coord.join(", ")}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapComponent;
