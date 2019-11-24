import React, { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ExpandIcon from '@material-ui/icons/ExpandMore';

function Item(props) {
	const [model, setModel] = useState(props.itemModel);

	useEffect(() => setModel(props.itemModel), [props.itemModel]);

	function decrementSaved() {
		model.decrementSaved();
		updateValues();
	}

	function incrementSaved() {
		model.incrementSaved();
		updateValues();
	}

	function updateValues() {
		setModel(model.newRef());
		props.updateItem(model.valueOf());
	}

	return (
		<div className='item-margin item-div'>
			<Paper className='auth-paper'>
				<div className='display-flex text-align-left ml-36'>
					<div className='flex-grow-1 item-name'>
						<Typography variant='h6'>{model.getName()}</Typography>
					</div>
					<div>
						<IconButton onClick={() => props.editItem(model.getId())}>
							<ExpandIcon />
						</IconButton>
					</div>
				</div>
				<div>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<IconButton onClick={decrementSaved} data-testid='item-decrement-button'>
										<RemoveIcon/>
									</IconButton>
								</TableCell>
								<TableCell>
									<div>
										<Typography variant='caption'>Saved</Typography>
										<Typography data-testid='item-saved-value' variant='subtitle2'>{`$${model.getSaved()}`}</Typography>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<Typography variant='caption'>Difference</Typography>
										<Typography data-testid='item-difference-value' variant='subtitle2'>{`$${model.getDifference()}`}</Typography>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<Typography variant='caption'>Price</Typography>
										<Typography data-testid='item-price-value' variant='subtitle2'>{`$${model.getPriceWithTax()}`}</Typography>
									</div>
								</TableCell>
								<TableCell>
									<IconButton onClick={incrementSaved} data-testid='item-increment-button'>
										<AddIcon/>
									</IconButton>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</Paper>
			<LinearProgress data-testid='item-progress-bar' variant='determinate' value={model.getProgress()} />
		</div>
	);
}

export default Item;