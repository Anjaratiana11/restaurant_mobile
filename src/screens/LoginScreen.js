import React, { useState } from "react";
import { TextInput, Button, View, Text, StyleSheet, Alert } from "react-native";
import { login } from "../services/FirebaseService";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Hook de navigation

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    console.log("Tentative de connexion avec :", email);

    try {
      const result = await login(email, password); // Récupère directement l'idToken
      console.log("Connexion réussie :", result);

      const { idToken } = result; // Déstructure idToken directement depuis le résultat

      if (idToken) {
        console.log("idToken récupéré :", idToken);
        Alert.alert("Connexion réussie", "Vous êtes connecté avec succès !");

        // Navigue vers PlatsScreen en passant l'idToken
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
      <Button title="Se connecter" onPress={handleLogin} disabled={loading} />
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
 