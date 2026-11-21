# Milán Transparente — prototipo v0.2

Interfaz móvil instalable de demostración para visualizar proyectos y reportes de obras públicas de Milán, Caquetá, Colombia.

## Ejecutar

```bash
npm install
npm run dev
```

Para publicar: `npm run build` y desplegar `dist/` en un alojamiento HTTPS.

## Importante

- NO es una aplicación oficial ni está afiliada a la Alcaldía.
- Los tres proyectos y sus coordenadas son datos ficticios de prueba, no ubicaciones verificadas de obras.
- El mapa usa teselas de [OpenStreetMap](https://www.openstreetmap.org/copyright). Antes de un despliegue de alto tráfico, revisa la [política de uso de teselas](https://operations.osmfoundation.org/policies/tiles/).
- Todavía no hay base de datos, cuentas reales, recepción de reportes ni subida de archivos.
- El panel admin es solo una maqueta: no modifica datos persistentes.

## Límite municipal

El polígono de Milán, Caquetá (DIVIPOLA 18460), se incluye en `src/limite-milan.json`. Proviene de la cartografía del Instituto Geográfico Agustín Codazzi (IGAC), consultada en la capa [Límite Municipal 2026](https://services5.arcgis.com/omnq4yUY2D8TpiDa/ArcGIS/rest/services/Limite_Municipal_2026/FeatureServer/0). Se extrajo exclusivamente el municipio 18460 y se exportó a longitud y latitud WGS 84 con seis decimales. La geometría se contrastó con [otra publicación de la capa](https://services6.arcgis.com/ARnWHF07NljOM25Z/ArcGIS/rest/services/Limite_Municipal/FeatureServer/0).

## Próxima fase

1. Configurar Supabase, tablas de proyectos, archivos, reportes, respuestas, auditoría y políticas RLS.
2. Implementar login y permisos verificados en servidor (admin vs ciudadano), almacenamiento privado/publicable y protección antispam.
3. Vincular el expediente público a los enlaces SECOP y establecer protocolo institucional de moderación y respuesta.
4. Probar accesibilidad, protección de datos y despliegue en dominio autorizado.
