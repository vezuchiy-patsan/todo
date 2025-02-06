import { applyMiddleware, combineReducers, createStore } from 'redux';

import projectsReducer from './reducers/projectsReducers';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { composeWithDevTools } from '@redux-devtools/extension';

import tasksReducer from './reducers/tasksReducers';
import { ProjectsState } from './types/projects';
import { TasksState } from './types/tasks';
import { saveState } from '../../utils/localStorage/localStorage';

export interface ReduxState extends ProjectsState, TasksState {}

const rootReducer = combineReducers({
	projects: projectsReducer,
	tasks: tasksReducer,
});

export const store = createStore(
	rootReducer,
	{},
	composeWithDevTools(applyMiddleware()),
);

window.addEventListener('beforeunload', () => {
	const currentState = store.getState();
	saveState('state', {
		projects: currentState.projects.projects,
		tasks: currentState.tasks.tasks,
	});
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
