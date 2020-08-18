import React, { cloneElement } from 'react';
import { Messages } from './messages';
import * as ElectronStore from 'electron-store';
import electron from 'electron';

const providers = [
	<Messages.Provider />
];

const Store = ({ children: initial }) =>
	providers.reduce(
		(children, parent) => cloneElement(parent, { children }),
		initial
	);

var store;
if (typeof electron !== 'string') {
	store = new ElectronStore({
		name: 'store', defaults: {
			"messages": [],
		}
	});
}


export { Store, Messages, store };