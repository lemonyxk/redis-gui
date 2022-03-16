// define:
// $labelFontColor: var(--label-font-color, red);

// in scss:
//
// @import "/src/theme/theme.scss";

// body {
// 	background-color: $labelFontColor;
// }

// in js:
//

class Theme {
	init = (themeName) => {
		var themes = require("./theme.json");
		for (const name in themes) {
			if (name === themeName) {
				for (const key in themes[name]) {
					document.getElementsByTagName("body")[0].style.setProperty(key, themes[name][key]);
				}
			}
		}
	};
}

export default new Theme();