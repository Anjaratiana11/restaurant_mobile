import axios from "axios";

const API_URL = "https://cuisine-qemt.onrender.com/api";

/**
 * Récupère la liste des plats depuis l'API Symfony.
 */
const getPlats = async () => {
  try {
    const response = await axios.get(`${API_URL}/plats`);
    const data = response.data;

    // Vérifier si les données sont un tableau valide et si chaque élément possède les propriétés attendues
    if (
      Array.isArray(data) &&
      data.every(
        (item) => item.id && item.nom && item.tempsDePreparation !== undefined
      )
    ) {
      return data;
    } else {
      throw new Error(
        "Données mal formées : un ou plusieurs plats sont manquants."
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des plats:", error);
    throw new Error("Impossible de récupérer les plats");
  }
};

export { getPlats };
