"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GuineaCrimeMap() {
  const crimes = [
    {
      id: 1,
      city: "Conakry",
      lat: 9.6412,
      lng: -13.5784,
      type: "Robbery",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Conakry_city.jpg"
    },
    {
      id: 2,
      city: "Kankan",
      lat: 10.3853,
      lng: -9.3050,
      type: "Assault",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Kankan_mosque.jpg"
    },
    {
      id: 3,
      city: "Labé",
      lat: 11.3180,
      lng: -12.2833,
      type: "Fraud",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Labe_mountains.jpg"
    },
  ];

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[10.4396, -11.7799]} // Guinea center
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {crimes.map((crime) => (
          <Marker key={crime.id} position={[crime.lat, crime.lng]}>
            <Popup>
              <div className="w-48">
                <h3 className="font-bold text-lg">{crime.city}</h3>
                <p className="text-sm">{crime.type}</p>
                <img
                  src={crime.image}
                  alt={crime.city}
                  className="mt-2 rounded-lg shadow-md w-full h-24 object-cover"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
