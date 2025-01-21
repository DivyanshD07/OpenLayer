import React, { useEffect } from 'react'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';

const MapComponent = () => {

    useEffect(() => {
        const map = new Map({
            view: new View({
                center: [0 , 0],
                zoom: 2,
            }),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            target: 'map-container',
        });

        map.on('click', function(e) {
            console.log(e.coordinate);
        })
        return () => {
            map.setTarget(null);
        };
    },[]);

    return <div id='map-container' style={{ width: '100%', height:'100vh' }} />;
}

export default MapComponent