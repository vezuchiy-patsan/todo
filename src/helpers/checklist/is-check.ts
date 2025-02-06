export const areAllChecked = (html: string) => {
	if (html.length === 0) return true;

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	const items = doc.querySelectorAll('.tox-checklist li');
	const checkedItems = doc.querySelectorAll('.tox-checklist--checked');

	return items.length > 0 && items.length === checkedItems.length;
};
