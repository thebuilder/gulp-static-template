module.exports = function(func, wait, immediate) {
	var timeout, args, context, result;

	function debounce() {
		context = this;
		args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait || 100);
		if (callNow) {
			result = func.apply(context, args);
		}
		return result;
	}

	/**
	 * Cancel the current timeout
	 */
	debounce.cancel = function () {
		if (timeout) clearTimeout(timeout);
		timeout = null;
	};

	return debounce;
};