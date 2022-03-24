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
	themeName = "";

	init = (themeName) => {
		this.themeName = themeName;

		let themes = require("./theme.json");
		for (const name in themes) {
			if (name === themeName) {
				for (const key in themes[name]) {
					document.getElementsByTagName("body")[0].style.setProperty(key, themes[name][key]);
				}
			}
		}
	};
}

let theme = new Theme();

export default theme;
