import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import {
  getPlatDetails,
  getPlatsIngredients,
  getIngredientDetails,
  getCommandeActuelle,
  ajouterPlatCommande,
} from "../services/SymfonyService"; // Assurez-vous que le chemin est correct

const PlatDetailsScreen = ({ route, navigation }) => {
  const { platId } = route.params;
  console.log("Plat ID reçu :", platId);

  const [plat, setPlat] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantite, setQuantite] = useState("");

  useEffect(() => {
    const fetchPlatDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const platData = await getPlatDetails(platId);
        if (!platData) throw new Error("Détails du plat non trouvés");
        setPlat(platData);

        const ingredientsIds = await getPlatsIngredients(platId);
        if (!ingredientsIds || ingredientsIds.length === 0) {
          throw new Error("Aucun ingrédient trouvé pour ce plat");
        }

        const ingredientsDetails = await Promise.all(
          ingredientsIds.map(async (ingredientId) => {
            return await getIngredientDetails(ingredientId);
          })
        );
        setIngredients(ingredientsDetails);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatDetails();
  }, [platId]);

  const handleCommander = async () => {
    try {
      if (!quantite || isNaN(quantite) || parseInt(quantite) <= 0) {
        alert("Veuillez entrer une quantité valide !");
        return;
      }

      if (!plat) {
        alert("Erreur : Impossible de commander un plat inconnu.");
        return;
      }

      const userId = 1; // Remplace avec l'ID réel de l'utilisateur connecté
      const idCommande = await getCommandeActuelle(userId);

      if (!idCommande) {
        alert("Aucune commande en cours trouvée !");
        return;
      }

      await ajouterPlatCommande(idCommande, plat.id, parseInt(quantite));

      alert(`Le plat ${plat.nom} a été ajouté à votre commande !`);

      setQuantite(""); // Remettre la quantité à zéro
      setIsModalVisible(false);

      // 🔹 Naviguer vers CommandeScreen après l'alerte
      navigation.navigate("CommandeScreen", { idCommande });
    } catch (error) {
      console.error("Erreur de commande :", error);
      alert("Erreur lors de la commande. Veuillez réessayer.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {plat && (
        <View>
          <Text style={styles.title}>{plat.nom}</Text>
          <Text>Temps de préparation: {plat.tempsDePreparation} sec</Text>

          <Text style={styles.subtitle}>Ingrédients :</Text>
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Text>{item.nom}</Text>}
            ListEmptyComponent={<Text>Aucun ingrédient trouvé</Text>}
          />

          <Button title="Commander" onPress={() => setIsModalVisible(true)} />
        </View>
      )}

      {/* Pop-up pour la commande */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Commander {plat?.nom}</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantité"
              keyboardType="numeric"
              value={quantite}
              onChangeText={setQuantite}
            />
            <Button title="Commander" onPress={handleCommander} />
            <Button title="Annuler" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default PlatDetailsScreen;
