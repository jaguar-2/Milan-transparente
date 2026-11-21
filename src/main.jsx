import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import municipalBoundary from "./limite-milan.json";

const demo = [
  {
    id: 1,
    title: "Mejoramiento de vía rural (ejemplo)",
    status: "En ejecución",
    lat: 1.29,
    lng: -75.51,
    budget: "$850.000.000",
    progress: 65,
  },
  {
    id: 2,
    title: "Adecuación de espacio comunitario (ejemplo)",
    status: "Finalizada",
    lat: 1.31,
    lng: -75.5,
    budget: "Por definir",
    progress: 100,
  },
  {
    id: 3,
    title: "Solicitud de mantenimiento vial (ejemplo)",
    status: "Solicitada",
    lat: 1.28,
    lng: -75.49,
    budget: "Sin asignar",
    progress: 0,
  },
];
const colors = {
  "En ejecución": "#2563eb",
  Finalizada: "#16a34a",
  Pendiente: "#eab308",
  Solicitada: "#dc2626",
};
function App() {
  const mapNode = useRef(null),
    mapRef = useRef(null);
  const [projects] = useState(demo),
    [selected, setSelected] = useState(null),
    [filter, setFilter] = useState("Todas"),
    [tab, setTab] = useState("mapa"),
    [report, setReport] = useState(""),
    [notice, setNotice] = useState(""),
    [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (tab !== "mapa" || !mapNode.current) return;

    const bounds = new maplibregl.LngLatBounds();
    for (const ring of municipalBoundary.geometry.coordinates) {
      for (const point of ring) bounds.extend(point);
    }

    let map;
    try {
      map = new maplibregl.Map({
        container: mapNode.current,
        bounds,
        fitBoundsOptions: { padding: 35 },
        maxZoom: 19,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              maxzoom: 19,
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            },
            milan: {
              type: "geojson",
              data: municipalBoundary,
              attribution:
                'Límite municipal: <a href="https://www.igac.gov.co/datos-abiertos">IGAC</a>',
            },
          },
          layers: [
            { id: "osm", type: "raster", source: "osm" },
            {
              id: "municipio-relleno",
              type: "fill",
              source: "milan",
              paint: { "fill-color": "#047857", "fill-opacity": 0.14 },
            },
            {
              id: "municipio-borde",
              type: "line",
              source: "milan",
              paint: { "line-color": "#065f46", "line-width": 3 },
            },
          ],
        },
      });
    } catch {
      setNotice(
        "No se pudo abrir el mapa. Puedes consultar las obras en Proyectos.",
      );
      return;
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
    mapRef.current = map;
    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [tab]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = projects
      .filter((project) => filter === "Todas" || project.status === filter)
      .map((project) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "pin";
        button.style.background = colors[project.status];
        button.title = project.title;
        button.setAttribute("aria-label", project.title);
        button.addEventListener("click", () => setSelected(project));
        return new maplibregl.Marker({ element: button })
          .setLngLat([project.lng, project.lat])
          .addTo(map);
      });
    return () => markers.forEach((marker) => marker.remove());
  }, [tab, filter, projects]);

  function addReport(e) {
    e.preventDefault();
    setNotice(
      "Demostración: el reporte no se ha enviado. Para radicarlo se debe conectar la base de datos y la autenticación.",
    );
    setReport("");
  }
  return (
    <>
      <header>
        <div className="brand">
          🏛️{" "}
          <div>
            <b>MILÁN TRANSPARENTE</b>
            <small>Obras públicas · Milán, Caquetá</small>
          </div>
        </div>
        <span className="demo">PROTOTIPO NO OFICIAL</span>
      </header>
      <nav>
        <button
          onClick={() => setTab("mapa")}
          className={tab === "mapa" ? "active" : ""}
        >
          🗺️ Mapa
        </button>
        <button
          onClick={() => setTab("proyectos")}
          className={tab === "proyectos" ? "active" : ""}
        >
          🏗️ Proyectos
        </button>
        <button
          onClick={() => setTab("reportes")}
          className={tab === "reportes" ? "active" : ""}
        >
          📷 Reportar
        </button>
        <button
          onClick={() => setTab("admin")}
          className={tab === "admin" ? "active" : ""}
        >
          🔐 Admin
        </button>
      </nav>
      <main>
        <div className="stats">
          {["En ejecución", "Finalizada", "Pendiente", "Solicitada"].map(
            (s) => (
              <article key={s}>
                <strong>{projects.filter((p) => p.status === s).length}</strong>
                <span>{s}</span>
              </article>
            ),
          )}
        </div>
        {tab === "mapa" && (
          <>
            <h2>Mapa de proyectos</h2>
            <p>
              El contorno verde muestra el límite municipal de Milán, Caquetá
              (IGAC). Los marcadores indican ubicaciones de ejemplo.
            </p>
            <div className="filters">
              {["Todas", ...Object.keys(colors)].map((s) => (
                <button
                  aria-pressed={filter === s}
                  className={filter === s ? "active" : ""}
                  onClick={() => setFilter(s)}
                  key={s}
                >
                  {s}
                </button>
              ))}
            </div>
            <div ref={mapNode} className="map" />
          </>
        )}
        {tab === "proyectos" && (
          <>
            <h2>Proyectos municipales</h2>
            {projects.map((p) => (
              <article
                className="project"
                key={p.id}
                onClick={() => setSelected(p)}
              >
                <div>
                  <span
                    className="dot"
                    style={{ background: colors[p.status] }}
                  />
                  <b>{p.title}</b>
                </div>
                <small>
                  {p.status} · Avance {p.progress}% · {p.budget}
                </small>
              </article>
            ))}
          </>
        )}
        {tab === "reportes" && (
          <section>
            <h2>Reporte ciudadano</h2>
            <p>
              La recepción oficial de reportes estará disponible cuando se
              habilite el servidor institucional.
            </p>
            <form onSubmit={addReport}>
              <label>
                Descripción de la novedad
                <textarea
                  required
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Describa la novedad..."
                />
              </label>
              <label>
                Fotografías (vista previa)
                <input type="file" accept="image/*" multiple />
              </label>
              <button className="primary">Preparar reporte</button>
            </form>
          </section>
        )}
        {tab === "admin" && (
          <section>
            <h2>Administración municipal</h2>
            <p>
              Este prototipo no permite cambios oficiales. El acceso
              administrativo requerirá autenticación y roles verificados en el
              servidor.
            </p>
            <button onClick={() => setAdmin(!admin)}>
              {admin ? "Ocultar" : "Ver"} formulario de ejemplo
            </button>
            {admin && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice(
                    "Formulario de demostración. No se guardó ningún proyecto oficial.",
                  );
                }}
              >
                <label>
                  Nombre del proyecto
                  <input required placeholder="Nombre de la obra" />
                </label>
                <label>
                  Estado
                  <select>
                    {Object.keys(colors).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Coordenadas GPS
                  <input placeholder="Latitud, longitud" />
                </label>
                <label>
                  Documentos PDF
                  <input type="file" accept="application/pdf" multiple />
                </label>
                <button className="primary">Validar ejemplo</button>
              </form>
            )}
          </section>
        )}
        {selected && (
          <div className="overlay" onClick={() => setSelected(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="close" onClick={() => setSelected(null)}>
                ✕
              </button>
              <h2>{selected.title}</h2>
              <p>
                <span
                  className="dot"
                  style={{ background: colors[selected.status] }}
                />
                {selected.status}
              </p>
              <p>
                <b>Presupuesto:</b> {selected.budget}
              </p>
              <p>
                <b>Avance:</b> {selected.progress}%
              </p>
              <p>
                <b>GPS ilustrativo:</b> {selected.lat}, {selected.lng}
              </p>
              <p>
                Los contratos, informes y evidencias se mostrarán aquí cuando se
                carguen datos verificados.
              </p>
            </div>
          </div>
        )}
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button onClick={() => setNotice("")}>Cerrar</button>
          </div>
        )}
        <footer>
          Prototipo de desarrollo · No representa una publicación de la Alcaldía
          de Milán
        </footer>
      </main>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
