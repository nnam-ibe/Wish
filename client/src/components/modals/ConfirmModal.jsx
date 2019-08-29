import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

function ConfirmModal(props) {
	const modalProps = {
		id: 'confirm-modal',
		className: 'confirm-modal',
		open: props.open
	};
	const declineButtonProps = {
		variant: props.buttonVariant,
		color: props.buttonLabels.decline.color
	};
	const confirmButtonProps = {
		variant: props.buttonVariant,
		color: props.buttonLabels.confirm.color
	};
	if (props.handleClose) {
		modalProps.onClick = props.handleClose(false);
		declineButtonProps.onClick = props.handleClose(false);
		confirmButtonProps.onClick = props.handleClose(true);
	}
	return (
		<Modal {...modalProps}>
			<Paper className='item-form-paper-title'>
				<Typography variant='body1'>
					{props.message}
				</Typography>
				<ButtonGroup fullWidth>
					<Button {...declineButtonProps}>
						{props.buttonLabels.decline.text}
					</Button>
					<Button {...confirmButtonProps}>
						{props.buttonLabels.confirm.text}
					</Button>
				</ButtonGroup>
			</Paper>
		</Modal>
	);
}

export default ConfirmModal;