var fs = require('fs')
var apiServicesPath = './src/app/services/';

function updateApiServiceFile(apiServiceFile) {
	fs.readFile(apiServiceFile, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const lines = data.split(/\r?\n/);
		let isFileChanged = false;
		let isFileAlreadyChanged = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if(line.indexOf('getFileReader()') > -1) {
				isFileAlreadyChanged = true;
			}

			if (line.indexOf('new FileReader()') > -1) {
				isFileChanged = true;
				lines[i] = line.replace('new FileReader()', 'getFileReader()');
			}

		}

		data = lines.join('\n');

		if(isFileChanged && !isFileAlreadyChanged) {
			data += `
export function getFileReader(): FileReader {
	const fileReader = new FileReader();
	const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
	return zoneOriginalInstance || fileReader;
}`;

			fs.writeFile(apiServiceFile, data, 'utf8', function (err) {
				if (err) return console.log(err);
			});
		}
	});
}

fs.readdir(apiServicesPath, (err, files) => {
	files.forEach(file => {
		if(file.indexOf('api-') === 0) {
			updateApiServiceFile(apiServicesPath + file);
		}
	});
  });
