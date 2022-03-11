Array.prototype.pushAll = function (iterable) {
	for(const element of iterable) {
		this.push(element);
	}
}

export function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function downloadText(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 * from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
export function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

/**
 * Creates a random sample of size elements from array without shuffeling the whole array
 * from https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
 * @param {*} array full list of elements 
 * @param {*} size number of elements in the sample
 * @returns random sample of the array
 */
export function randomSample(array, size) {
	if(size >= array.length) {
		return shuffle(array);
	}
	
	var shuffled = array.slice(0), i = array.length, min = i - size, temp, index;
	while (i-- > min) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
	}
	return shuffled.slice(min);
}

/**
 * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 */
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

export function inBounds(x, y, array) {
	return x >= 0 && x < array.length && y >= 0 && y < array[0].length;
}

export function print2d(array, toString= v=>v) {
	let cells = [];

	for (let x = 0; x < array.length; x++) {
		cells[x] = [];
		for (let y = 0; y < array[x].length; y++) {
			cells[x][y] = toString(array[x][y]);
		}
	}

	console.table(cells);
}

export function log(s) {
	console.log(s);
}