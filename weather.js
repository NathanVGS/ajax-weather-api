const search = document.getElementById("run-search");
const input = document.getElementById("city-search");
const forecast = document.getElementById("forecast");
const key = "da8e4db147cb36474ba1f8bcb3bfd27d";
const addForecastPerDay = (list, count) => {
    let avgTempArr = [];
    let avgTemp, minTemp, maxTemp;
    for (let i = count; i < count + 8; i++) {
        console.log(list[i])
        avgTempArr.push(list[i].main.temp)
    }
    avgTemp = avgTempArr.reduce((prev, curr) => {
        return prev + curr
    }, 0) / 8 //average temp

    maxTemp = avgTempArr.reduce((prev, curr) => {
        return prev > curr ? prev : curr
    }, 0) // max temp

    minTemp = avgTempArr.reduce((prev, curr) => {
        return prev < curr ? prev : curr
    }) // min temp

    forecast.innerHTML+= `
    <div class="daycast">
    <h2>${new Date(list[count].dt_txt).toDateString()}</h2>
    Average Temp; ${Math.round(avgTemp * 10) / 10} <br>
    Min: ${Math.round(minTemp * 10) / 10} <br>
    Max: ${Math.round(maxTemp * 10) / 10} <br>
    </div>
    `
}

input.focus();

document.body.addEventListener("keypress", e => {
    if(e.key === "Enter") search.click()
})

search.addEventListener("click", () => {
    let cityName = input.value;
    forecast.innerHTML = "";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("weather-now").innerHTML = `
            <div class="daycast">
            <h2>Today (now)</h2>
            <p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            alt="${data.weather[0].description}"
            title="${data.weather[0].main}" /></p>
            <p>Temperature: ${Math.round(data.main.temp * 10) / 10}°C</p>
            </div>
            `
        })
        .catch(err => alert(err.message))
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.list)
            /*let convert = data.list[0].dt_txt
            console.log(new Date(convert))*/
            let list = data.list
            let today = new Date().toDateString()
            console.log(today)
            //let z = 0;
            let count = 0;
            console.log(new Date(list[count].dt_txt).toDateString())
            while(new Date(list[count].dt_txt).toDateString() === today) {
                console.log(count)
                count++
            }
            for (let i = 0; i < 4; i++) {
                addForecastPerDay(list, count);
                count+=8;
            }

        })
})
//weather by coords for users home
document.getElementById("search-local").addEventListener("click", () => {
    let lat, lon;
    const getPosition = (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
            .then(response => response.json()
                .then(data => {
                    console.log(data)
                    document.getElementById("weather-now").innerHTML = `
            <div class="daycast">
            <h2>${data.name} now:</h2>
            <p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            alt="${data.weather[0].description}"
            title="${data.weather[0].main}" />
            </p>
            <p>Temperature: ${Math.round(data.main.temp * 10) / 10}°C</p>
            </div>
            `
                }))
            .catch(err => console.error(err.message))
        //fix duplicated code somehow
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.list)
                /*let convert = data.list[0].dt_txt
                console.log(new Date(convert))*/
                let list = data.list
                let today = new Date().toDateString()
                console.log(today)
                //let z = 0;
                let count = 0;
                console.log(new Date(list[count].dt_txt).toDateString())
                while(new Date(list[count].dt_txt).toDateString() === today) {
                    console.log(count)
                    count++
                }
                for (let i = 0; i < 4; i++) {
                    addForecastPerDay(list, count);
                    count+=8;
                }

            })
    }
    let coords = navigator.geolocation.getCurrentPosition(getPosition)
    console.log(coords)
})
