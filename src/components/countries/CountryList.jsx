import './CountryList.css';
import regionColor from "../../helpers/regionColor.jsx";
import amountPeople from "../../helpers/amountPeople.jsx";

function CountryList({countries}) {
    return (
        <>
            <section className="app-countries">
                <ul>
                    {countries.map((country, i) => (
                        <li key={i} className="information-country">
                            <div>
                                <img src={country.flags} alt="flag of country"/>
                                <h4 className={regionColor(country.region)}>{country.name}</h4>
                            </div>
                            <p>Has a population of {country.population} people</p>
                            <p>{amountPeople(country.population)}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}

export default CountryList;