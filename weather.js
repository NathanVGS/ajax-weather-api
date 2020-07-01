const search = document.getElementById("run-search");
const input = document.getElementById("city-search");
const forecast = document.getElementById("forecast");
const key = "da8e4db147cb36474ba1f8bcb3bfd27d";

function mode(array)
{
    if(array.length === 0) return null;
    let modeMap = {};
    let maxEl = array[0], maxCount = 1;
    for(let i = 0; i < array.length; i++) {
        let el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if(modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

const addForecastPerDay = (list, count) => {
    let avgTempArr = [];
    let descriptionArr = [];
    let avgTemp, minTemp, maxTemp;
    for (let i = count; i < count + 8; i++) {
        //console.log(list[i])
        avgTempArr.push(list[i].main.temp);
        descriptionArr.push(list[i].weather[0].description)
    }
    console.log(descriptionArr)
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
    Average Temp: ${Math.round(avgTemp * 10) / 10}°C <br>
    Min: ${Math.round(minTemp * 10) / 10}°C <br>
    Max: ${Math.round(maxTemp * 10) / 10}°C <br>
    Summary: ${mode(descriptionArr)}
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
        .catch(err => {
            console.error(err.message);
            alert("City "+ cityName+ " could not be found");
        })
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data.list)
            let list = data.list
            let today = new Date().toDateString()
            let count = 0;
            while(new Date(list[count].dt_txt).toDateString() === today) {
                console.log(count)
                count++
            }
            for (let i = 0; i < 4; i++) {
                addForecastPerDay(list, count);
                count+=8;
            }

        }) //change background image
        .then(_ => {
        fetch(`https://api.unsplash.com/search/photos?client_id=oHvaVH5Ar3kJ6NtTI58Ye852AHaBXlXhfhkgqMRRBuQ&page=1&query=${cityName}`)
            .then(response => response.json())
            .then(data => {
                let url = data.results[Math.floor(Math.random() * 10)].urls.regular;
                document.body.style.backgroundImage = `url(${url})`
                document.body.style.backgroundPosition = "center"
                document.body.style.backgroundRepeat = "no-repeat"
                document.body.style.backgroundSize = "cover"
            })
    })


})
//weather by coords for users home
document.getElementById("search-local").addEventListener("click", () => {
    forecast.innerHTML = "";
    let lat, lon;
    document.body.style.background = "linear-gradient(14deg, rgba(26,134,152,1) 0%, rgba(0,232,255,1) 100%)"
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
                let list = data.list
                let today = new Date().toDateString()
                console.log(today)
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
window.addEventListener("load", () => {
    document.getElementById("search-local").click()
})


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses', "third line"],
        ['2004',  1000,      400, 500],
        ['2005',  1170,      460, 500],
        ['2006',  660,       1120, 500],
        ['2007',  1030,      540, 500]
    ]);

    var options = {
        title: 'Company Performance',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}