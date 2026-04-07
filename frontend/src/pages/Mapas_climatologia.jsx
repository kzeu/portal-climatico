import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* =========================
   MAPA
========================= */
function MapaItem({ file, titulo, cores }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/maps/${file}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [file]);

  function getCodigo(props) {
    return props.code || "";
  }

  function getNome(props) {
    return props.adm1_name || "Região";
  }

  const style = (feature) => {
    const codigo = getCodigo(feature.properties);

    return {
      fillColor: cores[codigo] || "#ccc",
      color: "#333",
      weight: 1,
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const nome = getNome(feature.properties);

    layer.bindPopup(nome);

    layer.bindTooltip(nome, {
      permanent: false,
      direction: "center",
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ marginBottom: "10px" }}>{titulo}</h3>

      <MapContainer
        key={file}
        center={[12.1, -15.6]}
        zoom={8}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "10px",
        }}
      >
        {data && (
          <GeoJSON
            data={data}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}

/* =========================
   PRINCIPAL
========================= */
function Mapas_climatologia() {
  const [mapaSelecionado, setMapaSelecionado] = useState("1");

  const mapas = {
    "1": {
      file: "Temp_mean_2040_59.geojson",
      titulo: "Temperatura média (2040–2059)",
    },
    "2": {
      file: "Temp_mean_2080_99.geojson",
      titulo: "Temperatura média (2080–2099)",
    },
    "3": {
      file: "Precip_2040_59.geojson",
      titulo: "Precipitação (2040–2059)",
    },
    "4": {
      file: "Precip_2080_99.geojson",
      titulo: "Precipitação (2080–2099)",
    },
  };

  const coresPorMapa = {
    "1": {
      "GNB.1051385": "#cc191d",
      "GNB.1051386": "#fdc6af",
      "GNB.1051387": "#ffffff",
      "GNB.1051388": "#fee3d6",
      "GNB.1051389": "#a91016",
      "GNB.1051390": "#ea372a",
      "GNB.1051391": "#fc8161",
      "GNB.1051392": "#fca486",
      "GNB.1051393": "#f85d42",
    },
    "2": {
      "GNB.1051385": "#d7191c",
      "GNB.1051386": "#f4a582",
      "GNB.1051387": "#f7f7f7",
      "GNB.1051388": "#fddbc7",
      "GNB.1051389": "#b2182b",
      "GNB.1051390": "#ef3b2c",
      "GNB.1051391": "#fb6a4a",
      "GNB.1051392": "#fcae91",
    },
    "3": {
      "GNB.1051385": "#d8c49c",
      "GNB.1051386": "#62a84a",
      "GNB.1051387": "#3f7f2f",
      "GNB.1051388": "#5ea646",
      "GNB.1051389": "#a6611a",
      "GNB.1051390": "#bf8c4a",
      "GNB.1051391": "#a9cba0",
      "GNB.1051392": "#7fbf6a",
      "GNB.1051393": "#e6d7b8",
    },
    "4": {
      "GNB.1051385": "#9ec28f",
      "GNB.1051386": "#7fc466",
      "GNB.1051387": "#f7f7f7",
      "GNB.1051388": "#79bf5f",
      "GNB.1051389": "#5aa03c",
      "GNB.1051390": "#a7cfa0",
      "GNB.1051391": "#c28a3a",
      "GNB.1051392": "#e6d7b8",
      "GNB.1051393": "#a6611a",
    },
  };

  return (
    <div className="content" id="content">
      {/* HERO */}
      <div className="hero">
        <h1>Mapas de Climatologia</h1>
        <p>
          Visualização das projeções climáticas para a Guiné-Bissau,
         
        </p>
      </div>

      {/* SELECT */}
      <div style={{ marginTop: "10px" }}>
        <select
          value={mapaSelecionado}
          onChange={(e) => setMapaSelecionado(e.target.value)}
          style={{
            width: "280px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        >
          <option value="1">Temperatura 2040–2059</option>
          <option value="2">Temperatura 2080–2099</option>
          <option value="3">Precipitação 2040–2059</option>
          <option value="4">Precipitação 2080–2099</option>
        </select>
      </div>

      {/* MAPA */}
      <MapaItem
        file={mapas[mapaSelecionado].file}
        titulo={mapas[mapaSelecionado].titulo}
        cores={coresPorMapa[mapaSelecionado]}
      />
    </div>
  );
}

export default Mapas_climatologia;