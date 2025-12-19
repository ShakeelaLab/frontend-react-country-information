import './App.css';
import axios from "axios";
import React from "react";
import world_map from "./assets/world_map.png";
import CountryList
    from "./components/countries/CountryList.jsx";
import Button from "./components/button/Button.jsx";
import amountPeople from "./helpers/amountPeople.jsx";
import regionColor from "./helpers/regionColor.jsx";

function App() {
    const [countries, setCountries] = React.useState([]);
    const [error, toggleError] = React.useState(false);
    const [listError, setListError] = React.useState(null);
    const [loading, toggleLoading] = React.useState(false);
    const [countryInfo, setCountryInfo] = React.useState('');
    const [selectedCountry, setSelectedCountry] = React.useState(null);

    async function handleClick(e) {
        e.preventDefault()
        toggleLoading(true);
        try {
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
                capital: country.capital[0] ? country.capital[0] : "No capital found",
                borders: country.borders ?? [],
                tld: country.tld ? country.tld : "."
            };

            setSelectedCountry(mapped);
            setCountryInfo('');
            setCountries([]);
            setListError(false);
        } catch (e) {
            console.error(e);
            setListError(e);
            setSelectedCountry(null);
        } finally {
            toggleLoading(false);
        }
    }

    async function fetchCountry() {
        toggleLoading(true);
        try {
            toggleError(false);
            setListError(false)
            const response = await axios.get("https://restcountries.com/v3.1/all", {
                params: {
                    fields: "name,population,region,flags,subregion,capital,borders"
                }
            });
            response.data.sort(function (a, b) {
                return a.population - b.population
            });
            const countriesArray = response.data.map(country => ({
                name: country.name.common ? country.name.common : "No country",
                officialName: country.name.official,
                population: country.population ? country.population : 0,
                flags: country.flags.svg ? country.flags.svg : "No flag found ",
                region: country.region ? country.region : "No region found ",
                subregion: country.subregion ? country.subregion : "No region found ",
                capital: country.capital ? country.capital : "No capital found ",
            }));
            setCountries(countriesArray);
            setSelectedCountry(null);
            console.log(countriesArray);
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
                <form onSubmit={handleClick}>
                    <input
                        type="text"
                        value={countryInfo}
                        placeholder="Bijvoorbeeld Nederland of Peru"
                        onChange={(e) => setCountryInfo(e.target.value)}
                    />
                    <button
                        type="submit"
                    >zoeken
                    </button>
                </form>

                {listError && (
                    <p className="error-message">
                        Land niet gevonden of er is
                        iets misgegaan bij het
                        ophalen van dit land:
                        <strong>{listError.message}</strong>
                    </p>
                )}

                {selectedCountry && (
                    <section
                        className="single-country-container">
                        <span className="flag-country">
                          <img
                              className="flag"
                              src={selectedCountry.flags}
                              alt={selectedCountry.name}
                          />
                          <h2>{selectedCountry.name}</h2>
                        </span>
                        <hr/>
                        <p>
                            {selectedCountry.name} is
                            situated
                            in {selectedCountry.region}

                            {selectedCountry.capital !== "No capital found" && (
                                <> and the capital is {selectedCountry.capital} </>
                            )}



                        </p>
                        <p>
                            It has a population
                            of {amountPeople(selectedCountry.population)} and
                            it borders
                            with {selectedCountry.borders.length} countries
                        </p>
                        <p>
                            Websites can be found
                            on <strong>{selectedCountry.tld}</strong> domain&apos;s
                        </p>

                        {listError && (
                            <p className="error-message">
                                Land niet gevonden of er is
                                iets misgegaan bij het
                                ophalen van dit land:
                            </p>
                        )}
                    </section>
                )}

                {error &&
                    <p className="error-message">Er is
                        iets
                        misgegaan bij het ophalen van de
                        data. Probeer het nog eens.</p>}

                <Button
                    text="Alle landen"
                    fetchCountry={fetchCountry}
                    loading={loading === true}
                />

                {countries.length > 0 && !selectedCountry && (
                    <CountryList>
                        <ul>
                            {countries.map((country) => (
                                <li key={country.officialName} className="information-country">
                                    <div>
                                        <img
                                            src={country.flags}
                                            alt="flag of country"/>
                                        <h4 className={regionColor(country.region)}>{country.name}</h4>
                                    </div>
                                    {country.population > 0 ?
                                        <p>Has a population
                                            of {country.population} people</p> :
                                        <p>Population
                                            unknown</p>}
                                </li>
                            ))}
                        </ul>
                    </CountryList>
                )}
            </div>

        </>
    )
}

export default App
