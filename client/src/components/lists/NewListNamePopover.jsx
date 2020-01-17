import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import FetchWrapper from '../../utils/FetchWrapper';
import InputValidation from '../../utils/InputValidation';

function NewListNamePopover({ anchorEl, popoverClose, uid }) {
	const open = Boolean(anchorEl);
	const [name, setName] = useState('');
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState('');

	const nameChange = event => {
		setName(event.target.value);
	};

	async function submitClick() {
		let err = InputValidation.validateListName(name);
		if (err) {
			setError(true);
			setHelperText(err.message);
			return;
		}
		setError(false);
		setHelperText('');

		const response = await FetchWrapper.post(`/api/create/new_list/${uid}`, { listName: name });
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

export default NewListNamePopover;