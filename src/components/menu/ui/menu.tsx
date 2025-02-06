import { memo, useEffect, useRef, useState } from 'react';
import home from '../../../assets/menu/home.svg';
import search from '../../../assets/menu/search.svg';
import CloseIcon from '../../../assets/card/delete.svg';
import FadeUpWrapper from '../../../utils/fade-up-animation/ui/fade-up';
import { NavLink, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { TasksActionsTypes } from '../../../app/store/types/tasks';

export const Menu = memo(() => {
	const dispatch = useDispatch();

	const { pathname } = useLocation();

	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const inputRef = useRef<HTMLInputElement | null>(null);

	const toggleSearch = () => {
		setIsSearchVisible((prev) => !prev);
		setSearchQuery('');
	};

	const handleSearch = (query: string): void => {
		setSearchQuery(query);
	};

	const clearSearch = () => {
		setSearchQuery(() => '');
	};

	useEffect(() => {
		const match = pathname.match(/\/projects\/(\d+)\/tasks/);
		if (searchQuery.length > 0) {
			dispatch({ type: TasksActionsTypes.SEARCH_TASK, payload: searchQuery });
		} else if (match && searchQuery.length === 0) {
			dispatch({
				type: TasksActionsTypes.GET_TASK,
				payload: match[1],
			});
		}
	}, [dispatch, pathname, searchQuery]);
	return (
		<>
			{pathname !== '/projects' && (
				<FadeUpWrapper delay={300}>
					<div className="menu-container">
						{isSearchVisible && (
							<div className="search-container">
								<input
									ref={inputRef}
									type="text"
									placeholder="Введите запрос..."
									value={searchQuery}
									onChange={(e) => handleSearch(e.currentTarget.value)}
									className="search-input"
								/>

								<button className="clear-btn" onClick={clearSearch}>
									<img src={CloseIcon} alt="clear" />
								</button>
							</div>
						)}
						<NavLink to="/">
							<button className="button">
								<img src={home} alt="projects-home-page" />
							</button>
						</NavLink>

						<button className="button" onClick={toggleSearch}>
							<img src={search} alt="seacrh" />
						</button>
					</div>
				</FadeUpWrapper>
			)}
		</>
	);
});
