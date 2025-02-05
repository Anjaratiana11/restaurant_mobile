import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from "react-native";
import {
  getPlatDetails,
  getPlatsIngredients,
  getIngredientDetails,
} from "../services/SymfonyService"; // Assurez-vous que le chemin vers votre service est correct

const PlatDetailsScreen = ({ route }) => {
  const { platId } = route.params; // Récupère l'ID du plat depuis la navigation
  console.log("Plat ID reçu :", platId);

  const [plat, setPlat] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Gérer l'état de la pop-up
  const [quantite, setQuantite] = useState(""); // Gérer la quantité

  useEffect(() => {
    const fetchPlatDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Récupérer les détails du plat
        const platData = await getPlatDetails(platId);
        console.log("Réponse de l'API pour le plat :", platData);
        if (!platData) {
          throw new Error("Détails du plat non trouvés");
        }
        setPlat(platData);

        // Récupérer les ingrédients du plat
        const ingredientsIds = await getPlatsIngredients(platId);
        if (!ingredientsIds || ingredientsIds.length === 0) {
          throw new Error("Aucun ingrédient trouvé pour ce plat");
        }

        // Récupérer les détails des ingrédients
        const ingredientsDetails = await Promise.all(
          ingredientsIds.map(async (ingredientId) => {
            const ingredientData = await getIngredientDetails(ingredientId);
            return ingredientData;
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

  const handleCommander = () => {
    // Ici, tu peux ajouter la logique pour traiter la commande
    console.log(`Commande passée pour ${plat.nom} avec ${quantite} unités`);
    setIsModalVisible(false); // Fermer la pop-up après la commande
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
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <Text key={ingredient.id}>{ingredient.nom}</Text>
            ))
          ) : (
            <Text>Aucun ingrédient trouvé</Text>
          )}

          {/* Bouton pour afficher la pop-up de commande */}
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
