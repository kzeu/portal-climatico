import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapaItem({ file, titulo }) {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/maps/${file}`)
      .then(res => res.json())
      .then(json => setData(json));
  }, [file]);

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(feature.properties.NAME || "Região");
    }
  };

  return (
    <div className="map-section">

      <h3>{titulo}</h3>

      <div className="map-box">

        <MapContainer
          center={[12.1, -15.6]}
          zoom={7}
          style={{ height: "400px", width: "100%" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data && (
            <GeoJSON data={data} onEachFeature={onEachFeature} />
          )}

        </MapContainer>

      </div>

    </div>
  );
}

function Mapas_climatologia() {

  return (
    <div className="content">

      {/* HERO */}
      <div className="hero">
        <h1>Mapas de Climatologia</h1>

        <p>
          Sequência de mapas climáticos projetados para a Guiné-Bissau,
          com base nos dados do Climate Change Knowledge Portal.
        </p>
      </div>

      {/* MAPA 1 */}
      <MapaItem
        file="Temp_mean_2040_59.geojson"
        titulo="01 - Temperatura média projetada (2040–2059) - SSP5-8.5"
      />

      {/* MAPA 2 */}
      <MapaItem
        file="Temp_mean_2080_99.geojson"
        titulo="02 - Temperatura média projetada (2080–2099) - SSP5-8.5"
      />

      {/* MAPA 3 */}
      <MapaItem
        file="Precip_2040_59.geojson"
        titulo="03 - Precipitação projetada (2040–2059) - SSP5-8.5"
      />

      {/* MAPA 4 */}
      <MapaItem
        file="Precip_2080_99.geojson"
        titulo="04 - Precipitação projetada (2080–2099) - SSP5-8.5"
      />

      {/* ATTRIBUTION */}
      <div className="section attribution">

        <p>
          <b>Fonte:</b> World Bank Group – Climate Change Knowledge Portal (CCKP)
        </p>

        <p>
          Modelos climáticos SSP5-8.5, multi-model ensemble,
          período de referência 1995–2014.
        </p>

      </div>

    </div>
  );
}

export default Mapas_climatologia;