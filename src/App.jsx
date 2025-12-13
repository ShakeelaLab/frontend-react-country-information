import './App.css';
import axios from "axios";
import React from "react";
import world_map from "./assets/world_map.png";
import CountryList
    from "./components/countries/CountryList.jsx";
import Button from "./components/button/Button.jsx";
import amountPeople from "./helpers/amountPeople.jsx";

function App() {
    const [countries, setCountries] = React.useState([]);
    const [error, toggleError] = React.useState(false);
    const [listError, setListError] = React.useState(false);
    const [loading, toggleLoading] = React.useState(false);
    const [countryInfo, setCountryInfo] = React.useState('');
    const [selectedCountry, setSelectedCountry] = React.useState(null);

    async function handleClick(e) {
        e.preventDefault()
        try {
            toggleLoading(true);
            setListError(false);
            const response = await axios.get(
                `https://restcountries.com/v3.1/name/${countryInfo}`,
                {
                    params: {
                        fields: "name,population,region,flags,capital,borders,tld",
                    },
                }
            );
            const country = response.data[0];
            const mapped = {
                name: country.name.common,
                population: country.population,
                flags: country.flags.svg,
                region: country.region,
                capital: country.capital ? country.capital[0] : "No capital found",
                borders: country.borders ?? [],
                tld: country.tld ? country.tld : "."
            };

            setSelectedCountry(mapped);
            setCountryInfo('');
            setCountries([]);
        } catch (e) {
            console.error(e);
            setListError(true);
            setSelectedCountry(null);
        } finally {
            toggleLoading(false);
        }
    }

    async function fetchCountry() {
        try {
            toggleLoading(true);
            toggleError(false);
            setListError(false)
            const response = await axios.get("https://restcountries.com/v3.1/all", {
                params: {
                    fields: "name,population,region,flags,region,subregion,capital,borders",
                }
            });
            response.data.sort(function (a, b) {
                return a.population - b.population
            });
            const countriesArray = response.data.map(country => ({
                name: country.name.common ? country.name.common : "No country",
                population: country.population ? country.population : "No population found",
                flags: country.flags.svg ? country.flags.svg : "No flag found ",
                region: country.region ? country.region : "No region found ",
                subregion: country.subregion ? country.subregion : "No region found ",
                capital: country.capital ? country.capital : "No capital found ",
            }));
            setCountries(countriesArray);
        } catch (e) {
            console.error(e);
            toggleError(true)
        } finally {
            toggleLoading(false);
        }
    }

    return (
        <>
            <div className="app-container">
                <header>
                    <img className="image-worldmap"
                         src={world_map}
                         alt="image of a world map"/>
                </header>
                <h1>World Regions</h1>
                <Button
                    text="Haal landen op"
                    fetchCountry={fetchCountry}
                    loading={loading === true}
                />
                <form>
                <input
                    type="text"
                    value={countryInfo}
                    onChange={(e) => setCountryInfo(e.target.value)}
                />
                <button
                    onClick={handleClick}
                >search
                </button>
                </form>
                <section
                    className="single-country-container">
                    {selectedCountry && (
                        <>
                            <span
                                className="flag-country"><img
                                className="flag"
                                src={selectedCountry.flags}
                                alt={`flag of ${selectedCountry.name}`}/>
                            <h2>{selectedCountry.name}</h2></span>
                            <hr/>
                            <p>{selectedCountry.name} is
                                situated
                                in {selectedCountry.region} and
                                the capital
                                is {selectedCountry.capital}
                            </p>
                            <p>
                                It has a population
                                of {amountPeople(selectedCountry.population)} and
                                it borders
                                with {selectedCountry.borders.length} countries
                            </p>
                            <p>Websites van be found
                                on <strong>{selectedCountry.tld}</strong> domain&apos;s
                            </p>
                        </>
                    )}

                    {listError && (
                        <p className="error-message">
                            Land niet gevonden of er is iets misgegaan bij het ophalen van dit land.
                        </p>
                    )}
                </section>

                {error &&
                    <p className="error-message">Er is
                        iets
                        misgegaan bij het ophalen van de
                        data. Probeer het nog eens.</p>}

                <CountryList countries={countries}/>

            </div>
        </>
    )

}

export default App
