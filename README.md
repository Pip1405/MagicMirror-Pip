# MagicMirror Configuration

## Installation

To install the MagicMirror configuration with all modules, follow these steps:

1. Clone the repository:
run: "git clone https://github.com/Pip1405/MagicMirror-Pip"

2. Navigate to the MagicMirror directory:
run: "cd MagicMirror-Pip"

3. Install the MagicMirror² framework:
run: "npm install"

4. Run the installation script to clone third-party modules:
run: "./install.sh"

5. Configuration
Configure your MagicMirror² by editing the config.js file. my configuration and a sample config is provided in the repository. Adjust the settings such as port, IP whitelist, language, and modules to fit your needs.

6. Modules Configuration
Each module in the modules array of your config.js file has its own configuration block. For example:

javascript
Copy code
{
    module: "clock",
    position: "top_left",
    config: {
        dateFormat: "dddd, D. MMM YYYY"
    }
},

Replace placeholders such as YOUR_OPENWEATHER_API_KEY with your actual API keys. For modules that require personal data, like calendars, ensure the URLs point to your personal iCal feeds.

You can find the configuration details for each module on the module's GitHub page here:
https://github.com/CFenner/MMM-AirQuality
https://github.com/lavolp3/MMM-AVStock
https://github.com/darickc/MMM-BackgroundSlideshow
https://github.com/werthdavid/MMM-Bring
https://github.com/MMRIZE/MMM-CalendarExt3
https://github.com/shbatm/MMM-Carousel
https://github.com/bibaldo/MMM-COVID19
https://github.com/LukeSkywalker92/MMM-DWD-WarnWeather
https://github.com/mykle1/MMM-EasyPix
https://github.com/jalibu/MMM-Jast
https://github.com/shbatm/MMM-KeyBindings
https://github.com/eouia/MMM-News
https://github.com/mumblebaj/MMM-NewsAPI
https://github.com/choffmann/MMM-Notion
https://github.com/MarcLandis/MMM-OpenWeatherMapForecast
https://github.com/jalibu/MMM-RAIN-MAP
https://github.com/fruestueck/MMM-WeatherDependentClothes


7. Custom CSS
You can style your MagicMirror² by editing the custom.css file. The repository includes a custom CSS file that you can modify to change the look and feel of your mirror. The custom.css file is optimized for the use of a Surface Book Screen. See Customizing Options below the intro. 

8. Running MagicMirror
Start your MagicMirror² with the following command:
run: "npm start"



# Customizing MagicMirror² Appearance

The `custom.css` file allows you to personalize the appearance of your MagicMirror². Below is an overview of the customization options available and instructions on how to adjust them to fit your screen size and aesthetic preferences.

## Root Variables
You can define global style variables at the root level which can be reused throughout your CSS.

- `--color-text`: Sets the default text color.
- `--color-background`: Sets the background color of the mirror.
- `--font-primary`: Sets the primary font family.
- `--font-size`: Sets the default font size.

## Global Module Adjustments
You can globally adjust the margin for all modules, which can be particularly helpful for different screen sizes.

```css
.module {
  margin: -35px; /* Adjust this value to increase or decrease the space around modules. */
}


Clock Module
.module.clock .time {
  font-size: 100px; /* Adjust the clock time font size. */
}
.module.clock .date {
  font-size: 50px; /* Adjust the clock date font size. */
}

Carousel Navigation
.slider-pagination label {
  width: 15px; /* Adjust the width of the carousel indicators. */
  height: 15px; /* Adjust the height of the carousel indicators. */
}

Newsfeed Module
.newsfeed .newsfeed-title,
.newsfeed .newsfeed-desc,
.newsfeed .newsfeed-source {
  font-size: 30px; /* Adjust the font size of the newsfeed items. */
  max-width: 700px; /* Adjust the maximum width to fit your screen. */
}

Adjusting for Screen Size
When adjusting for different screen sizes, you may want to consider the following:
Module Width: Control the maximum width of modules to ensure they fit within your screen bounds.
Font Sizes: Increase or decrease font sizes to ensure readability from your viewing distance.
Margins and Padding: Adjust the spacing around and between modules for a cleaner look.

Example: Adjusting Calendar Module for a Wider Screen
.CX3 {
  width: 1200px; /* Increase the width for wider screens. */
  margin-bottom: -45px; /* Adjust the bottom margin. */
}

Remember to refresh your MagicMirror² after making changes to the custom.css file to see the updates take effect. If you're not comfortable with CSS, there are many online resources and communities that can help you learn how to make these adjustments.


