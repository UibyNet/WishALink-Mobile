var fs = require('fs')
var apiServiceFile = './src/app/services/api.service.ts';

function updateApiServiceFile() {
	fs.readFile(apiServiceFile, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const lines = data.split(/\r?\n/);
		let isFileChanged = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.indexOf('new FileReader()') > -1) {
				isFileChanged = true;
				lines[i] = line.replace('new FileReader()', 'getFileReader()');
			}
		}

		data = lines.join('\n');

		if(isFileChanged) {
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

updateApiServiceFile();