import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import {
  getCommandeDetails,
  getPlatDetails,
  getCommandeActuelle,
  validerCommande,
} from "../services/SymfonyService"; // Import des services

const CommandeScreen = ({ route }) => {
  const userId = 1; // Identifiant utilisateur

  const [idCommande, setIdCommande] = useState(null);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  // Hook pour récupérer l'ID de la commande
  useEffect(() => {
    const fetchCommandeId = async () => {
      try {
        const id = await getCommandeActuelle(userId);
        if (!id) throw new Error("Aucune commande en cours trouvée");
        setIdCommande(id);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
        console.error(err);
      }
    };
    fetchCommandeId();
  }, [userId]);

  // Hook pour récupérer les détails de la commande
  useEffect(() => {
    if (!idCommande) return;

    const fetchCommandeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const detailsCommande = await getCommandeDetails(idCommande);
        if (!detailsCommande || detailsCommande.length === 0) {
          throw new Error("Aucun plat dans cette commande");
        }

        // Récupération des détails de chaque plat
        const platsDetails = await Promise.all(
          detailsCommande.map(async (item) => {
            const plat = await getPlatDetails(item.idPlat);
            return { ...plat, id: item.id, statut: item.statut };
          })
        );

        setPlats(platsDetails);

        // Calcul du total de la commande
        const totalPrice = platsDetails.reduce(
          (sum, plat) => sum + plat.prix,
          0
        );
        setTotal(totalPrice);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandeDetails();
  }, [idCommande]);

 const handleValiderCommande = async () => {
   console.log("Bouton Payer cliqué, ID de commande :", idCommande);

   if (!idCommande) {
     alert("Aucune commande à valider.");
     return;
   }

   try {
     const response = await validerCommande(idCommande);
     console.log("Réponse API :", response);

     if (response.statut === 0) {
       alert(response.message); // Affiche "Commande validée avec succès"
     } else {
       alert("Une erreur est survenue lors de la validation de la commande.");
     }
   } catch (error) {
     alert(
       error.message || "Erreur inconnue lors de la validation de la commande"
     );
     console.error(error);
   }
 };

  // Affichage pendant le chargement
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commande #{idCommande}</Text>

      {/* Liste des plats de la commande */}
      <FlatList
        data={plats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.nom}</Text>
            <Text style={styles.itemPrice}>{item.prix} Ar</Text>
          </View>
        )}
      />

      {/* Total de la commande */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total :</Text>
        <Text style={styles.totalAmount}>{total} Ar</Text>
      </View>

      {/* Bouton pour valider la commande */}
      <Button title="Payer" onPress={handleValiderCommande} color="#4CAF50" />
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
    textAlign: "center",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default CommandeScreen;