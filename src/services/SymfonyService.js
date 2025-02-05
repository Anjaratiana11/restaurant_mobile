import axios from "axios";

const API_URL = "https://cuisine-qemt.onrender.com/api";

/**
 * Récupère la liste des plats depuis l'API Symfony.
 */
const getPlats = async () => {
  try {
    const response = await axios.get(`${API_URL}/plats`);
    const data = response.data;

    // Vérification de la structure des données
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

/**
 * Récupère les détails d'un plat par son ID.
 */
const getPlatDetails = async (platId) => {
  try {
    const response = await axios.get(`${API_URL}/plat/${platId}`);
    const data = response.data;

    // Vérifie si la réponse est un tableau et contient au moins un objet
    if (Array.isArray(data) && data.length > 0) {
      const plat = data[0]; // Accède au premier objet dans le tableau

      // Vérifie que l'objet contient les propriétés id et nom
      if (plat.id && plat.nom) {
        return plat;
      } else {
        throw new Error("Plat non trouvé ou données mal formées");
      }
    } else {
      throw new Error("Plat non trouvé ou données mal formées");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du plat:", error);
    throw new Error("Impossible de récupérer les détails du plat");
  }
};

/**
 * Récupère les ingrédients d'un plat par son ID.
 */
const getPlatsIngredients = async (platId) => {
  try {
    const response = await axios.get(`${API_URL}/plats/${platId}/ingredients`);
    const ingredientsIds = response.data;

    if (Array.isArray(ingredientsIds)) {
      return ingredientsIds;
    } else {
      throw new Error("Ingrédients mal formés");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des ingrédients du plat:",
      error
    );
    throw new Error("Impossible de récupérer les ingrédients du plat");
  }
};

/**
 * Récupère les détails d'un ingrédient par son ID.
 */
const getIngredientDetails = async (ingredientId) => {
  try {
    const response = await axios.get(`${API_URL}/ingredient/${ingredientId}`);
    const data = response.data;

    if (Array.isArray(data) && data[0] && data[0].nom) {
      return data[0];
    } else {
      throw new Error("Ingrédient non trouvé ou données mal formées");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'ingrédient:",
      error
    );
    throw new Error("Impossible de récupérer les détails de l'ingrédient");
  }
};

export { getPlats, getPlatDetails, getPlatsIngredients, getIngredientDetails };
