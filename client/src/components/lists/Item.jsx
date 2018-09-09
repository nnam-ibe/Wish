import React, { Component } from 'react';
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
import _ from 'lodash';

class Item extends Component {

	constructor(props) {
		super(props);
		let calculatedValues = this._getCalculatedValues(props.price, props.saved);

		this.state = {
			name: props.name,
			increment: props.increment,
			saved: props.saved,
			price: props.price,
			...calculatedValues
		};

	}

	componentDidUpdate(prevProps, prevState) {
		let newState = {};
		let calculatedValuesChanged = false;

		if (prevProps.name !== this.props.name) {
			newState.name = this.props.name;
		}

		if (prevProps.increment !== this.props.increment) {
			newState.increment = this.props.increment;
		}

		if (prevProps.saved !== this.props.saved) {
			calculatedValuesChanged = true;
			newState.saved = this.props.saved;
		}

		if (prevProps.price !== this.props.price) {
			calculatedValuesChanged = true;
			newState.price = this.props.price;
		}

		if (calculatedValuesChanged) {
			_.assign(newState, this._getCalculatedValues(this.props.price, this.props.saved));
		}

		if (!_.isEmpty(newState)) this.setState({ ...newState });

	}

	render() {
		return (
			<div className='item-margin'>
				<Paper className='auth-paper'>
					<div className='display-flex text-align-left ml-36'>
						<div className='flex-grow-1'>
							<Typography variant='title'>{this.state.name}</Typography>
						</div>
						<div>
							<IconButton onClick={this._editItem}>
								<ExpandIcon />
							</IconButton>
						</div>
					</div>
					<div>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>
										<IconButton onClick={this._decrementSaved}>
											<RemoveIcon/>
										</IconButton>
									</TableCell>
									<TableCell>
										<div>
											<Typography variant='caption'>Saved</Typography>
											<Typography variant='body2'>{`$${this.state.formattedSaved}`}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<Typography variant='caption'>Difference</Typography>
											<Typography variant='body2'>{`$${this.state.formattedDifference}`}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<Typography variant='caption'>Price</Typography>
											<Typography variant='body2'>{`$${this.state.formattedPrice}`}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<IconButton onClick={this._incrementSaved}>
											<AddIcon/>
										</IconButton>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</Paper>
				<LinearProgress variant="determinate" value={this.state.progress} />
			</div>
		);
	}

	_getCalculatedValues = (price, saved) => {
		let difference = this._calculateDifference(price, saved);

		return {
			difference,
			progress: this._calculateProgress(price, saved),
			formattedSaved: this._getFormattedAmount(saved),
			formattedDifference: this._getFormattedAmount(difference),
			formattedPrice: this._getFormattedAmount(price)
		};
	}

	_calculateDifference = (price, saved) => {
		let result = price - saved;
		if (result < 0) result = 0;

		return result;
	}

	_calculateProgress = (price, saved) => {
		return _.clamp((saved/price), 0, 1) * 100;
	}

	_getFormattedAmount = (amount) => {
		return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	_decrementSaved = () => {
		let saved = this.state.saved - this.state.increment;
		if (saved < 0) saved = 0;

		this._updateValues(this.state.price, saved);
	}
	_incrementSaved = () => {
		let saved = this.state.saved + this.state.increment;
		this._updateValues(this.state.price, saved);
	}

	_updateValues = (price, saved) => {
		let formattedSaved = this._getFormattedAmount(saved);
		let formattedPrice = this._getFormattedAmount(price);
		let progress = this._calculateProgress(price, saved);
		let difference = this._calculateDifference(price, saved);
		let formattedDifference = this._getFormattedAmount(difference);

		this.setState({
			price,
			saved,
			formattedPrice,
			formattedSaved,
			progress,
			difference,
			formattedDifference
		});

		this.props.updateItem({
			addTaxes: this.props.addTaxes,
			increment: this.props.increment,
			id: this.props.id,
			name: this.props.name,
			price,
			saved
		});
	}

	_editItem = () => {
		this.props.editItem(this.props.id);
	}
}

export default Item;