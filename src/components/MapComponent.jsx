import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Draw } from "ol/interaction";
import "ol/ol.css";

const MapComponent = ({ setModalContent }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [drawingData, setDrawingData] = useState({});
  const [lineCount, setLineCount] = useState(0);
  const [polygonCount, setPolygonCount] = useState(0);
  const [currentDrawingType, setCurrentDrawingType] = useState(null);
  const drawInteractionRef = useRef(null);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({ center: [0, 0], zoom: 2 }),
    });

    setMapInstance({ map, vectorSource });

    return () => map.setTarget(null);
  }, []);

  const startDrawing = (type) => {
    if (!mapInstance) return;
    const { map, vectorSource } = mapInstance;

    setCurrentDrawingType(type);

    const drawInteraction = new Draw({
      source: vectorSource,
      type,
    });

    map.addInteraction(drawInteraction);
    drawInteractionRef.current = drawInteraction;

    drawInteraction.on("drawstart", (event) => {
      const geometry = event.feature.getGeometry();
      geometry.on("change", () => {
        const coordinates = geometry.getCoordinates();
        if (type === "LineString") {
          // setModalContent({
          //   type: type.toLowerCase(),
          //   data: coordinates.map(coord => [coord[0].toFixed(2), coord[1].toFixed(2)]),
          // })
          const key = `linestring${lineCount + 1}`;
          setDrawingData((prev) => ({ ...prev, [key]: coordinates }));
        } else if (type === "Polygon") {
          // setModalContent({
          //   type: type.toLowerCase(),
          //   data: coordinates.map(coord => [coord[0].toFixed(2), coord[1].toFixed(2)]),
          // })
          const key = `polygon${polygonCount + 1}`;
          setDrawingData((prev) => ({ ...prev, [key]: coordinates[0] })); // Outer ring of the polygon
        }
      });
    });

    drawInteraction.on("drawend", () => {
      if (type === "LineString") {
        setLineCount((prev) => prev + 1);
      } else if (type === "Polygon") {
        setPolygonCount((prev) => prev + 1);
      }
      map.removeInteraction(drawInteraction);
      drawInteractionRef.current = null;
      setCurrentDrawingType(null);
      setIsDrawingComplete(true);
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && drawInteractionRef.current && mapInstance) {
        const { map } = mapInstance;
        map.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
        setCurrentDrawingType(null);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [mapInstance]);



  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "white",
          padding: "10px",
          zIndex: 1000,
        }}
      >
        <h3>Drawing Data</h3>
        <ul>
          {Object.entries(drawingData).map(([key, coordinates], index) => (
            <li key={index}>
              <strong>{key}:</strong>
              <ul>
                {coordinates.map((coord, i) => (
                  <li key={i}>
                    {`WP(${i + 1}): [${coord[0].toFixed(2)}, ${coord[1].toFixed(2)}]`}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <button onClick={() => startDrawing("LineString")}>
          Draw LineString
        </button>
        <button onClick={() => startDrawing("Polygon")}>
          Draw Polygon
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
