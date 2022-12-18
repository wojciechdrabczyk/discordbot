const {
  SlashCommandBuilder,
  EmbedBuilder,
  SnowflakeUtil,
} = require("discord.js");
const createLink = ({ lat, lon }) => {
  const APIkey = process.env.OWM_KEY;
  console.log(APIkey);
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&`;
};

const weatherMappings = {
  snow: { color: "#ffffff", emoji: ":snowflake:" },
  "clear sky": { color: "#5dc3ff", emoji: ":sun_with_face:" },
  "scattered clouds": { color: "#454545", emoji: ":white_sun_cloud:" },
  "broken clouds": { color: "#606060", emoji: ":cloud:" },
  "shower rain": { color: "#050057", emoji: ":cloud_rain:" },
  rain: { color: "#050057", emoji: ":cloud_rain:" },
  thunderstorm: { color: "#cfc057", emoji: ":thunder_cloud_rain:" },
  mist: { color: "#ffffff", emoji: ":fog:" },
  "few clouds": { color: "#a7a7a7", emoji: ":cloud:" },

};

const defaultMapping = { color: "#000000", emoji: ":cloud:" }

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Access current weather data for any location on Earth")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("Enter desired city name.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const coords = await geoCode(city);
    if (!coords) {
      await interaction.reply({
        ephemeral: true,
        content: "Couldn't find a city with the given city name.",
      });
      return;
    }
    const link = createLink(coords);
    const res = await fetch(link);
    const weatherData = await res.json();
    console.log(weatherData);
    const { icon, main, description } = weatherData.weather[0];
    const { name, main: temps } = weatherData;
    const { speed } = weatherData.wind;
    const { color, emoji } = weatherMappings[description.toLowerCase()] ?? defaultMapping;
    const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    const exampleEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${emoji} ${capitalizeFirstLetter(description)}`)
      .setDescription(
        `:thermometer: **Temperature**: ${ft(
          temps.temp
        )}\n:wind_blowing_face: **Feels like**: ${ft(
          temps.feels_like
        )}\n:droplet: **Humidity**: ${temps.humidity.toString()}%\n:leaves: **Wind**: ${formatSpeed(
          speed
        )}`
      )
      .setThumbnail(iconURL)
      .setTimestamp()
      .setFooter({
        text: `${name}`,
      });
    await interaction.reply({
      embeds: [exampleEmbed],
      ephemeral: true,
    });
  },
};
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
async function geoCode(cityName) {
  const APIkey = process.env.OWM_KEY;
  const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`;
  const res = await fetch(URL);
  const geoCodeData = await res.json();
  if (geoCodeData.length === 0) {
    return null;
  }
  const { lat, lon } = geoCodeData[0];
  console.log(geoCodeData);
  return {
    lat,
    lon,
  };
}
function t(temp) {
  return `${Math.trunc(temp).toString()}°C`;
}
function f(temp) {
  return `${Math.trunc(temp * 1.8 + 32).toString()}°F`;
}
function ft(convert) {
  return `${t(convert)} | ${f(convert)}`;
}
function msToKmh(convert) {
  return `${Math.trunc(convert * 3.6)}km/h`;
}
function msToMh(convert) {
  return `${Math.trunc(convert * 2.23693629)}mph`;
}
function formatSpeed(speed) {
  return `${msToKmh(speed)} | ${msToMh(speed)}`;
}
