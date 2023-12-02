/* MagicMirror² Config Sample
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
                    position: "top_left"
            },
            {
                    disabled: true,
                    module: "calendar",
                    header: "Home-Calendar",
                    position: "top_left",
                    config: {
                      calendars: [
                            {
                              fetchInterval: 7 * 24 * 60 * 60 * 1000,
                             symbol: "calendar-check",
                              url: "https://p139-caldav.icloud.com/published/2/NDE0NTgzMjUzNDE0NTgzMkBOsXgeZlmdfJEDq41WDh3ohZWpCkiDlE4S6L5lLD7NiEXhgDhThE3ZMqBq0cesTr1RTz1LoMBBsyYTgTTJ0Fc",
                              color: "#09F38C",
                            },
                            {
                              url: "https://p139-caldav.icloud.com/published/2/NDE0NTgzMjUzNDE0NTgzMkBOsXgeZlmdfJEDq41WDh10mqt2Xx0Cf-r_VZcMWvUIlHuUciwALfmQrjgqNFrljL8Ozw1G-cVsnV0HbOenFmc",
                              name: "Work-Calendar",
                              symbol: 'calendar',
                              color: "#0990F3",
                              },
                              {
                            url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics",
                            name: "us_holiday", // <= RECOMMENDED to assign name
                            color: "#F3CC09" // <= RECOMMENDED to assign color
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
                        }
                },
          {
                module: 'MMM-pages',
                config: {
                  modules: [
                        ["newsfeed", "MMM-CalendarExt3", "MMM-Notion"], // Page 0
                        ["MMM-OpenWeatherMapForecast", "MMM-DWD-WarnWeather", "MMM-AirQuality", "MMM-RAIN-MAP"], // Page 1
                        ["MMM-Jast", "MMM-AVStock", "MMM-NewsAPI"] // Page 2
                  ],
                  fixed: ["clock", "MMM-page-indicator"]
                }
          },
          {
            module: 'MMM-page-indicator',
            position: 'bottom_bar',
            config: {
              pages: 3 // oder 4, je nach tatsächlicher Seitenanzahl
            }
        },
        {
            module: 'MMM-KeyBindings',
            config: {
                enableKeyboard: true,
                evdev: { enabled: false },
                handleKeys: ['ArrowRight', 'ArrowLeft'],
                keyBindings: {
                    enabled: true,
                    map: {
                        ArrowRight: "PAGE_INCREMENT",
                        ArrowLeft: "PAGE_DECREMENT"
                    }
                }
            }
        },
        


// PAGE 1
            {
                module: "MMM-CalendarExt3", //https://github.com/MMRIZE/MMM-CalendarExt3
                position: "bottom_bar",
                config: {
                  locale: 'de-DE',
                  maxEventLines: 5,
                  firstDayOfWeek: 1,
                  broadcastPastEvents: true, // <= IMPORTANT to see past events
                  calendars: [ //Kalender müssen auch im Standardmodul eingefügt werden um angezeigt werden zu können
                  {
                    url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics",
                    name: "us_holiday", // <= RECOMMENDED to assign name
                    color: "#F3CC09" // <= RECOMMENDED to assign color
              },
            {
              url: "webcal://p139-caldav.icloud.com/published/2/NDE0NTgzMjUzNDE0NTgzMkBOsXgeZlmdfJEDq41WDh3ohZWpCkiDlE4S6L5lLD7NiEXhgDhThE3ZMqBq0cesTr1RTz1LoMBBsyYTgTTJ0Fc",
              name: "Home-Calendar",
              color: "#09F38C",
            },
            {
              url: "webcal://p139-caldav.icloud.com/published/2/NDE0NTgzMjUzNDE0NTgzMkBOsXgeZlmdfJEDq41WDh10mqt2Xx0Cf-r_VZcMWvUIlHuUciwALfmQrjgqNFrljL8Ozw1G-cVsnV0HbOenFmc",
              name: "Work-Calendar",
              color: "#0990F3",
            },
      ],
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
      apikey: "de4e2a7e154933dc1c1e61370f9a2f0b",
      language: "de",
      units: "metric",
      hourlyForecastInterval: 2,
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
      apikey: "de4e2a7e154933dc1c1e61370f9a2f0b",
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
            displayRegionName: true,
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
     defaultZoomLevel: 8,
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
     mapHeight: "540px", // must be a pixel value (no percent)
     mapWidth: "540px", // must be a pixel value (no percent)
     maxHistoryFrames: -1,
     maxForecastFrames: -1,
     substitudeModules: [],
     updateIntervalInSeconds: 300,
    }
}, 
{
    module: 'MMM-Carousel',
    config: {
        transitionInterval: 10000, // Wechselintervall in Millisekunden
        ignoreModules: ['clock', 'alert'],
        mode: 'slides',
        slides: [
            ['newsfeed', 'MMM-CalendarExt3', 'MMM-Notion'], 
            ['MMM-OpenWeatherMapForecast', 'MMM-DWD-WarnWeather', 'MMM-AirQuality', 'MMM-RAIN-MAP'],
            ['MMM-Jast', 'MMM-AVStock', 'MMM-NewsAPI']
        ],
                keyBindings: { 
                        enabled: true,
                        enableKeyboard: true,
                        mode: "DEFAULT",
                        map: {
                                NextSlide: "ArrowRight", 
                                PrevSlide: "ArrowLeft", 
                                Slide0:    "Home"
                        },
                        
                },
    }
},


]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
