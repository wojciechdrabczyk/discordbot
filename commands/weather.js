const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const createLink = ({ lat, lon }) => {
  const APIkey = process.env.OWM_KEY;
  console.log(APIkey);
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("tbd")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("city to get weather for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const coords = await geoCode(city);
    const link = createLink(coords);
    const res = await fetch(link);
    const weatherData = await res.json();
    console.log(weatherData);
    const { icon, main, description } = weatherData.weather[0];
    const { name, main: temps } = weatherData;
    const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    // inside a command, event listener, etc.
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(capitalizeFirstLetter(description))
      .setDescription(
        `:thermometer: **Temperature**: ${t(
          temps.temp
        )}\n:eggplant: **Feels like**: ${t(
          temps.feels_like
        )}\n:droplet: **Humidity**: ${temps.humidity.toString()}%`
      )
      .setThumbnail(iconURL)
      .setTimestamp()
      .setFooter({
        text: `${name}`,
      });
    await interaction.reply({
      embeds: [exampleEmbed],
      ephemeral: false,
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
