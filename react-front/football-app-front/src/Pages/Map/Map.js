import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const createAvatarIcon = (logoUrl) => {
  return new L.Icon({
    iconUrl: logoUrl || "https://fallback-avatar.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const Map = ({ userLat, userLon, points }) => {
  return (
    <MapContainer
      center={[userLat, userLon]}
      zoom={13}
      style={{ height: "91vh", width: "100vw" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[userLat, userLon]}>
        <Popup>You are here!</Popup>
      </Marker>

      {points?.map((p, idx) => (
        <Marker
          key={idx}
          position={[p.lat, p.lon]}
          icon={createAvatarIcon(p.team_logo)}
        >
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
