import { memo } from 'react';
import home from '../../../assets/menu/home.svg';
import search from '../../../assets/menu/search.svg';

export const Menu = memo(() => {
	return (
		<div className="menu-container">
			<button className="button">
				<img src={home} alt="projects-home-page" />
			</button>
			<button className="button">
				<img src={search} alt="seacrh" />
			</button>
		</div>
	);
});
