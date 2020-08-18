import React, { createContext } from 'react';
import { store } from '.';
import { ipcRenderer } from 'electron';

const State = createContext();
const Dispatch = createContext();

const reducer = (state, action) => {
	console.log(state, action)
	switch (action.action) {
		case "set":
			state[action.i].title = action.title;
			state[action.i].time = Date.now();
			state[action.i].content = action.content;
			state[action.i].username = action.username;
			state[action.i].avatar = action.avatar;
			state[action.i].embeds = content.embeds;
			break;
		case "add":
			state.push({ title: "New Message", time: Date.now(), content: "", 
						username: "", avatar: "", embeds: [] })
			break;
		case "reset":
			state = [];
			break;
		default:
			break;
	}
	store.set('messages', state);
	return state;
}

const Provider = ({ children }) => {
	if (!store) return null;
	let messages = store.get('messages');
	console.log('123', messages)
	const [state, dispatch] = React.useReducer(reducer, messages);

	return (
		<State.Provider value={state}>
			<Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
		</State.Provider>
	);
}

export const Messages = {
	State,
	Dispatch,
	Provider
};