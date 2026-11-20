# Milán Transparente — prototipo v0.1

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
- El mapa usa un estilo público de demostración de MapLibre. Para producción se requiere un proveedor de teselas con capacidad adecuada y atribución.
- Todavía no hay base de datos, cuentas reales, recepción de reportes, subida de archivos ni límite municipal oficial.
- El panel admin es solo una maqueta: no modifica datos persistentes.

## Próxima fase

1. Obtener el polígono oficial del municipio (GeoJSON) de fuente cartográfica autorizada y comprobar sistema de coordenadas.
2. Configurar Supabase, tablas de proyectos, archivos, reportes, respuestas, auditoría y políticas RLS.
3. Implementar login y permisos verificados en servidor (admin vs ciudadano), almacenamiento privado/publicable y protección antispam.
4. Vincular el expediente público a los enlaces SECOP y establecer protocolo institucional de moderación y respuesta.
5. Probar accesibilidad, protección de datos y despliegue en dominio autorizado.
