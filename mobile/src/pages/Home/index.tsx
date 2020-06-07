import React, { useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Platform, KeyboardAvoidingView, TextInput, View, Image, ImageBackground, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const handleNavigateToMap = () => {
    navigation.navigate('Points', { uf, city });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}>
        <View style={styles.main}>
          <Image source={require('../../../assets/logo.png')} />

          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>

            <Text style={styles.description}>
              Ajudamos a encontrar pessoas a encontrarem pontos de coleta
            </Text>
          </View>
        </View>

        <View style={styles.footer}>

          <TextInput
            style={styles.input}
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="Digite a UF" />

          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="Digite a Cidade" />

          <RectButton style={styles.button} onPress={handleNavigateToMap}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24}></Icon>
              </Text>
            </View>

            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home;