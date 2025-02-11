export function saveState<T>(key: string, state: T) {
	const stateAsString = JSON.stringify(state);
	localStorage.setItem(key, stateAsString);
}

export function restoreState<T>(key: string) {
	let state = null;
	const stateAsString = localStorage.getItem(key);
	if (stateAsString !== null) state = JSON.parse(stateAsString) as T;
	return state;
}
