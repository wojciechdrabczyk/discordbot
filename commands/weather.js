const { SlashCommandBuilder } = require("discord.js");
const createLink = ({ lat, lon }) => {
  const APIkey = process.env.OWM_KEY;
  console.log(APIkey);
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
};
module.exports = {
  data: new SlashCommandBuilder().setName("weather").setDescription("tbd"),
  async execute(interaction) {
    const link = createLink({ lat: "44.34", lon: "10.99" });
    setInterval(async () => {
      const res = await fetch(link);
      const weatherData = await res.json();
      console.log(weatherData);
    }, 10000);
    const res = await fetch(link);
    const weatherData = await res.json();
    await interaction.reply({
      content: "asd",
      ephemeral: true,
    });
  },
};
