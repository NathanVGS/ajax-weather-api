/* API key

- Example of API call:
api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=da8e4db147cb36474ba1f8bcb3bfd27d

api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}

api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={your api key}

da8e4db147cb36474ba1f8bcb3bfd27d
*/

const search = document.getElementById("run-search");
const input = document.getElementById("city-search");
const key = "da8e4db147cb36474ba1f8bcb3bfd27d";
document.body.addEventListener("keypress", e => {
    console.log(e)
    if(e.key === "Enter") search.click()

})
search.addEventListener("click", () => {
    let cityName = input.value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("weather-now").innerHTML = `
            <div>Temperature: ${data.main.temp}°C
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            alt="${data.weather[0].description}"
            title="${data.weather[0].description}"
            </div>
            `
            return data;
        })
        .catch(err => alert(err.message))
})