import React, { useEffect, useState } from 'react';
import { Linking, SafeAreaView, Text, Image, View, TouchableOpacity } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from "expo-mail-composer";

import styles from './styles';
import api from "../../services/api";

interface Params {
    pointId: number;
}

interface Data {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
    items: {
        title: string;
    }[];
}

const Detail = () => {

    const [data, setData] = useState<Data>({} as Data);
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
        api.get(`points/${routeParams.pointId}`)
            .then((response) => setData(response.data))
            .catch((err) => console.error(err));
    }, []);

    const handleNavigateBack = () => navigation.navigate('Points');

    const handleComposeMail = (point: Data) => {
        MailComposer.composeAsync({
            subject: "Interesse na coleta de resíduos",
            recipients: [point.email],
        });
    }

    const handleWhatsApp = (point: Data) => {
        Linking.openURL(`WhatsApp://send?phone=${point.whatsapp}&text=Tenho interesse sobre coleta de resíduos.`);
    }

    if (!data) {
        return;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
                </TouchableOpacity>

                <Image
                    style={styles.pointImage}
                    source={{ uri: data.image }}
                />

                <Text style={styles.pointName}>
                    {data.name}
                </Text>

                <Text style={styles.pointItems}>
                    {(data.items || []).map(item => item.title).join(',')}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>
                        Endereço
                    </Text>

                    <Text style={styles.addressContent}>
                        {data.city}, {data.uf}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={() => handleWhatsApp(data)}>
                    <FontAwesome
                        name="whatsapp"
                        size={20}
                        color="#FFF" />

                    <Text style={styles.buttonText}>
                        Whatasapp
                    </Text>
                </RectButton>

                <RectButton style={styles.button} onPress={() => handleComposeMail(data)}>
                    <Icon
                        name="mail"
                        size={20}
                        color="#FFF" />

                    <Text style={styles.buttonText}>
                        E-mail
                    </Text>
                </RectButton>
            </View>
        </ SafeAreaView>
    )
}

export default Detail;