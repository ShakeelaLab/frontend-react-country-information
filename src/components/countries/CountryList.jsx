import './CountryList.css';

function CountryList({ children }) {
    return (
        <section className="app-countries">
            {children}
        </section>
    );
}

export default CountryList;