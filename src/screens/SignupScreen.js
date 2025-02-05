import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { signup } from "../services/FirebaseService";

const SignupScreen = ({ navigation }) => {
  // Ajoute navigation ici
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signup(email, password);
      console.log("Inscription réussie:", result);

      Alert.alert(
        "Inscription réussie",
        "Votre compte a été créé avec succès !"
      );

      // Redirection vers la page de connexion après inscription
      navigation.navigate("LoginScreen");
    } catch (err) {
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
      <Button title="S'inscrire" onPress={handleSignup} disabled={loading} />

      {/* Affichage du lien vers la connexion */}
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.link}>Déjà un compte ? Connecte-toi</Text>
      </TouchableOpacity>

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
  link: {
    marginTop: 15,
    color: "#3498db", // Bleu pour ressembler à un lien
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default SignupScreen;
