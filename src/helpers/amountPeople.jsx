export default function amountPeople(population) {
    return (population >= 1_000_000) ? (population / 1_000_000).toFixed(1) + " million people" : population + " people";
}