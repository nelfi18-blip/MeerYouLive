import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Video as AVVideo, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API =
  Constants.expoConfig?.extra?.API_URL ?? "https://api.meetyoulive.net";

export default function VideoScreen({ route }) {
  const { video } = route.params;
  const [hasAccess, setHasAccess] = useState(!video.isPrivate);
  const [loading, setLoading] = useState(video.isPrivate);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (video.isPrivate) {
      checkAccess();
    }
  }, []);

  const checkAccess = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API}/api/payments/access/${video._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHasAccess(data.access);
    } catch {
      // deny access on network error
    } finally {
      setLoading(false);
    }
  };

  const unlockWithCoins = async () => {
    setBuying(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API}/api/payments/coins/${video._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setHasAccess(true);
        Alert.alert("¡Desbloqueado!", "Ahora puedes ver el vídeo.");
      } else {
        Alert.alert("Error", data.message || "No se pudo desbloquear");
      }
    } catch {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{video.title}</Text>
      {video.description ? (
        <Text style={styles.desc}>{video.description}</Text>
      ) : null}
      {hasAccess ? (
        <AVVideo
          source={{ uri: video.url }}
          style={styles.player}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
        />
      ) : (
        <View style={styles.locked}>
          <Text style={styles.lockText}>
            🔒 Vídeo privado · {video.price} monedas
          </Text>
          {buying ? (
            <ActivityIndicator />
          ) : (
            <Button title="Desbloquear con monedas" onPress={unlockWithCoins} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center" },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  desc: { color: "#666", marginBottom: 16 },
  player: { width: "100%", aspectRatio: 16 / 9 },
  locked: { alignItems: "center", marginTop: 32 },
  lockText: { fontSize: 16, color: "#e74c3c", marginBottom: 24, textAlign: "center" },
});
