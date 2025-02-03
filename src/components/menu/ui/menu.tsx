import { memo } from 'react';
import home from '../../../assets/menu/home.svg';
import search from '../../../assets/menu/search.svg';
import FadeUpWrapper from '../../../utils/fade-up-animation/ui/fade-up';
import { NavLink } from 'react-router';

export const Menu = memo(() => {
	return (
		<FadeUpWrapper delay={300}>
			<div className="menu-container">
				<NavLink to="/">
					<button className="button">
						<img src={home} alt="projects-home-page" />
					</button>
				</NavLink>

				<button className="button">
					<img src={search} alt="seacrh" />
				</button>
			</div>
		</FadeUpWrapper>
	);
});
