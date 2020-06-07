import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import styles from "./styles";
import api from "../../services/api";

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
}

interface Param {
    city: string;
    uf: string
}

const Points = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [initialPosition, setInitialPosition] = useState<number[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        api.get('items')
            .then((response) => setItems(response.data))
            .catch((error) => console.error(error))
    }, []);

    useEffect(() => {

        const loadPosition = async () => {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert("Oooops ....", 'Precisamos de sua permissão para obter a localização.');
                return
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;

            setInitialPosition([latitude, longitude]);
        }

        loadPosition();

    }, []);

    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        })
            .then((response) => {
                console.log('points response', response.data.length);
                setPoints(response.data);
            })
            .catch((err) => console.log(err))
    }, [selectedItems]);

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Param;

    const handleNavigateBack = () => 
        navigation.navigate("Home")

    const handleNavigateToDetail = (pointId: number) => 
        navigation.navigate("Detail", { pointId })

    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems([...filteredItems]);
            return;
        }

        setSelectedItems([...selectedItems, id]);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
                </TouchableOpacity>

                <Text style={styles.title}>
                    Bem vindo.
                </Text>

                <Text style={styles.description}>
                    Encontre no mapa um ponto de coleta.
                </Text>

                <View style={styles.mapContainer}>
                    {initialPosition.length > 0 && (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: initialPosition[0] || 0,
                                longitude: initialPosition[1] || 0,
                                latitudeDelta: 0.030,
                                longitudeDelta: 0.030,
                            }}>
                            {points.map((point) => (
                                <Marker
                                    key={String(point.id)}
                                    style={styles.mapMarker}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.latitude || 0,
                                        longitude: point.longitude || 0,
                                    }}>

                                    <View style={styles.mapMarkerContainer}>
                                        <Image
                                            style={styles.mapMarkerContainer}
                                            source={{ uri: point.image }}
                                        />

                                        <Text style={styles.mapMarkerTitle}>
                                            {point.name}
                                        </Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                    showsHorizontalScrollIndicator={false}>
                    {items.map((item) => {
                        return (
                            <TouchableOpacity
                                key={String(item.id)}
                                style={[
                                    styles.item,
                                    selectedItems.includes(item.id) ? styles.selectedItem : {}
                                ]}
                                activeOpacity={0.6}
                                onPress={() => handleSelectItem(item.id)}>
                                
                                <SvgUri width={42} height={42} uri={item.image_url} />

                                <Text style={styles.itemTitle}>
                                    {item.title}
                                </Text>

                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
        </ SafeAreaView>
    )
}

export default Points;

