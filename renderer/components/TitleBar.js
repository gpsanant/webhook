import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Box } from '@material-ui/core';
import { Close, Remove, Add } from '@material-ui/icons';
import { remote } from 'electron';

// const gui = window.require('nw.gui');
var win;
if (remote)
	win = remote.getCurrentWindow();

const useStyles = makeStyles(() => ({
	root: {
		WebkitAppRegion: 'drag',
		width: '100vw',
		height: '64px',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'flex-end',
		'& > button': {
			WebkitAppRegion: 'no-drag',
			height: 48,
			opacity: .25
		},
		'& > .close': {
			marginRight: 16
		}
	},
}));

export default function TitleBar() {
	const classes = useStyles();
	return (
		<Box display="flex" className={classes.root}>
			<IconButton onClick={() => win.minimize()}>
				<Remove />
			</IconButton>
			<IconButton onClick={() => win.isMaximized() ? win.unmaximize() : win.maximize()}>
				<Add />
			</IconButton>
			<IconButton className='close' onClick={() => win.close()}>
				<Close />
			</IconButton>
		</Box>
	);
}