export const comunasByRegion: Record<string, string[]> = {
  "Región Metropolitana": [
    "Santiago Centro", "Providencia", "Las Condes", "Ñuñoa", "La Florida",
    "Maipú", "Puente Alto", "Vitacura", "Lo Barnechea", "San Miguel",
    "Macul", "La Reina", "Peñalolén", "Huechuraba", "Independencia",
    "Recoleta", "Quilicura", "Cerrillos", "Estación Central", "San Bernardo",
  ],
  "Valparaíso": [
    "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón",
    "San Antonio", "Quillota", "La Calera", "Limache", "Los Andes",
  ],
  "Biobío": [
    "Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel",
    "Hualpén", "San Pedro de la Paz", "Tomé", "Penco", "Lota",
  ],
  "Araucanía": [
    "Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol",
    "Victoria", "Nueva Imperial", "Lautaro", "Carahue", "Pitrufquén",
  ],
  "Los Lagos": [
    "Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud",
    "Calbuco", "Frutillar", "Llanquihue", "Quellón", "Dalcahue",
  ],
  "O'Higgins": [
    "Rancagua", "San Fernando", "Rengo", "Machalí", "Graneros",
    "Santa Cruz", "Pichilemu", "San Vicente", "Requínoa", "Olivar",
  ],
  "Maule": [
    "Talca", "Curicó", "Linares", "Constitución", "Cauquenes",
    "Molina", "San Javier", "Parral", "San Clemente", "Teno",
  ],
  "Coquimbo": [
    "La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña",
    "Andacollo", "Tongoy", "Monte Patria", "Combarbalá", "Salamanca",
  ],
  "Antofagasta": [
    "Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal",
    "San Pedro de Atacama", "María Elena", "Sierra Gorda",
  ],
  "Los Ríos": [
    "Valdivia", "La Unión", "Río Bueno", "Panguipulli", "Los Lagos",
    "Futrono", "Corral", "Lanco", "Máfil", "Mariquina",
  ],
};

// Approximate lat/lng for comunas (for map display)
export const comunaCoordinates: Record<string, { lat: number; lng: number }> = {
  "Santiago Centro": { lat: -33.4489, lng: -70.6693 },
  "Providencia": { lat: -33.4264, lng: -70.6109 },
  "Las Condes": { lat: -33.4073, lng: -70.5877 },
  "Ñuñoa": { lat: -33.4569, lng: -70.5981 },
  "La Florida": { lat: -33.5169, lng: -70.5882 },
  "Maipú": { lat: -33.5117, lng: -70.7573 },
  "Puente Alto": { lat: -33.6117, lng: -70.5756 },
  "Vitacura": { lat: -33.3942, lng: -70.5712 },
  "Lo Barnechea": { lat: -33.3508, lng: -70.5142 },
  "San Miguel": { lat: -33.4978, lng: -70.6517 },
  "Viña del Mar": { lat: -33.0153, lng: -71.5503 },
  "Valparaíso": { lat: -33.0472, lng: -71.6127 },
  "Quilpué": { lat: -33.0472, lng: -71.4424 },
  "Concón": { lat: -32.9272, lng: -71.5225 },
  "Concepción": { lat: -36.8270, lng: -73.0503 },
  "Talcahuano": { lat: -36.7249, lng: -73.1166 },
  "Temuco": { lat: -38.7359, lng: -72.5904 },
  "Pucón": { lat: -39.2824, lng: -71.9543 },
  "Puerto Montt": { lat: -41.4689, lng: -72.9411 },
  "Osorno": { lat: -40.5740, lng: -73.1339 },
  "Rancagua": { lat: -34.1708, lng: -70.7403 },
  "Talca": { lat: -35.4264, lng: -71.6554 },
  "La Serena": { lat: -29.9027, lng: -71.2519 },
  "Coquimbo": { lat: -29.9533, lng: -71.3394 },
  "Antofagasta": { lat: -23.6509, lng: -70.3975 },
  "Calama": { lat: -22.4560, lng: -68.9293 },
  "Valdivia": { lat: -39.8196, lng: -73.2454 },
  "Macul": { lat: -33.4889, lng: -70.5993 },
  "La Reina": { lat: -33.4489, lng: -70.5493 },
  "Peñalolén": { lat: -33.4889, lng: -70.5493 },
  "San Bernardo": { lat: -33.5917, lng: -70.7000 },
};
