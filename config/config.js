/* MagicMirror² Config Sample
/* https://github.com/MichMich/MagicMirror/wiki/3rd-party-modules
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
    address: "localhost",   // Address to listen on, can be:
                                                    // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
                                                    // - another specific IPv4/6 to listen on a specific interface
                                                    // - "0.0.0.0", "::" to listen on any interface
                                                    // Default, when address config is left out or empty, is "localhost"
    port: 8080,
    basePath: "/",                  // The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
                                                    // you must set the sub path here. basePath must end with a /
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],  // Set [] to allow all IP addresses
                                                                                                                    // or add a specific IPv4 of 192.168.1.5 :
                                                                                                                    // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
                                                                                                                    // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
                                                                                                                    // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

    useHttps: false,                // Support HTTPS or not, default "false" will use HTTP
    httpsPrivateKey: "",    // HTTPS private key path, only require when useHttps is true
    httpsCertificate: "",   // HTTPS Certificate path, only require when useHttps is true

    language: "de",
    locale: "de-DE",
    logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
    timeFormat: 24,
    units: "metric",

    modules: [
            {
                    module: "alert",
            },
            {
                    module: "updatenotification",
                    position: "top_bar"
            },
{
    module: "clock",
    position: "top_left",
    config: {
        dateFormat: "dddd, D. MMM YYYY"
    }
},
            {
                    //disabled: true,  // <= you can disable modules by using this line
                    module: "calendar",
                    header: "Home-Calendar",
                    position: "top_left",
                    config: {
		      broadcastPastEvents: true,
                      calendars: [
                            {
                              fetchInterval: 7 * 24 * 60 * 60 * 1000,
                             symbol: "calendar-check",
                              url: "INSERT CALENDAR URL HERE",
				name: "Private-Calendar", // <= RECOMMENDED to assign name
                              color: "#09F38C", // <= RECOMMENDED to assign color
				broadcastPastEvents: true,
                            },
                            {
                              url: "INSERT SECOND CALENDAR URL HERE",
                              name: "Work-Calendar", // <= RECOMMENDED to assign name
                              symbol: 'calendar',
                              color: "#0990F3", // <= RECOMMENDED to assign color
				broadcastPastEvents: true,
                              },
                              {
                            url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics",
                            name: "us_holiday", // <= RECOMMENDED to assign name
                            color: "#F3CC09", // <= RECOMMENDED to assign color
                              broadcastPastEvents: true,
},
                            ]
                        }
                  },
                {
                        disabled: true,
                        module: "compliments",
                        position: "lower_third"
                },
                {
                        disabled: true,
                        module: "weather",
                        position: "top_right",
                        config: {
                                weatherProvider: "openweathermap",
                                type: "current",
                                location: "New York",
                                locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
                                apiKey: "YOUR_OPENWEATHER_API_KEY"
                        }
                },
                {
                        disabled: true,
                        module: "weather",
                        position: "top_right",
                        header: "Weather Forecast",
                        config: {
                                weatherProvider: "openweathermap",
                                type: "forecast",
                                location: "New York",
                                locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
                                apiKey: "YOUR_OPENWEATHER_API_KEY"
                        }
                },
                {
                        module: "newsfeed",
                        position: "top_left",
                        classes: 'page1',
			config: {
                                feeds: [
                                        {
                                                title: "New York Times",
                                                url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
                                        }
                                ],
                                showSourceTitle: true,
                                showPublishDate: true,
                                broadcastNewsFeeds: true,
                                broadcastNewsUpdates: true,
                        },
                },
		{
			module: 'MMM-KeyBindings',
    		config: {
				evdev: { enabled: false },
        		enableKeyboard: true
			},
		},

// PAGE 1
            {
                module: "MMM-CalendarExt3", //https://github.com/MMRIZE/MMM-CalendarExt3
                position: "bottom_bar",
                config: {
                  locale: 'de-DE',
		  fontSize: '18px',
		  eventHeight: '25px',
                  maxEventLines: 5,
                  firstDayOfWeek: 1,
                  broadcastPastEvents: true, // <= IMPORTANT to see past events
                  displayLegend: false,
		  calendars: [ //Kalender müssen auch im Standardmodul eingefügt werden um angezeigt werden zu können
                  {
                    url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics",
                    name: "us_holiday", // <= RECOMMENDED to assign name
                    color: "#F3CC09", // <= RECOMMENDED to assign color
              		broadcastPastEvents: true,
},
            {
              url: "webcal://p139-caldav.icloud.com/published/2/NDE0NTgzMjUzNDE0NTgzMkBOsXgeZlmdfJEDq41WDh3ohZWpCkiDlE4S6L5lLD7NiEXhgDhThE3ZMqBq0cesTr1RTz1LoMBBsyYTgTTJ0Fc",
              name: "Home-Calendar",
              color: "#09F38C",
		broadcastPastEvents: true,
            },
            {
              url: "webcal://p139-caldav.icloud.com/published/2/NDE0NTgzMjUzNDE0NTgzMkBOsXgeZlmdfJEDq41WDh10mqt2Xx0Cf-r_VZcMWvUIlHuUciwALfmQrjgqNFrljL8Ozw1G-cVsnV0HbOenFmc",
              name: "Work-Calendar",
              color: "#0990F3",
		broadcastPastEvents: true,
            },
      ],
    }
},

{
  module: 'MMM-Notion', //https://github.com/choffmann/MMM-Notion
  position: 'top right',
  config: {
    updateInterval: 60000,
    secret: "SECRET HERE",
    databases: [
      {
        title: "Home-List",
        id: "NOTION ID HERE",
        layout: {
          type: "listview",
          showPersonWithNames: true,
	  displayElementTitle: false,
          dateFormat: "full_date", // Use 'full_date', 'month_day_year', or 'day_month_year'
          properties: ["Person", "Name", "Status"] // Adjusted to match your requirement
        },
        filter: {
          "property": "Checkbox",
          "checkbox": {
            "equals": false
          }
        },
            sorts: [
        {
            "property": "Status",
            "direction": "descending"
        }]
      },
      {
        title: "Birthdays",
        id: "NOTION ID HERE",
        layout: {
          type: "listview",
          displayElementTitle: false,
          dateFormat: "full_date", // Use 'full_date', 'month_day_year', or 'day_month_year'
          properties: ["Name", "AgeHC", "Years", "Birthday",]
        },
        filter: {
          "property": "Checkbox",
          "checkbox": {
            "equals": false
          }
        },
            sorts: [
        {
            "property": "BirthdayCalc",
            "direction": "ascending"
        }]
      },
    ]
  }
},


// Page 2

{
    module: "MMM-OpenWeatherMapForecast", //https://github.com/MarcLandis/MMM-OpenWeatherMapForecast
    header: "Hourly Weather",
    position: "bottom_left",
    classes: "default everyone",
    disabled: false,
    config: {
      apikey: "OPENWEATHER API KEY HERE",
      language: "de",
      units: "metric",
      hourlyForecastInterval: 2,
      showSummary: false,
      maxDailiesToShow: 0, // Set to 0 to not show daily forecasts
      maxHourliesToShow: 7, // Set to the number of hourly forecasts you want to show
      label_timeFormat: "k[h]",
      latitude: "52.3",
      longitude: "13.2667",      
      iconset: "6fa",
      concise: true, // Set to true to make it more compact if preferred
      forecastLayout: "tiled"
    }
},
{
    module: "MMM-OpenWeatherMapForecast", //https://github.com/MarcLandis/MMM-OpenWeatherMapForecast
    header: "Daily Weather",
    position: "bottom_left",
    classes: "default everyone",
    disabled: false,
    config: {
      apikey: "OPENWEATHER API KEY HERE",
      language: "de",
      units: "metric",
      showCurrentConditions: false,
      showExtraCurrentConditions: false,
      showSummary: false,
      maxDailiesToShow: 10, // Set to the number of daily forecasts you want to show
      maxHourliesToShow: 0, // Set to 0 to not show hourly forecasts
      label_timeFormat: "k[h]",
      latitude: "52.3",
      longitude: "13.2667",      
      iconset: "6fa",
      concise: true, // Set to true to make it more compact if preferred
      forecastLayout: "tiled"
    }
},
{
    module: 'MMM-DWD-WarnWeather', //https://github.com/LukeSkywalker92/MMM-DWD-WarnWeather
    position: 'top_right',
    //header: 'Wetterwarnungen',
    config: {
            region: 'Ludwigsfelde',
            changeColor: true,
            minutes: false,
	    longversion: false, 
            displayRegionName: false,
            displayInnerHeader: true,
            interval: 10 * 60 * 1000, // every 10 minutes
            loadingText: 'Warnungen werden geladen...',
            noWarningText: 'Keine Warnungen',
            severityThreshold: 2
    }
},
{
    module: 'MMM-AirQuality', //https://github.com/CFenner/MMM-AirQuality
    position: 'top_right', // you may choose any location
    header: 'Luftqualität', //choose a header if you like
    config: {
      lang: 'de',
      showLocation: 'true',
      location: 'germany/brandenburg/potsdam-zentrum/' // the location to check the index for
    }
},
{
    module: "MMM-RAIN-MAP",
    position: "bottom_right",
    config: {
     animationSpeedMs: 400,
     colorScheme: 2,
     colorizeTime: true,
     defaultZoomLevel: 25,
     displayTime: true,
     displayTimeline: true,
     displayClockSymbol: true,
     displayHoursBeforeRain: -1,
     extraDelayLastFrameMs: 1000,
     extraDelayCurrentFrameMs: 3000,
     markers: [
      { lat: 52.3, lng: 13.2667, color: "green" },
     ],
     mapPositions: [
      { lat: 52.3, lng: 13.2667, zoom: 9, loops: 1 }, //multiple Map Positions possible, Widget will rotate through maps
     ],
     mapUrl: "https://a.tile.openstreetmap.de/{z}/{x}/{y}.png",
     mapHeight: "510px", // must be a pixel value (no percent)
     mapWidth: "510px", // must be a pixel value (no percent)
     maxHistoryFrames: -1,
     maxForecastFrames: -1,
     substitudeModules: [],
     updateIntervalInSeconds: 600000,
    }
}, 
{
module: "MMM-WeatherDependentClothes",
		position: "top_left", // This can be any of the regions.
		config: {
			// See 'Configuration options' for more information.
			location: "Ludwigsfelde,Germany",
			locationID: "2875379", //Location ID from http://bulk.openweathermap.org/sample/city.list.json.gz
			appid: "OPENWEATHER API KEY HERE", //openweathermap.org API key.
preferences: [
			{
				name: "Freezing",
				icon: "cold",
				conditions: {
					temp_max: 0,
				}
			},
			{
				name: "HeavyRain",
				icon: "wet",
				conditions: {
					rainfall_min: 14,
				}
			},
			{
				name: "HeavyWind",
				icon: "wind",
				conditions: {
					windSpeed_min: 10,
				}
			},
			{
				name: "Sandalen",
				icon: "sandals",
				conditions: {
					temp_min: 28.0,
				}
			},
			{
				name: "Schuhe",
				icon: "shoes",
				conditions: {
					temp_min: 0.0,
					temp_max: 28.0,
				}
			},
			{
				name: "warme Hose",
				icon: "pants-cold",
				conditions: {
					temp_max: 8.0,
				},
			},
			{
				name: "lange Hose",
				icon: "pants",
				conditions: {
					temp_min: 8.0,
					temp_max: 16.0,
				},
			},
			{
				name: "kurze Hose",
				icon: "shorts",
				conditions: {
					temp_min: 16.0,
				},
			},
						{
				name: "Winterjacke",
				icon: "jacket-cold",
				conditions: {
					temp_max: 2.0,
				},
			},
			{
				name: "Jacke",
				icon: "jacket",
				conditions: {
					temp_min: 2.0,
					temp_max: 9.0,
					rainfall_max: 3,
				},
			},
			{
				name: "Regenjacke",
				icon: "jacket-wet",
				conditions: {
					temp_min: 2.0,
					temp_max: 9.0,
					rainfall_min: 3,
				},
			},
			{
				name: "Pullover",
				icon: "hoodie",
				conditions: {
					temp_min: 9.0,
					temp_max: 14.0,
				},
			},
			{
				name: "langes Shirt",
				icon: "shirt",
				conditions: {
					temp_min: 14.0,
					temp_max: 17.0,
				},
			},
			{
				name: "kurzes T-Shirt",
				icon: "shirt-t",
				conditions: {
					temp_min: 17.0,
				},
			},
			{
				name: "Regenschirm",
				icon: "umbrella2",
				conditions: {
					rainfall_min: 4, // mm
				},
			},
			{
				name: "Sonnenbrille",
				icon: "sunglasses",
				conditions: {
					weather: "clear",
				},
			},
			{
				name: "Sonnenbrille",
				icon: "sunglasses",
				conditions: {
					weather: "clouds",
					cloudDensity_max: 50,
				},
			},
			{
				name: "Hut",
				icon: "hat",
				conditions: {
					windSpeed_min: 6.0,
				}
			},
		],		},
},


// Page 3 - Stock Information

{
	module: "MMM-AVStock",
	position: "top_right", // Aktualisierte Position
	config: {
	  symbols: ["URTH", "SNPE", "QQQM", "DAX", "JPXN"], // Beispielhafte Symbole für Dow Jones, S&P 500, NASDAQ, FTSE 100, Nikkei 225, DAX
	  alias: ["MSCI World","S&P 500", "NAS-DAQ", "DAX", "Nikkei 400"],
	  chartDays: 90,
	  chartType: 'candlestick',
	  chartInterval: "daily",
	  mode: "grid", // Nur das Grid anzeigen
	  direction: "column",
	  showChart: false, // Chart nicht anzeigen
	  // Weitere Konfigurationen für das Grid ...
	}
  },		  
		{
			module: "MMM-AVStock",
			position: "top right", // Position für das Grid
			config: {
			  symbols: ["AAPL", "MSFT", "NFLX", "GOOGL","NVDA"],
			  chartDays: 90,
			  chartType: 'candlestick',
			  chartInterval: "daily",
			  mode: "grid", // Nur das Grid anzeigen
			  direction: "column",
			  width: null,
			  showChart: false, // Chart nicht anzeigen
			  // Weitere Konfigurationen für das Grid ...
			}
		  },
		  {
			module: "MMM-AVStock",
			position: "top right", // Position für das Grid
			config: {
			  symbols: ["AMZN", "PYPL", "TSLA", "BNTX", "JNJ"],
			  chartDays: 90,
			  chartType: 'candlestick',
			  chartInterval: "daily",
			  mode: "grid", // Nur das Grid anzeigen
			  direction: "column",
			  width: null,
			  showChart: false, // Chart nicht anzeigen
			  // Weitere Konfigurationen für das Grid ...
			}
		  },
		  {
			module: "MMM-AVStock",
			position: "top_right", // Position für das Grid
			config: {
			  symbols: ["MTCH", "NEE", "PG", "BTC-USD", "ETH-USD"],
          		  alias: ["MTCH","NEE", "PG", "BTC USD", "ETH USD"], 
			  chartDays: 90,
			  chartType: 'candlestick',
			  chartInterval: "daily",
			  mode: "grid", // Nur das Grid anzeigen
			  direction: "column",
			  width: null,
			  showChart: false, // Chart nicht anzeigen
			  // Weitere Konfigurationen für das Grid ...
			}
		  },
                  {
                        //disabled:true,
                        module: "MMM-AVStock",
                        position: "bottom_right",
                        config: {
                                timeFormat: "DD-MM HH:mm",
                                width: "600",
                                symbols : ["AAPL", "MSFT", "NFLX", "GOOGL", "AMZN", "PYPL", "TSLA", "BNTX", "MTCH", "NEE", "BTC-USD", "ETH-USD"],
                                alias: ["AAPL", "MSFT", "NFLX", "GOOGL", "AMZN", "PYPL", "TSLA", "BNTX", "MTCH", "NEE", "BTC-USD", "ETH-USD"],
                                purchasePrice: [123.45, 1234.56, 12.34, 1],
                                locale: "de",
                                tickerDuration: 999999999999,
                                chartDays: 90,
                                maxTableRows: null,
                                mode : "ticker",                  // "table" or "ticker"
                                showChart: true,
                                pureLine: false,
                                chartWidth: 600,
                                showVolume: false,
                                chartInterval: "daily",          // choose from ["intraday", "daily", "weekly", "monthly"]
                                decimals : 2,
                                chartType: 'candlestick',                // 'line', 'candlestick', or 'ohlc'
                                chartLineColor: '#eee',
                                chartLabelColor: '#eee',
                                coloredCandles: true,
                                showPurchasePrices: false,
                                showPerformance2Purchase: false,
                                debug: false
                        }
                },		{
			module: "MMM-FearAndGreedIndex",
			position: "top_left", // You can change the position according to your layout
			config: {
				updateInterval: 3600000, // or your desired interval
				filename: 'data.json'    // Ensure this is correctly set
			}
		},



{
  module: "MMM-News", //https://github.com/eouia/MMM-News
  position: "bottom_left",
  config: {
    apiKey : "NEWS.ORG API KEY HERE",
    type: "horizontal",
    query : [
      {
        sources: "reuters, cnn, the-wall-street-journal, bloomberg",
      },
      {
        country: 'null',
        category: "business",
      }
    ],
  }
},




// Seite 4 //
{
    module: "MMM-Bring",
    position: "bottom_bar",
    config: {
       email: "BRING EMAIL HERE",
       password: "PASSWORD HERE",
       updateInterval: 1, // in Minutes
       listName: "Villa kunterbund", // optional
       showListName: true,
       activeItemColor: "#EE524F",
       latestItemColor: "#4FABA2",
       showLatestItems: false,
       maxItems: 0,
       maxLatestItems: 0,
       locale: "de-DE",
       useKeyboard: false,
       customTitle: "My shopping list", // optional
       listDropdown: true
    }
},


// Seite 5 //
{
    module: "MMM-EasyPix",
	position: "fullscreen_below",
	config: {
		picName: "2.png", // Enter the picture file name.
		maxWidth: "100%",        // Size picture precisely. Retains aspect ratio.
		sounds: [],  // mp3 sound file names in quotes seperated by commas for Hello-Lucy
		updateInterval: 30 * 60 * 1000,     // updates display
	        animationSpeed: 3000,
	}
},
// BackgroundSlideShow
  {
    module: 'MMM-BackgroundSlideshow',
    position: 'fullscreen_below',
    config: {
      imagePaths: ['modules/MMM-BackgroundSlideshow/exampleImages/'],
      transitionImages: false,
      randomizeImageOrder: true,
slideshowSpeed: 600000,
    }
  },

// Carousel for Slide-Change
		{
		module: 'MMM-Carousel',
		position: 'bottom_bar', // Required only for navigation controls
		config: {
			transitionInterval: 0,
			ignoreModules: ['clock'],
			mode: 'slides',
			showPageIndicators: true,
			showPageControls: true,
			slides: {
				main: ['MMM-BackgroundSlideshow', 'newsfeed', 'MMM-CalendarExt3', 'MMM-Notion'],
				"Slide 2": ['MMM-BackgroundSlideshow', 'MMM-OpenWeatherMapForecast', 'MMM-DWD-WarnWeather', 'MMM-AirQuality', 'MMM-RAIN-MAP', 'MMM-WeatherDependentClothes'],
				"Slide 3": ['MMM-BackgroundSlideshow', 'MMM-FearAndGreedIndex', 'MMM-AVStock', 'MMM-News'],
				"Slide 4": ['MMM-BackgroundSlideshow', 'MMM-Bring'],
				"Slide 5": ['MMM-EasyPix'],
				},
			keyBindings: { 
				enabled: true,
				enableKeyboard: true,
				mode: "DEFAULT",
				map: {
					NextSlide: "ArrowRight", 
					PrevSlide: "ArrowLeft", 
					Slide0:    "Home"
				},
				
			}},
		},


]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
