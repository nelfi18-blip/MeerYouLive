import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";

const API =
  Constants.expoConfig?.extra?.API_URL ?? "https://api.meetyoulive.net";

export default function HomeScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API}/api/videos`);
      const data = await res.json();
      setVideos(data);
    } catch {
      setError("No se pudieron cargar los vídeos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Video", { video: item })}
        >
          <Text style={styles.title}>{item.title}</Text>
          {item.description ? (
            <Text style={styles.desc}>{item.description}</Text>
          ) : null}
          {item.isPrivate && (
            <Text style={styles.badge}>🔒 Privado · {item.price} monedas</Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center" },
  error: { color: "red", textAlign: "center", marginTop: 32 },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#666", marginTop: 4 },
  badge: { marginTop: 8, color: "#e74c3c", fontWeight: "bold" },
});
