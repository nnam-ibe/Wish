import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

function ConfirmModal({ open, handleClose, buttonLabels, buttonVariant }) {
	return (
		<Modal
			id='confirm-modal'
			open={open}
			onClose={handleClose}
		>
			<Paper className='item-form-paper-title'>
				Are you sure you want to delete this beauty?
				<ButtonGroup fullWidth>
					<Button
						variant={buttonVariant}
						color={buttonLabels.decline.color}
						onClick={handleClose}
						>
							{buttonLabels.decline.text}
					</Button>
					<Button
						variant={buttonVariant}
						color={buttonLabels.confirm.color}
						onClick={handleClose}
						>
							{buttonLabels.confirm.text}
					</Button>
				</ButtonGroup>
			</Paper>
		</Modal>
	);
}

export default ConfirmModal;