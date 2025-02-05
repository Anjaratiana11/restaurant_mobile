import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { login } from "../services/FirebaseService";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/atoms/Button"; // Utilisation du bouton personnalisé

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    console.log("Tentative de connexion avec :", email);

    try {
      const result = await login(email, password);
      console.log("Connexion réussie :", result);

      const { idToken } = result;
      if (idToken) {
        console.log("idToken récupéré :", idToken);
        Alert.alert("Connexion réussie", "Vous êtes connecté avec succès !");
        navigation.navigate("PlatsScreen", { idToken });
      } else {
        console.error("Erreur : idToken non trouvé !");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {/* Remplacement de l'ancien Button par CustomButton */}
      <CustomButton
        title="Se connecter"
        onPress={handleLogin}
        disabled={loading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginScreen;
