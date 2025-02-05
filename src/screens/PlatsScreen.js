import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getPlats } from "../services/SymfonyService";

const PlatsScreen = ({ route, navigation }) => {
  const { idToken } = route.params || {}; // Récupère l'idToken depuis la navigation

  console.log("PlatsScreen - idToken reçu :", idToken);

  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idToken) {
      setError("Aucun idToken reçu !");
      setLoading(false);
      return;
    }

    const fetchPlats = async () => {
      try {
        console.log("Récupération des plats...");
        const data = await getPlats();
        console.log("Plats récupérés :", data);
        setPlats(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des plats :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlats();
  }, [idToken]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  // Fonction pour naviguer vers PlatDetailsScreen
  const handlePlatPress = (platId) => {
    // Naviguer vers l'écran PlatDetailsScreen et passer l'ID du plat
    navigation.navigate("PlatDetailsScreen", { platId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tokenContainer}>
        <Text style={styles.tokenTitle}>ID Token :</Text>
        <Text style={styles.token}>{idToken || "Aucun token reçu"}</Text>
      </View>

      <FlatList
        data={plats}
        keyExtractor={(item) => (item.id ? item.id.toString() : "default-key")} // Vérifie que `item.id` est défini
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePlatPress(item.id)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.nom || "Nom inconnu"}</Text>
              <Text>
                Temps de préparation : {item.tempsDePreparation || "N/A"} sec
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  tokenContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  token: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default PlatsScreen;
