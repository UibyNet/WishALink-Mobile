var fs = require('fs')
var capacitorConfigFile = './capacitor.config.ts';
var androidGradleFile = './android/app/build.gradle';
var iosProjectFile = './ios/App/App.xcodeproj/project.pbxproj';

fs.readFile(capacitorConfigFile, 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}

	let versionName = '';
	let versionCode = '';

	
	const lines = data.split(/\r?\n/);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (line.indexOf('versionName:') > -1) {
			const lineParts = line.split('versionName:');
			const lineDataParts = lineParts[1].split('"').filter(x => x.length > 1)
			versionName = lineDataParts[0];
		}
		else if (line.indexOf('versionCode:') > -1) {
			const lineParts = line.split(':');
			versionCode = lineParts[1].replace(',', '').trim();
		}
	}

	updateAndroidVersion(versionName, versionCode);
	updateiOSVersion(versionName, versionCode);
});

function updateAndroidVersion(versionName, versionCode) {
	fs.readFile(androidGradleFile, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const lines = data.split(/\r?\n/);

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.indexOf('versionName ') > -1) {
				const lineParts = line.split('versionName ');
				lineParts[1] = '"' + versionName + '"';
				lines[i] = lineParts.join('versionName ');
			}
			else if (line.indexOf('versionCode ') > -1) {
				const lineParts = line.split('versionCode ');
				lineParts[1] = versionCode;
				lines[i] = lineParts.join('versionCode ');
			}
		}

		data = lines.join('\n');

		fs.writeFile(androidGradleFile, data, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
}

function updateiOSVersion(versionName, versionCode) {
	fs.readFile(iosProjectFile, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const lines = data.split(/\r?\n/);

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.indexOf('MARKETING_VERSION = ') > -1) {
				const lineParts = line.split('MARKETING_VERSION = ');
				lineParts[1] = versionName + ';';
				lines[i] = lineParts.join('MARKETING_VERSION = ');
			}
			else if (line.indexOf('CURRENT_PROJECT_VERSION = ') > -1) {
				const lineParts = line.split('CURRENT_PROJECT_VERSION = ');
				lineParts[1] = versionCode + ';';
				lines[i] = lineParts.join('CURRENT_PROJECT_VERSION = ');
			}
		}

		data = lines.join('\n');

		fs.writeFile(iosProjectFile, data, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
}