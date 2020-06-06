import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from "leaflet";

import api from "../../services/api";
import axios from "axios";

import './style.css';
import logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUfResponse {
  initial: string;
}

interface IBGECityResponse {
  name: string;
}

const CreatePoint = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [initials, setInitials] = useState<IBGEUfResponse[]>([]);
  const [cities, setCities] = useState<IBGECityResponse[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([-23.2427023, -45.8944638]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([-23.2427023, -45.8944638]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedUf(event.target.value);

  const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedCity(event.target.value);

  const handleMapClick = (event: LeafletMouseEvent) => {
    console.log(event.latlng);

    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value });
  }

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems([...filteredItems]);
      return;
    }

    setSelectedItems([...selectedItems, id]);
  }

   const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name, email, whatsapp, uf, city, latitude, longitude, items
    };

    await api.post('points', data);

    history.push('/');
  }

  const history = useHistory();

  useEffect(() => {
    api.get("items")
      .then((response) => setItems(response.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
    axios.get<IBGEUfResponse[]>(url)
      .then((response) =>
        setInitials(response.data
          .map((initial: any) =>
            ({ initial: initial['sigla'] }))))
      .catch((err) => {
        console.error(err)
        setInitials([]);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`;
    axios.get<IBGECityResponse[]>(url)
      .then((response) =>
        setCities(response.data
          .map((city: any) =>
            ({ name: city['nome'] }))))
      .catch((err) => {
        console.error(err);
        setCities([]);
      });
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
      setSelectedPosition([latitude, longitude]);
    })
  }, [selectedUf]);

  return (
    <>
      <div id="page-create-point">
        <header>
          <img src={logo} alt="Ecoleta" />
          <Link to="/">
            <span>
              <FiArrowLeft />
            </span>
            <strong>
              Voltar para home
              </strong>
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>Cadastro do ponto <br />de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="name">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick} >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={selectedPosition}></Marker>
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                  <option value="0">Selecione uma UF</option>
                  {initials.map((item, idx) => (
                    <option key={idx} value={item.initial}>
                      {item.initial}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  value={selectedCity}
                  onChange={handleSelectCity}>
                  <option value="0">Selecione uma cidade</option>
                  {cities.map((item, idx) => (
                    <option key={idx} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Itens de Coleta</h2>
            </legend>

            <ul className="items-grid">
              {items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? "selected" : ""}>
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar Ponto de Coleta</button>
        </form>
      </div>
    </>
  )

};

export default CreatePoint;
