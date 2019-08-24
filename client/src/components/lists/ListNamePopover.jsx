import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import InputValidation from '../../utils/InputValidation';
import FetchUtil from '../../utils/fetchUtil';

function ListNamePopover({ anchorEl, popoverClose, uid }) {
	const open = Boolean(anchorEl);
	const [name, setName] = useState('');
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState('');

	const nameChange = event => {
		setName(event.target.value);
	};

	async function submitClick() {
		try {
			InputValidation.validateListName(name);
		} catch (err) {
			setError(true);
			setHelperText(err.message);
			return;
		}
		setError(false);
		setHelperText('');

		let response = await FetchUtil.put(`/api/create/new_list/${uid}`, { listName: name });
		if (response.ok) {
			setName('');
			return popoverClose();
		}
		const body = await response.json();
		setError(true);
		setHelperText(body.error);
	}

	return (
		<Popover
			id='list-name-popover'
			open={open}
			anchorEl={anchorEl}
			onClose={popoverClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left'
			}}
		>
			<Paper className='item-form-paper-title'>
				<TextField
					id='list-name-popover-id'
					label='List Name'
					value={name}
					onChange={nameChange}
					margin='dense'
					autoFocus={true}
					error={error}
					helperText={helperText}
					fullWidth
				/>
				<Button onClick={submitClick} fullWidth>
					Submit
				</Button>
			</Paper>
		</Popover>
	);
}

export default ListNamePopover;